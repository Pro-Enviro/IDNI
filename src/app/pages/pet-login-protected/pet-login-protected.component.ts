import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PanelModule} from 'primeng/panel';
import {SelectButtonModule} from "primeng/selectbutton";
import {TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {CarouselTplComponent} from "../../_partials/carousel-tpl/carousel-tpl.component";
import {FooterComponent} from "../../_partials/footer/footer.component";
import {RippleModule} from "primeng/ripple";
import {CommonModule, JsonPipe} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {SharedComponents} from "../envirotrack/shared-components";
import {Mode} from "node:fs";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../_services/storage.service";
import { read, utils, writeFile } from 'xlsx';
import {arrayBuffer} from "node:stream/consumers";
const rowNames: string[] = ['Cost of Energy', 'Transportation Costs', 'Cost of Water', 'Cost of Waste', 'Cost of Raw Materials', 'Cost of Bought in Goods - Consumables and bought in parts', 'Consultancy Cost', 'Sub Contracting Cost', 'Other External Costs (Legal, rental, accounting etc)']

const energyNames: string[] = ['Electricity', 'Natural Gas (Grid)', 'Natural Gas off Grid', 'Bio Gas Off Grid', 'LPG', 'Oil', 'Kerosene', 'Bio Fuels', 'Bio Mass', 'Coal for Industrial use', 'Other']
const materialNames: string[] = ['Steel', 'Stainless Steel', 'Aluminium', 'Copper', 'Bronze', 'Titanium', 'Polymers', 'Elastomers', 'Textiles', 'Composites', 'Aggregates', 'Cement', 'Glass', 'Wood', 'Chemicals', 'Lithium', 'Magnesium', 'Other']

// const gridAllocationNames: string[] = ['kVa Availability', 'Recorded Winter Max Demand kVa']
// const onSiteNames: string[] = ['PV', 'Wind', 'Solar Thermal', 'CHP', 'Biomass', 'Hydro', 'AD', 'Other']

type UnitsUom = 'Select' | 'litres' | 'kg' | 'kWh' | 'tonnes' | 'cubic metres' | 'km' | 'miles' | 'million litres'
type RegionsOfOrigin = 'UK' | 'EU' | 'US' | 'Asia'
type UnitsOfCost = 'Cost/unit' | 'Total Cost' | 'Select'
type ModeOfTransport =
  'Select'
  | 'Van <3.5t'
  | 'Refrigerated Van <3.5t'
  | 'Van >3.5t < 7.5t'
  | 'Refrigerated Van > 3.5t < 7.5t'
  | 'HGV'
  | 'Refrigerated HGV'
type FuelTypes = 'Select' | 'Diesel' | 'Petrol' | 'LPG' | 'EV' | 'Hydrogen'
type OtherModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air'
type CompanyModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air' | 'Company Car' | 'Public Transport'
type Routes = 'Select' | 'NI to UK' | 'NI to EU' | 'NI to USA' | 'NI to RoW'
type StaffCommuteModes = 'Select' | 'On foot' | 'Cycle' | 'Public Transport' | 'Car' | 'Motorbike'


// Classes for subtables

class SubTable {
  cost: number = 0
  secondColumn: number = 0
  parent: { name: string, addRows: boolean, totalCost: number, secondColumn: number } = {
    name: '',
    totalCost: 0,
    secondColumn: 0,
    addRows: true
  }
}

class MaterialRow extends SubTable {
  name: string = ''
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  regionOfOrigin: RegionsOfOrigin = 'UK'
  scrappageAndWaste?: number = 0
}

class BoughtInParts extends SubTable {
  name: string = 'Description of Part'
  noOfParts: number = 0
  unitOfCost: UnitsOfCost = 'Select'
  regionOfOrigin: RegionsOfOrigin = 'UK'
}

class WaterUsage extends SubTable {
  name: string = 'Water Usage description '
  totalUnits: number = 0
  unitsUom: UnitsUom = 'Select'
}

class Waste extends SubTable {
  name: string = 'Description of Waste stream'
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
}

class RoadFreight extends SubTable {
  name: string = 'Road Freight description'
  mode: ModeOfTransport = 'Select'
  fuelType: FuelTypes = 'Select'
  approxMileage: number = 0
}

class OtherFreightTransportation extends SubTable {
  name: string = 'Other Freight description'
  otherModes: OtherModesOfTransport = 'Select'
  route: Routes = 'Select'
  approxMileage = 0
}

class CompanyTravel extends SubTable {
  name: string = 'Company Travel description'
  companyModeOfTransport: CompanyModesOfTransport = 'Select'
  approxMileage: number = 0;
}

class StaffCommute {
  name: string = 'Staff Commute description'
  staffCommute: StaffCommuteModes = 'Select'
  percentStaff: number = 0
  distance: number = 0
  secondColumn: number = 0
  parent: { name: string, addRows: boolean, totalCost: number, secondColumn: number } = {
    name: '',
    totalCost: 0,
    secondColumn: 0,
    addRows: true
  }
}

// Generic classes
class TableRow {
  name: string = ''
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  cost: number = 0
  unitOfCost: UnitsOfCost = 'Select'
  regionOfOrigin: RegionsOfOrigin = 'UK'
  parent?: { name: string, secondColumn: number, totalCost: number } = {
    name: '',
    secondColumn: 0,
    totalCost: 0
  }
}

class GroupItem {
  name: string = ''
  value: number = 0;
  secondColumn = 0
  parent: { name: string, secondColumn: number } = {
    name: '',
    secondColumn: 0
  }
}

@Component({
  selector: 'app-pet-login-protected',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, CarouselTplComponent, FooterComponent, RippleModule, JsonPipe, DropdownModule, SharedComponents],
  templateUrl: './pet-login-protected.component.html',
  styleUrl: './pet-login-protected.component.scss'
})

