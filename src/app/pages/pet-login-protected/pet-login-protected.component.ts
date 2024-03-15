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
import {EnvirotrackService} from "../envirotrack/envirotrack.service";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";
import {MessageService} from "primeng/api";
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
  imports: [CommonModule, FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, CarouselTplComponent, FooterComponent, RippleModule, JsonPipe, DropdownModule, SharedComponents, NgxEchartsDirective],
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
  fuels = []
  productivityPercentile: string =''
  chartOptions!: EChartsOption | null;
  chartData: any = [];
  chartX: any = []
  markStart: any
  markEnd:any

  constructor(private http: HttpClient, private storage: StorageService, private track: EnvirotrackService, private msg: MessageService) {}



  onSelectCompany = () => {
    if (!this.selectedCompany) this.selectedCompany = this.companies[0]
    // Reset table
    this.turnover = 0
    this.employees = 0;
    this.productivityScore = 0;
    this.innovationPercent = 0;
    this.rows = []
    this.energyRows = []
    this.gridAllocationRows = []
    this.onSiteRows = []
    this.data = []
    this.fuels = []

    // Get sites report or generate new rows
    this.getPETReport(this.selectedCompany)
    this.getFuelData()
  }

  getCompanies = () => {
    // Fetch all companies
    this.track.getCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data;
      }
    })

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

    console.log('CALCULATE PER EMPLOYEE COST')

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
    console.log('CALCULATE EXTERNAL COST')

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
    console.log('CALCULATE PRODUCTIVITY SCORE')
    const totalExternalCost: number = this.calculateTotalExternalCost()
    let result = (this.turnover - totalExternalCost) / this.employees
    this.productivityScore = result;

    this.calculateProductivityComparison()
    return result ? result.toFixed(2) : 0
  }


  calculateProductivityComparison = () => {
    if (!this.sicCodeLetter || !this.employees || !this.productivityScore) return;

    this.chartData = []
    this.markStart = 0
    this.markEnd = 0

    // Sort through excel data for matching sic code letter and number of employees
    const findCorrectLetter = this.productivityData.filter((row: any) => row[1] === this.sicCodeLetter)
    const findCorrectEmployees = findCorrectLetter.filter((row: any) => this.employees >= row[2] && this.employees <= row[3])

    if (findCorrectEmployees === -1) return

    // Should i default to zero?
    const p10 = findCorrectEmployees?.[0]?.[5] !== "[c]" ? findCorrectEmployees[0][5] : null
    const p25 = findCorrectEmployees?.[0]?.[6] !== "[c]" ? findCorrectEmployees[0][6] : null
    const p50 = findCorrectEmployees?.[0]?.[7] !== "[c]" ? findCorrectEmployees[0][7] : null
    const p75 = findCorrectEmployees?.[0]?.[8] !== "[c]" ? findCorrectEmployees[0][8] : null
    const p90 = findCorrectEmployees?.[0]?.[9] !== "[c]" ? findCorrectEmployees[0][9] : null

    if (!p10 && !p25 && !p50 && !p75 && !p90) {
      return this.msg.add({
        severity:'info',
        detail: 'There is no available data for the provided details.'
      })
    }

    const counts = [p10, p25, p50, p75, p90]

      console.log(counts)
    // Get closest
    let closest = counts.reduce((prev: any, curr: any) => {
      return (Math.abs(curr - this.productivityScore) < Math.abs(prev - this.productivityScore) ? curr : prev);
    });

    // find correct closest
    const findClosestIndex = counts.findIndex((num: number) => num ===closest)
    if (findClosestIndex === -1) return;


    this.chartData = [
      ['0', 0],
      ['10', p10],
      ['25', p25],
      ['50', p50],
      ['75', p75],
      ['90', p90],
      ['100', null]
    ]

    // Return text as percentile
    switch (findClosestIndex) {
      case 0 :
        this.markStart = 0
        this.markEnd = 1
         this.productivityPercentile = '10th Percentile'
        break;
      case 1 :
        this.markStart = 0
        this.markEnd = 2
         this.productivityPercentile = '25th Percentile'
        break;
      case 2:
        this.markStart = 0
        this.markEnd = 3
         this.productivityPercentile = '50th Percentile'
        break;
      case 3:
        this.markStart = 0
        this.markEnd = 4
         this.productivityPercentile = '75th Percentile'
        break;
      case 4:
        this.markStart = 0
        this.markEnd = 5
         this.productivityPercentile = '90th Percentile'
        break;
      default:
        this.markStart = 0
        this.markEnd = 0
         this.productivityPercentile = ''
        break;
    }

    this.initChart()


  }

  sumValues = (obj:any):number => <number>Object.values(obj).reduce((a: any, b: any) => a + b, 0);

  calculateIndividualEmployeeCost = (object: any) => {
    if (!this.employees || !object.totalCost) return;
    console.log('CALCULATE INDIVIDUAL EMPLOYEE COST')
    object.secondColumn = (object.totalCost / this.employees)
  }

  calculateGroupTotalCost = (group: any) => {
    if (!group?.parent) return 0;
    console.log('CALCULATE GROUP TOTAL COST')
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

  getFuelData = () => {
    this.fuels = []

    if (this.selectedCompany) {
      this.track.getFuelData(this.selectedCompany).subscribe({
        next: (res:any) => {
          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)
          }
        },
        error: (err) => console.log(err),
        complete: () => this.assignFuelDataToCorrectCost()

      })
    }
  }

  assignFuelDataToCorrectCost = () => {
     if (!this.fuels.length) return;
     console.log(this.fuels)
     // loop through fuel types and just get total of all values/units/ total cost/

    let extractedData = this.fuels.map((fuel: any) => {

      let totalValue = 0
      let totalCost = 0
      let unit: string = ''

      fuel.rows.forEach((row: any) => {
        const findValue = row.findIndex((cell: any) => cell.name === 'Value')
        const findUnit = row.findIndex((cell: any) => cell.name === 'Unit')
        const findCost = row.findIndex((cell: any) => cell.name === 'Total')

        // Check if not available
        if (findValue !== -1) totalValue += parseFloat(row[findValue].value)
        if (findCost !== -1 ) totalCost += parseFloat(row[findCost].value)
        if (findUnit !== -1) unit = row[findUnit].value

      })

      return {
        type: fuel.type,
        totalValue,
        totalCost,
        unit: unit ? unit : 'kWh'
      }
    })

    console.log(extractedData)

    // Add to the data in the table
    extractedData.forEach((extracted: any) => {

      if (extracted.type === 'Gas') extracted.type = 'Natural Gas (Grid)'

      let foundType = this.data.findIndex((tableRow: any) => tableRow.name === extracted.type)

      if (foundType === -1) return;

      console.log(extracted.unit)

      this.data[foundType].totalUnits = extracted.totalValue
      this.data[foundType].cost = extracted.totalCost
      this.data[foundType].unitsUom = extracted.unit ? extracted.unit : 'kWh'
    })
  }


  initChart = () => {

    this.chartOptions = {
      legend: {
        show: true,
      },
      grid: {
        left: '140'
      },
      title: {
        text: `Percentiles for Sector ${this.sicCodeLetter}`,
        left: 'center',

      },
      xAxis: {
        type: 'category',
        name: 'Percentile',
        boundaryGap: false
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: `{a} <br />{b}: {c}`,
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'Labour Productivity',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      visualMap: {
        type: 'piecewise',
        show: false,
        dimension: 0,
        seriesIndex: 0,
        pieces: [
          {
            gt: this.markStart,
            lt: this.markEnd,
            color: 'rgba(0, 0, 180, 0.4)'
          },

        ]
      },
      series: [
        {
          type: 'line',
          connectNulls: true,
          smooth: 0.2,
          symbol: 'none',
          lineStyle: {
            color: '#5470C6',
            width: 3
          },
          markLine: {
            symbol: ['none', 'none'],
            label: { show: false },
            data: [{ xAxis: 1 }, { xAxis: 3 }, { xAxis: 5 }, { xAxis: 7 }]
          },
          areaStyle: {},
          data: this.chartData
        }
      ]
    }
  }

  ngOnInit() {
    this.getCompanies()
    this.getTemplate()
  }

}
