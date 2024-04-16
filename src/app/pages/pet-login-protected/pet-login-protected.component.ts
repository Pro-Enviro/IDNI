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
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../_services/storage.service";
import {EnvirotrackService} from "../envirotrack/envirotrack.service";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";
import {MessageService} from "primeng/api";
import {DbService} from "../../_services/db.service";
import {GlobalService} from "../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";

import {
  energyNames, UnitsUom,
  RegionsOfOrigin,
  MaterialFormats,
  MaterialTypes,
  OtherMaterials,
  FuelTypes,
  OtherMetals,
  SteelMaterials,
  UnitsOfCost,
  Routes,
  OtherModesOfTransport,
  CompanyModesOfTransport,
  ModeOfTransport,
  Plastics,
  StaffCommuteModes, PetToolData, years,
} from "./pet-tool-types";
import {
  TableRow,
  OtherExternalCosts,
  MaterialRow,
  OtherFreightTransportation,
  RoadFreight,
  Waste,
  StaffCommute,
  WaterUsage,
  CompanyTravel,
  GroupItem,
  BoughtInParts
} from "./pet-tool-classes";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";





@Component({
  selector: 'app-pet-login-protected',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, CarouselTplComponent, FooterComponent, RippleModule, JsonPipe, DropdownModule, SharedComponents, NgxEchartsDirective, SidebarModule],
  templateUrl: './pet-login-protected.component.html',
  styleUrl: './pet-login-protected.component.scss'
})