export class PetLoginProtected implements OnInit {
  // Admin
  selectedCompany!: number;
  companies: any;
  // Table Constants
  turnover: number = 0;
  template!: any
  docxInHtml!: any
  employees: number = 0;
  totalOfRows: number = 0;
  productivityScore: number = 0;
  innovationPercent: number = 0;
  staffTrainingPercent: number = 0;
  exportPercent: number = 0;
  consultancyRow = {
    name: 'Consultancy Cost',
    totalCost: 0,
    secondColumn: 0
  }
  subContractingRow = {
    name: 'Sub Contracting Cost',
    totalCost: 0,
    secondColumn: 0
  }
  otherExternalCostsRow = {
    name: 'Other External Costs (Legal, rental, accounting etc)',
    totalCost: 0,
    secondColumn: 0
  }
  // TableRows
  rows: TableRow[] = []
  energyRows: TableRow[] = []
  gridAllocationRows: TableRow[] = []
  onSiteRows: TableRow[] = []
  // For Primeng dropdowns
  unitsUom: UnitsUom[] = ['Select', 'litres', 'kg', 'kWh', 'tonnes', 'cubic metres', 'km', 'miles', 'million litres']
  regionOfOrigin: RegionsOfOrigin[] = ['UK', 'EU', 'US', 'Asia']
  modeOfTransport: ModeOfTransport[] = ['Select', 'Van <3.5t', 'Refrigerated Van <3.5t', 'Van >3.5t < 7.5t', 'Refrigerated Van > 3.5t < 7.5t', 'HGV', 'Refrigerated HGV']
  fuelTypes: FuelTypes[] = ['Select', 'Diesel', 'Petrol', 'LPG', 'EV', 'Hydrogen']
  otherModesOfTransport: OtherModesOfTransport[] = ['Select', 'Rail', 'Sea', 'Air']
  routes: Routes[] = ['Select', 'NI to UK', 'NI to EU', 'NI to USA', 'NI to RoW']
  companyModesOfTransport: CompanyModesOfTransport[] = ['Select', 'Rail', 'Sea', 'Air', 'Company Car', 'Public Transport']
  staffCommute: StaffCommuteModes[] = ['Select', 'On foot', 'Cycle', 'Public Transport', 'Car', 'Motorbike']
  unitsOfCost: UnitsOfCost[] = ['Cost/unit', 'Total Cost', 'Select']
  data: any = []
  twoDecimalPlaces ={
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
  productivityData!: any // Excel spreadsheet
  sicCodeData!: any // Excel Spreadsheet
  sicCode: string = ''
  sicCodeLetter: string = ''
  constructor(private http: HttpClient, private storage: StorageService) {}



  onSelectCompany = () => {
    if (!this.selectedCompany) this.selectedCompany = this.companies[0].id;
    // Reset table
    this.turnover = 0
    this.employees = 0;
    this.productivityScore = 0;
    this.innovationPercent = 0;
    this.rows = []
    this.energyRows = []
    this.gridAllocationRows = []
    this.onSiteRows = []

    // Get sites report or generate new rows
    this.getPETReport(this.selectedCompany)
  }

  getCompanies = () => {
    this.getPETReport(this.selectedCompany)
  }

  getPETReport = (id: number) => {
    this.generateClasses('Cost of Energy', TableRow, energyNames)
    this.generateClasses('Cost of Raw Materials ', MaterialRow, materialNames)
    this.generateClasses('Cost of Bought in Goods - Consumables and bought in parts', BoughtInParts)
    this.generateClasses('Water Usage', WaterUsage)
    this.generateClasses('Waste', Waste)
    this.generateClasses('Road Freight', RoadFreight)
    this.generateClasses('Other Freight', OtherFreightTransportation)
    this.generateClasses('Company Travel', CompanyTravel)
    this.generateClasses('Staff Commute', StaffCommute)


  }

  sicCodeToLetter = () => {
    if (this.sicCode.length < 5) {
      this.sicCodeLetter = ''
      return;
    };
    // Select correct SIC code letter
    const foundRow = this.sicCodeData.find((row: any) => row[1].toString() === this.sicCode)
    if (foundRow) this.sicCodeLetter = foundRow[0]
    else this.sicCodeLetter = ''
  }

  generateClasses = (rowTitle: string, classToUse: any, namesArray?: string[]) => {
    if (namesArray?.length) {
      const classArray = namesArray.map((name: string) => {
        let newClass = new classToUse()
        newClass.name = name
        newClass.parent.name = rowTitle
        if (newClass.parent.addRows) {
          newClass.parent.addRows = true
        }
        return newClass;
      })
      this.data.push(...classArray)
    } else {
      let newClass = new classToUse()
      this.generateRows(newClass, rowTitle, true)
    }
  }

  generateRows = (array: string[] | any, parentName: string, isClass?: boolean) => {

    if (isClass) {
      array.parent.name = parentName
      this.data.push(array)
    } else {
      array.forEach((name: string) => {
        let newGroupItem = new GroupItem()
        newGroupItem.name = name;
        newGroupItem.parent.name = parentName
        this.data.push(newGroupItem)
      })
    }
  }

  createNewTableRow = (group: any) => {
    console.log(group)
    let copy = {...group, name: `${group.parent.name} description`, cost: 0}
    let findObject = this.data.findLastIndex((item: any) => item.parent.name === group.parent.name)

    if (findObject === -1) return;
    this.data.splice(findObject + 1, 0, copy)
  }


  calculatePerEmployeeCost = (groups?: any) => {
    if (!this.employees) return;

    let employeeTotal = 0
    // Update the per employee number for only modified number
    if (groups) {
      let parentName = groups.parent.name
      this.data = this.data.map((item: any) => {
        if (item.parent.name === parentName) {
          item.parent.secondColumn = item.parent.totalCost / this.employees
          employeeTotal = item.parent.secondColumn
        }
        return item;
      })
      // If updating the turnover or the no. of employees. Recalculate all per employee costs
    } else {
      this.data = this.data.map((item: any) => {
        item.parent.secondColumn = item.parent.totalCost / this.employees
        employeeTotal = item.parent.secondColumn
        return item;
      })

      this.consultancyRow.secondColumn = this.consultancyRow.totalCost / this.employees
      this.subContractingRow.secondColumn = this.subContractingRow.totalCost / this.employees
      this.otherExternalCostsRow.secondColumn = this.otherExternalCostsRow.totalCost / this.employees
    }
    return employeeTotal
  }

  calculateTotalExternalCost = () => {
    const oneOfEachParent: any = {
      consultancyCost: this.consultancyRow.totalCost,
      subContractingRow: this.subContractingRow.totalCost,
      otherExternalCostsRow: this.otherExternalCostsRow.totalCost,
    }

    this.data.forEach((row: any) => {
      if (!oneOfEachParent[row.parent.name]) {
        oneOfEachParent[row.parent.name] = row.parent.totalCost
      }
    })

    let summedValues = this.sumValues(oneOfEachParent)

    return summedValues ? summedValues : 0

  }

  calculateProductivityScore = () =>{
    // (Turnover - Total external costs) / no. of employees
    if (!this.employees || !this.turnover) return;
    const totalExternalCost: number = this.calculateTotalExternalCost()
    let result = (this.turnover - totalExternalCost) / this.employees
    this.productivityScore = result;
    return result ? result.toFixed(2) : 0
  }


  calculateProductivityComparison = () => {
    if (!this.sicCodeLetter || !this.employees || !this.productivityScore) return;

    // Sort through excel data for matching sic code letter and number of employees
    const findCorrectLetter = this.productivityData.filter((row: any) => row[1] === this.sicCodeLetter)
    const findCorrectEmployees = findCorrectLetter.filter((row: any) => this.employees >= row[2] && this.employees <= row[3])

    if (findCorrectEmployees === -1) return


    // Should i default to zero?
    const p10 = findCorrectEmployees?.[0]?.[5] !== '"[c]"' ? findCorrectEmployees[0][5] : 0
    const p25 = findCorrectEmployees?.[0]?.[6] !== '"[c]"' ? findCorrectEmployees[0][6] : 0
    const p50 = findCorrectEmployees?.[0]?.[7] !== '"[c]"' ? findCorrectEmployees[0][7] : 0
    const p75 = findCorrectEmployees?.[0]?.[8] !== '"[c]"' ? findCorrectEmployees[0][8] : 0
    const p90 = findCorrectEmployees?.[0]?.[9] !== '"[c]"' ? findCorrectEmployees[0][9] : 0

    const counts = [p10, p25, p50, p75, p90]


    // Get closest
    let closest = counts.reduce((prev: any, curr: any) => {
      return (Math.abs(curr - this.productivityScore) < Math.abs(prev - this.productivityScore) ? curr : prev);
    });

    // find correct closest
    const findClosestIndex = counts.findIndex((num: number) => num ===closest)
    if (findClosestIndex === -1) return;

    // Return text as percentile
    switch (findClosestIndex) {
      case 0 :
        return 'p10'
      case 1 :
        return 'p25'
      case 2:
        return 'p50'
      case 3:
        return 'p75'
      case 4:
        return 'p90'
      default:
        return ''
    }
  }

  sumValues = (obj:any):number => <number>Object.values(obj).reduce((a: any, b: any) => a + b, 0);

  calculateIndividualEmployeeCost = (object: any) => {
    if (!this.employees) return;
    object.secondColumn = (object.totalCost / this.employees)
  }

  calculateGroupTotalCost = (group: any) => {
    if (!group?.parent) return 0;

    const parentName = group?.parent.name
    const total = this.data.filter((item: any) => item.parent.name === parentName).reduce((acc: number, curr: any) => {
      if (curr.cost !== undefined && curr.cost !== null) {
        return acc + parseFloat(curr.cost)
      } else {
        return acc;
      }
    }, 0)

    this.data = this.data.map((item: any) => {
      if (item.parent.name === parentName) {
        item.parent.totalCost = total;
        if (this.employees > 0) {
          item.parent.secondColumn = (total / this.employees).toFixed(2)
        }
      }
      return item
    })


    return total !== undefined ? total : 0
  }

  createReportObject = () => {
    // const reportValues = {
    //   turnover: this.turnover,
    //   employees: this.employees,
    //   totalOfRows: this.totalOfRows,
    //   productivityScore: this.productivityScore,
    //   innovationPercent: this.innovationPercent,
    //   rows: this.rows,
    //   energyRows: this.energyRows,
    //   gridAllocationRows: this.gridAllocationRows,
    //   onSiteRows: this.onSiteRows
    // }
    //
    // console.log(reportValues)
    // return reportValues;
  }

  saveReport = () => {
    // const report = this.createReportObject()
  }

  getTemplate = () => {
    // Change content id to match correct selected template
    let id = 20;
    let sicCodeId = 21

    // TODO: Protect backend links with .env?
    this.http.get(`https://ecp.proenviro.co.uk/items/content/${id}`).subscribe({
      next: (res: any) => {
        this.template = `https://ecp.proenviro.co.uk/assets/${res.data.file}?token=${this.storage.get('access_token')}`

        this.http.get(this.template, {
          responseType: 'arraybuffer'
        }).subscribe({
          next: (buffer: ArrayBuffer) => {
            const workbook = read(buffer);
            const sheets = workbook.SheetNames
            const worksheet = workbook.Sheets[workbook.SheetNames[3]];
            const raw_data = utils.sheet_to_json(worksheet, {header: 1});

            this.productivityData = raw_data
          }
        })
      }
    })

    this.http.get(`https://ecp.proenviro.co.uk/items/content/${sicCodeId}`).subscribe({
      next: (res: any) => {
        this.template = `https://ecp.proenviro.co.uk/assets/${res.data.file}?token=${this.storage.get('access_token')}`

        this.http.get(this.template, {
          responseType: 'arraybuffer'
        }).subscribe({
          next: (buffer: ArrayBuffer) => {
            const workbook = read(buffer);
            const sheets = workbook.SheetNames
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const raw_data = utils.sheet_to_json(worksheet, {header: 1});

            this.sicCodeData = raw_data

          }
        })
      }
    })
  }

  ngOnInit() {
    this.getCompanies()
    this.getTemplate()
  }

}