export class PetLoginProtected implements OnInit {
  url:string = 'https://app.idni.eco'
  sidebarVisible: boolean = false
  // Admin
  selectedCompany!: number;
  companies: any;
  // Table Constants
  turnover: number = 0;
  template!: any
  employees: number = 0;
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
    secondColumn: 0,
  }
  // TableRows
  rows: TableRow[] = []
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
  materialTypes: MaterialTypes[] = ['Steel', 'Other Metals', 'Plastics', 'Other Materials']
  steelMaterials: SteelMaterials[] = ['Mild Steel', 'Carbon Steel', 'Tool Steel D2', 'Tool Steel H13', 'Tool Steel M2', 'Tool Steel S275', 'Tool Steel S325', 'Alloy Steel 4340', 'Alloy Steel 4140', 'Alloy Steel 4150', 'Alloy Steel 9310', 'Alloy Steel 52100', 'Stainless Steel 304', 'Stainless Steel 316', 'Duplex Steel']
  otherMetals: OtherMetals[] = ['Aluminium 1000', 'Aluminium 2000', 'Aluminium 6000', 'Aluminium 7000', 'Duralumin', 'Aluminium Lithium', 'Copper', 'Bronze', 'Titanium', 'Lithium', 'Magnesium']
  plastics: Plastics[] = ['ABS', 'PA', 'PET', 'PP', 'PU', 'POM', 'PEEK', 'PE', 'PVC', 'PPS', 'Elastomers', 'Composites', 'Textiles']
  otherMaterials: OtherMaterials[] = ['Composites', 'Textiles', 'Cement', 'Aggregate', 'Sand', 'Glass', 'Chemicals', 'Hardwood', 'Softwood']
  materialFormats: MaterialFormats[] = ['Sheet', 'Profile', 'Filament/Fibre', 'Ingot/Billet', 'Natural State', 'Powder', 'Granule', 'Liquid', 'Gas', 'Recyclate']
  years = years
  selectedYear: string = years[0] || '2024'
  data: any = []
  twoDecimalPlaces = {minimumFractionDigits: 0, maximumFractionDigits: 2,}
  productivityData!: any// Excel spreadsheet
  sicCodeData!: any // Excel Spreadsheet
  sicCode: any = {}
  sicCodeLetter: string = ''
  fuels = []
  externalCost: number = 0
  productivityPercentile: string = ''
  chartOptions!: EChartsOption | null;
  chartData: [string, (string | number)][] | null = []
  markStart: number | undefined
  markEnd: number | undefined
  isConsultant: boolean = false;
  allPetData: PetToolData[] = []
  selectedPetId: number | undefined
  filteredSicCodes: any[] = []

  constructor(private http: HttpClient, private storage: StorageService, private track: EnvirotrackService, private msg: MessageService, private db: DbService, private global: GlobalService) {}

  onSelectCompany = () => {
    if (!this.selectedCompany) this.selectedCompany = this.companies[0]

    // Reset table
    this.resetTableValues()
    this.allPetData = []

    // Get sites report or generate new rows
    this.getPETReport(this.selectedCompany)
    this.getFuelData()
  }

  getCompanies = () => {
    // Fetch all companies
    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.onSelectCompany()
              }
            }
          })
        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.selectedCompany = res.data[0].id
              this.isConsultant = true;
            }
          })
      }

      }
    })
  }

  onSelectYear = () => {
    if (!this.allPetData.length) return;
    const selectedYear = this.allPetData.find((petDataRow: PetToolData) => petDataRow.year === this.selectedYear)

    if (selectedYear){
      this.fillTable(selectedYear)
      this.selectedPetId = selectedYear.id
    } else {
      this.generateNewTable()
    }
  }

  resetTableValues = () => {
    this.data = []
    this.employees = 0
    this.turnover = 0
    this.innovationPercent = 0
    this.staffTrainingPercent = 0
    this.exportPercent = 0
    this.productivityScore = 0
    this.productivityPercentile = ''
    this.sicCode = ''
    this.sicCodeLetter = ''
    this.fuels = []

    this.chartData = null
    this.chartOptions = null;
  }

  fillTable = (petData: PetToolData) => {
    if (!petData) return;

    this.data = []
    this.selectedPetId = petData.id
    this.employees = Number(petData.number_of_employees || 0)
    this.turnover = Number(petData.turnover || 0)
    this.staffTrainingPercent = Number(petData.training_percent || 0)
    this.sicCode = JSON.parse(petData.sic_code) || {}
    this.sicCodeLetter = petData.sic_letter || ''
    this.productivityScore = Number(petData.productivity_score || 0)
    this.innovationPercent = Number(petData.innovation_percent || 0)
    this.exportPercent = Number(petData.export_percent || 0)
    this.productivityPercentile = petData.productivity_comparison || ''
    this.markStart = Number(petData.mark_start || 0)
    this.markEnd = Number(petData.mark_end || 0)
    this.selectedYear = petData.year || '2024'

    // All dynamic rows added back from save
    const energy = JSON.parse(petData.cost_of_energy)
    const rawMats = JSON.parse(petData.cost_of_raw_materials)
    const boughtInGoods = JSON.parse(petData.cost_of_bought_in_goods)
    const roadFreight = JSON.parse(petData.road_freight)
    const otherFreight = JSON.parse(petData.other_freight)
    const companyTravel = JSON.parse(petData.company_travel)
    const staffCommute = JSON.parse(petData.staff_commute)
    const waste = JSON.parse(petData.waste)
    const waterUsage = JSON.parse(petData.water_usage)
    const otherCosts = JSON.parse(petData.other_external_costs)

    this.data.push(...energy, ...rawMats, ...boughtInGoods, ...waterUsage,...waste, ...roadFreight, ...otherFreight, ...companyTravel, ...staffCommute, ...otherCosts)
  }


  generateNewTable = () => {

    this.resetTableValues()

    this.generateClasses('Cost of Energy', TableRow, energyNames)
    this.generateClasses('Cost of Raw Materials', MaterialRow)
    this.generateClasses('Cost of Bought in Goods - Consumables and bought in parts', BoughtInParts)
    this.generateClasses('Water Usage', WaterUsage)
    this.generateClasses('Waste', Waste)
    this.generateClasses('Road Freight', RoadFreight)
    this.generateClasses('Other Freight', OtherFreightTransportation)
    this.generateClasses('Company Travel', CompanyTravel)
    this.generateClasses('Staff Commute', StaffCommute)
    this.generateClasses('Other External Costs (Legal, rental, accounting etc)', OtherExternalCosts, ['Consultancy Cost', 'Sub Contracting Cost'])

    this.calculateTotalExternalCost()
  }


  getPETReport = (id: number) => {
    if (!id) return;

    this.db.getPetData(id).subscribe({
      next: (res: any) => {
        if (res.data.length) {
          this.allPetData = res.data;
          this.fillTable(this.allPetData[0])
          this.calculateProductivityComparison()
        } else {
          // If no saved data
          this.generateNewTable()
        }
      }
    })
  }

  sicCodeToLetter = () => {

    if (this.sicCode.sector < 5) {
      return;
    }
    // Select correct SIC code letter
    const foundRow = this.sicCodeData.find((row: any) => row.sector === this.sicCode.sector)

    if (foundRow) {
      this.sicCodeLetter = foundRow.sic_number
      this.calculatePerEmployeeCost()
    } else {
      this.sicCodeLetter = ''
    }
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

    let copy = {...group, name: `${group.parent.name} description`, cost: 0}
    let findObject = this.data.findLastIndex((item: any) => item.parent.name === group.parent.name)

    if (findObject === -1) return;
    this.data.splice(findObject + 1, 0, copy)
  }


  calculatePerEmployeeCost = (groups?: any) => {
    this.calculateTotalExternalCost()

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

    this.externalCost = summedValues ? summedValues : 0

    this.calculateProductivityScore()

    return summedValues ? summedValues : 0

  }

  calculateProductivityScore = () => {
    // (Turnover - Total external costs) / no. of employees
    if (!this.employees || !this.turnover) return;
    const totalExternalCost: number = this.externalCost
    let result = (this.turnover - totalExternalCost) / this.employees
    this.productivityScore = result ? result : 0;

    this.calculateProductivityComparison()
    return result ? result.toFixed(2) : 0
  }


  calculateProductivityComparison = () => {
    if (!this.sicCodeLetter || !this.employees || !this.productivityScore) return;

    this.chartData = []
    this.markStart = 0
    this.markEnd = 0

    // Sort through excel data for matching sic code letter and number of employees

    const findCorrectLetter = this.productivityData?.filter((row: any) => row.sic_section === this.sicCodeLetter)
    if (!findCorrectLetter) return null;


    const findCorrectEmployees = findCorrectLetter.filter((row: any) => this.employees >= row.from && this.employees <= row.to)[0]
    if (findCorrectEmployees === -1) return

    // Should i default to zero?
    const p10 = findCorrectEmployees?.p10 !== "[c]" ? findCorrectEmployees.p10 : null
    const p25 = findCorrectEmployees?.p25 !== "[c]" ? findCorrectEmployees.p25 : null
    const p50 = findCorrectEmployees?.p50 !== "[c]" ? findCorrectEmployees.p50 : null
    const p75 = findCorrectEmployees?.p75 !== "[c]" ? findCorrectEmployees.p75 : null
    const p90 = findCorrectEmployees?.p90 !== "[c]" ? findCorrectEmployees.p90 : null

    if (!p10 && !p25 && !p50 && !p75 && !p90) {
      return this.msg.add({
        severity: 'info',
        detail: 'There is no available data for the provided details.'
      })
    }

    const counts = [p10, p25, p50, p75, p90]

    // Get closest
    let closest = counts.reduce((prev: any, curr: any) => {
      return (Math.abs(curr - this.productivityScore) < Math.abs(prev - this.productivityScore) ? curr : prev);
    });

    // find correct closest
    const findClosestIndex = counts.findIndex((num: number) => num === closest)
    if (findClosestIndex === -1) return;


    this.chartData = [
      ['0', 0],
      ['10', p10],
      ['25', p25],
      ['50', p50],
      ['75', p75],
      ['90', p90],
      ['100', p90 * 1.5]
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

  sumValues = (obj: any): number => <number>Object.values(obj).reduce((a: any, b: any) => a + b, 0);

  calculateIndividualEmployeeCost = (object: any) => {
    if (!this.employees || !object.totalCost) return;
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

  getProductivityData = () => {
    this.http.get(`${this.url}/items/sic_codes?limit=-1`).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.sicCodeData = res.data
        }
      }
    })

    this.http.get(`${this.url}/items/productivity_data`).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.productivityData = res.data
        }
      }
    })
  }

  getFuelData = () => {
    this.fuels = []

    if (this.selectedCompany) {

      this.track.getFuelData(this.selectedCompany).subscribe({
        next: (res: any) => {
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
        if (findCost !== -1) totalCost += parseFloat(row[findCost].value)
        if (findUnit !== -1) unit = row[findUnit].value
      })

      return {
        type: fuel.type,
        totalValue,
        totalCost,
        unit: unit ? unit : 'kWh'
      }
    })


    // Add to the data in the table
    extractedData.forEach((extracted: any) => {

      if (extracted.type === 'Gas') extracted.type = 'Natural Gas (Grid)'

      let foundType = this.data.findIndex((tableRow: any) => tableRow.name === extracted.type)

      if (foundType === -1) return;

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
            label: {show: false},
            data: [{xAxis: 1}, {xAxis: 3}, {xAxis: 5}, {xAxis: 7}]
          },
          areaStyle: {},
          data: this.chartData as Array<[string, (string | number)]>
        }
      ]
    }
  }

  savePETdata = () => {
    const objectToSave: PetToolData = {
      year: this.selectedYear,
      company_id: this.selectedCompany,
      sic_code: this.sicCode,
      sic_letter: this.sicCodeLetter,
      turnover: this.turnover,
      number_of_employees: this.employees,
      productivity_score: this.productivityScore,
      innovation_percent: this.innovationPercent,
      training_percent: this.staffTrainingPercent,
      export_percent: this.exportPercent,
      productivity_comparison: this.productivityPercentile,
      mark_start: this.markStart,
      mark_end: this.markEnd,
      cost_of_energy: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Cost of Energy')),
      cost_of_raw_materials: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Cost of Raw Materials')),
      cost_of_bought_in_goods: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Cost of Bought in Goods - Consumables and bought in parts')),
      water_usage: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Water Usage')),
      waste: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Waste')),
      road_freight: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Road Freight')),
      other_freight: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Other Freight')),
      company_travel: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Company Travel')),
      staff_commute: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Staff Commute')),
      other_external_costs: JSON.stringify(this.data.filter((row: any) => row.parent.name === 'Other External Costs (Legal, rental, accounting etc)')),
    }

    // console.log(this.data)
    // return console.log(objectToSave)

    if (!this.selectedCompany) return;

    const token = this.storage.get('access_token');
    if (!token) return;


    // Check if already saved - if not post a new row to pet_data
    if (this.selectedPetId) {
      console.log('Handle patch')
      this.db.patchPetData(this.selectedPetId, objectToSave).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Data saved'
          })

          // Replace data in petDataArray with res
          const getIdFromPetData = this.allPetData.findIndex((petRow: PetToolData) => petRow.id === this.selectedPetId)
          this.allPetData.splice(getIdFromPetData, 1, res.data)
        }
      })
    } else {
      this.db.savePetData(objectToSave).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Data saved'
          })

          this.allPetData.push(res.data)
        },
        error: (error) => console.log(error)
      })
    }

  }

  filterSicCode(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.sicCodeData as any[]).length; i++) {
      let sicCode = (this.sicCodeData as any[])[i];
      let sicCodeDetail = (this.sicCodeData as any[]) [i]
      if (sicCode.sector.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(sicCode);
      }
      if (sicCodeDetail.details.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(sicCodeDetail);
      }
    }

    this.filteredSicCodes = filtered;

  }


  ngOnInit() {
    this.getCompanies()
    this.getProductivityData()
  }

}

