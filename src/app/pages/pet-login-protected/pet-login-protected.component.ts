import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PanelModule} from 'primeng/panel';
import {SelectButtonModule} from "primeng/selectbutton";
import {Table, TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
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
import {DividerModule} from "primeng/divider";
import {TypeChartComponent} from "../envirotrack/report/type-chart/type-chart.component";
import {json} from "node:stream/consumers";
import {ScopeChartComponent} from "../envirotrack/report/scope-chart/scope-chart.component";


@Component({
  selector: 'app-pet-login-protected',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, RippleModule, JsonPipe, DropdownModule, SharedComponents, NgxEchartsDirective, SidebarModule, DividerModule, TypeChartComponent, ScopeChartComponent],
  templateUrl: './pet-login-protected.component.html',
  styleUrl: './pet-login-protected.component.scss'
})

export class PetLoginProtected implements OnInit {
  url: string = 'https://app.idni.eco'
  sidebarVisible: boolean = false
  // Admin
  selectedCompany!: number;
  companies: any;
  // Table Constants
  turnover: number = 0;
  template!: any
  employees: number = 0;
  output: number = 0;
  outputChoices: string[] = ['Litres', 'Tonnes', 'Parts', 'Products', 'Licenses'];
  outputUnit: string = ''
  productivityScore: number = 0;
  innovationPercent: number = 0;
  staffTrainingPercent: number = 0;
  exportPercent: number = 0;
  breakDownChartData: any[] = [];
  envirotrackData?: { name: string, value: number | string }
  breakDownScope: any[] = []

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
  unitsUom: UnitsUom[] = ['Select', 'litres', 'kg', 'kWh', 'tonnes', 'metres', 'cubic metres', 'km', 'miles', 'million litres']
  regionOfOrigin: RegionsOfOrigin[] = ['NI', 'UK', 'EU', 'US', 'Asia', 'ROW']
  modeOfTransport: ModeOfTransport[] = ['Select', 'Van <3.5t', 'Refrigerated Van <3.5t', 'Van >3.5t < 7.5t', 'Refrigerated Van > 3.5t < 7.5t', 'HGV', 'Refrigerated HGV']
  fuelTypes: FuelTypes[] = ['Select', 'Diesel', 'Petrol', 'LPG', 'EV', 'Hydrogen']
  otherModesOfTransport: OtherModesOfTransport[] = ['Select', 'Rail', 'Sea', 'Air']
  routes: Routes[] = ['Select', 'NI to UK', 'NI to EU', 'NI to USA', 'NI to RoW']
  companyModesOfTransport: CompanyModesOfTransport[] = ['Select', 'Rail', 'Sea', 'Air', 'Company Car', 'Public Transport']
  staffCommute: StaffCommuteModes[] = ['Select', 'On foot', 'Cycle', 'Public Transport', 'Car', 'Motorbike']
  unitsOfCost: UnitsOfCost[] = ['Cost/unit', 'Total Cost', 'Select']
  materialTypes: MaterialTypes[] = ['Steel', 'Other Metals', 'Plastics', 'Food And Drink', 'Gasses', 'Other Materials',]
  steelMaterials: SteelMaterials[] = ['Mild Steel', 'Carbon Steel', 'Tool Steel D2', 'Tool Steel H13', 'Tool Steel M2', 'Tool Steel S275', 'Tool Steel S325', 'Alloy Steel 4340', 'Alloy Steel 4140', 'Alloy Steel 4150', 'Alloy Steel 9310', 'Alloy Steel 52100', 'Stainless Steel 304', 'Stainless Steel 316', 'Duplex Steel', 'Hardox series 400', 'Hardox series 500', 'Hardox series 600', 'Inconel series 600', 'Inconel series 700']
  otherMetals: OtherMetals[] = ['Aluminium 1000', 'Aluminium 2000', 'Aluminium 6000', 'Aluminium 7000', 'Duralumin', 'Aluminium Lithium', 'Copper', 'Bronze', 'Titanium', 'Lithium', 'Magnesium']
  plastics: Plastics[] = ['ABS', 'PA', 'PET', 'PP', 'PU', 'POM', 'PEEK', 'PE', 'PVC', 'PPS', 'Elastomers', 'Composites', 'Textiles']
  otherMaterials: OtherMaterials[] = ['Composites', 'Textiles', 'Cement', 'Aggregate', 'Sand', 'Glass', 'Chemicals', 'Hardwood', 'Softwood', 'MDF', 'Marine plywood', 'Interior plywood', 'Plasterboard', 'Insulation', 'Wool', 'Natural fibre',
    'Paper',
    'Carton board',
    'Corrugated cardboard',
    'Gypsum',
    'Clay',
    'Nitrogen',
    'Oxygen',
    'Hydrogen',
    'Ammonia',
    'Tungsten',
    'Argon',
    'CO2',
    'Caking agents',
    'Acids',
    'Alkalis',
    'Active Pharmaceutical Ingredients',
    'Adhesives',
    'Paints',
    'Talcs and Fillers',
  ]
  materialFormats: MaterialFormats[] = ['Sheet', 'Profile', 'Filament/Fibre', 'Ingot/Billet', 'Natural State', 'Powder', 'Granule', 'Liquid', 'Gas', 'Recyclate']
  foodFormats: string[] = [
    "Vegetables",
    "Fruit",
    "Cereals",
    "Beans and Pulses",
    "Soya",
    "Wheat",
    "Butter",
    "Milk",
    "Yeast",
    "Flour",
    "Salts",
    "Sugars",
    "Oils",
    "Fats",
    "Animal Proteins",
    "Non Animal Proteins",
    "Vitamins",
    "Minerals",
    "Preservatives",
    "Cheese",
    "Herbs",
    "Spices",
    "Flavouring",
    "Eggs",
    "Alcohol",
    "Rice",
    "CO2",
    "Acids",
    "Alkalis"
  ];
  gasMaterials: string [] = ['test', ' test2']
  years = years
  selectedYear: string = years[0] || '2024'
  data: any = []
  twoDecimalPlaces = {minimumFractionDigits: 0, maximumFractionDigits: 2,}
  noDecimals = {minimumFractionDigits: 0, maximumFractionDigits: 0};
  productivityData!: any// Excel spreadsheet
  sicCodeData!: any // Excel Spreadsheet
  sicCode: any = {}
  sicCodeLetter: string = ''
  fuels = []
  externalCost: number | undefined
  productivityPercentile: string = ''
  chartOptions!: EChartsOption | null;
  gaugeChartOptions!: EChartsOption | null;
  co2eBreakdown!: EChartsOption | null;
  co2eScope!: EChartsOption | null;
  chartData: [string, (string | number)][] | null = []
  markStart: number | undefined
  markEnd: number | undefined
  isConsultant: boolean = false;
  allPetData: PetToolData[] = []
  selectedPetId: number | undefined
  filteredSicCodes: any[] = []


  constructor(private http: HttpClient, private storage: StorageService, private track: EnvirotrackService, private msg: MessageService, private db: DbService, private global: GlobalService) {
  }

  onSelectCompany = () => {
    if (!this.selectedCompany) this.selectedCompany = this.companies[0].id
    // Reset table
    this.resetTableValues()
    this.allPetData = []

    // Get sites report or generate new rows
    this.getPETReport(this.selectedCompany)
    this.getFuelData()
    this.getData(this.selectedCompany)

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
        } else if (res.role.name === 'consultant') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.isConsultant = true
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
    if (!this.allPetData.length) return
    const selectedYear = this.allPetData.find((petDataRow: PetToolData) => petDataRow.year === this.selectedYear)

    if (selectedYear) {
      this.fillTable(selectedYear)
      this.selectedPetId = selectedYear.id
    } else {
      this.generateNewTable()
      this.selectedPetId = undefined
    }
  }

  resetTableValues = () => {
    this.data = []
    this.employees = 0
    this.output = 0;
    this.turnover = 0
    this.innovationPercent = 0
    this.staffTrainingPercent = 0
    this.exportPercent = 0
    this.productivityScore = 0
    this.productivityPercentile = ''
    this.sicCode = ''
    this.sicCodeLetter = ''
    this.fuels = []
    this.externalCost = 0;
    this.chartData = null
    this.chartOptions = null;
    this.gaugeChartOptions = null;
    this.co2eBreakdown = null;
    this.co2eScope = null;
  }

  fillTable = (petData: PetToolData) => {
    if (!petData) return;


    this.data = []
    this.selectedPetId = petData.id
    this.employees = Number(petData.number_of_employees || 0)
    this.output = Number(petData.annual_output || 0)
    this.outputUnit = petData?.output_unit
    this.turnover = Number(petData.turnover || 0)
    this.staffTrainingPercent = Number(petData.training_percent || 0)
    this.sicCode = petData?.sic_code !== '' ? JSON.parse(petData?.sic_code) : ''
    this.sicCodeLetter = petData.sic_letter || ''
    this.productivityScore = Number(petData.productivity_score || 0)
    this.innovationPercent = Number(petData.innovation_percent || 0)
    this.exportPercent = Number(petData.export_percent || 0)
    this.productivityPercentile = petData.productivity_comparison || ''
    this.markStart = Number(petData.mark_start || 0)
    this.markEnd = Number(petData.mark_end || 0)
    this.selectedYear = petData.year || '2024'
    this.externalCost = Number(petData.total_external_costs) || 0


    if (this.outputUnit !== null) {
      // Check if exists in output choices first
      if (!this.outputChoices.find((choice: any) => choice === this.outputUnit)) {
        this.outputChoices.unshift(this.outputUnit)
      }
    }

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


    this.data.push(...energy, ...rawMats, ...boughtInGoods, ...waterUsage, ...waste, ...roadFreight, ...otherFreight, ...companyTravel, ...staffCommute, ...otherCosts)
    // console.log(this.data)

    this.calculateProductivityScore()

  }


  generateNewTable = () => {
    this.resetTableValues()

    this.generateClasses('Cost of Energy', TableRow, energyNames)
    const rawMats = this.generateClasses('Cost of Raw Materials', MaterialRow)
    this.generateClasses('Cost of Bought in Goods - Consumables and bought in parts', BoughtInParts)
    this.generateClasses('Water Usage', WaterUsage)
    this.generateClasses('Waste', Waste)
    this.generateClasses('Road Freight', RoadFreight)
    this.generateClasses('Other Freight', OtherFreightTransportation)
    this.generateClasses('Company Travel', CompanyTravel)
    // this.generateClasses('Staff Commute', StaffCommute)

    this.generateClasses('Other External Costs (Legal, rental, accounting etc)', OtherExternalCosts, ['Consultancy Cost', 'Sub Contracting Cost'])

    // Generate extra rows for Raw Materials
    for (let i = 0; i < 9; i++) {
      this.createNewTableRow(rawMats)
    }

    this.calculateTotalExternalCost()
  }


  getPETReport = (id: number) => {
    if (!id) return;


    this.db.getPetData(id).subscribe({
      next: (res: any) => {
        if (res.data.length) {
          this.allPetData = res.data;

          // Adding custom options to the dropdown menu
          this.allPetData.forEach((year: PetToolData) => {
            const json = JSON.parse(year.cost_of_raw_materials)
            json.forEach((row: any) => {

              if (!this.materialTypes.includes(row.type)) {
                this.materialTypes.push(row.type)
              }


              if (!this.steelMaterials.includes(row.subtype) && !this.otherMetals.includes(row.subtype) && !this.plastics.includes(row.subtype) && !this.otherMaterials.includes(row.subtype)) {
                this.steelMaterials.push(row.subtype)
                this.otherMetals.push(row.subtype)
                this.plastics.push(row.subtype)
                this.otherMaterials.push(row.subtype)
              }

              // Remove any undefined vals
              this.steelMaterials = this.steelMaterials.filter(item => item !== undefined)
              this.otherMaterials = this.otherMaterials.filter(item => item !== undefined)
              this.otherMetals = this.otherMetals.filter(item => item !== undefined)
              this.plastics = this.plastics.filter(item => item !== undefined)

            })
          })


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
      return classArray
    } else {
      let newClass = new classToUse()
      if (rowTitle === 'Cost of Raw Materials') newClass.parent.addRows = false

      this.generateRows(newClass, rowTitle, true)
      return newClass
    }
  }

  generateRows = (array: string[] | any, parentName: string, isClass?: boolean) => {
    if (isClass) {
      if (parentName === 'Staff Commute') {
        array.parent.name = 'Company Travel'
      } else {
        array.parent.name = parentName
        this.data.push(array)
      }
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

    // This will be the 'Company Travel' case
    if (group.parent.name === 'Company Travel') {
      const findLastCompanyTravel = this.data.find((item: any) => item.buttonName === 'Company Travel')
      if (findLastCompanyTravel === -1) return;
      let copy = {...findLastCompanyTravel, cost: 0, mileage: 0}

      let findObject = this.data.findLastIndex((item: any) => item.parent.name === 'Company Travel');

      if (findObject === -1) return;
      this.data.splice(findObject + 1, 0, copy)

      return;
    }

    // If not company travel
    let copy = {...group, name: `${group.parent.name} description`}
    let findObject = this.data.findLastIndex((item: any) => item.parent.name === group.parent.name)
    if (findObject === -1) return;
    this.data.splice(findObject + 1, 0, copy)
  }

  addNewStaffCommuteRow = (group: any) => {
    const staffCommute = this.generateClasses('Staff Commute', StaffCommute)
    let copy = {...staffCommute}
    let findObject = this.data.findLastIndex((item: any) => item.parent.name === 'Company Travel');

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
    const totalExternalCost: number = this.externalCost as number
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
        this.initChartGauge(10)
        break;
      case 1 :
        this.markStart = 0
        this.markEnd = 2
        this.productivityPercentile = '25th Percentile'
        this.initChartGauge(25)
        break;
      case 2:
        this.markStart = 0
        this.markEnd = 3
        this.productivityPercentile = '50th Percentile'
        this.initChartGauge(50)
        break;
      case 3:
        this.markStart = 0
        this.markEnd = 4
        this.productivityPercentile = '75th Percentile'
        this.initChartGauge(75)
        break;
      case 4:
        this.markStart = 0
        this.markEnd = 5
        this.productivityPercentile = '90th Percentile'
        this.initChartGauge(90)
        break;
      default:
        this.markStart = 0
        this.markEnd = 0
        this.productivityPercentile = ''
        this.initChartGauge(0)
        break;
    }

    this.initChart()
  }

  sumValues = (obj: any): number => <number>Object.values(obj).reduce((a: any, b: any) => a + b, 0);


  calculateGroupTotalCost = (group: any) => {
    // if (group.parent.name === 'Cost of Raw Materials') {
    //   return this.calculateRawMaterials('Cost of Raw Materials')
    // }

    if (!group?.parent) return 0;

    if (group.parent.name === 'Cost of Raw Materials') {
      return this.calculateRawMaterials('Cost of Raw Materials')
    }

    const parentName = group?.parent.name

    const total = this.data.filter((item: any) => item.parent.name === parentName).reduce((acc: number, curr: any) => {
      if (curr.cost === 'NA') return acc;
      if (curr.cost !== undefined && curr.cost !== null) {
        return acc + parseFloat(curr.cost)
      } else {
        return acc;
      }
    }, 0)


    this.data = this.data.map((item: any) => {
      if (item.parent.name === parentName) {

        item.parent.subtotal = total;

        if (item.parent.totalCost < total) {
          item.parent.totalCost = total;
        }

        if (this.employees > 0) {
          item.parent.secondColumn = (total / this.employees).toFixed(2)
        }
      }

      return item
    })

    if (group.parent.name === 'Cost of Energy') {
      this.calculateCo2e(group)
      this.calculateEnergyCostPerUnit(group)
    }


    this.calculateTotalExternalCost()
    return total !== undefined ? total : 0
  }

  calculateEnergyCostPerUnit = (group: any) => {
    // if (group.cost === 0) return;

    if (group.parent.name !== 'Cost of Energy') return;

    const total = this.data
      .filter((item: any) => item.parent.name === 'Cost of Energy')
      .reduce((acc: number, curr: any) => {

        if (curr.cost !== undefined && curr.cost !== null && curr.totalUnits !== undefined && curr.totalUnits !== undefined && curr.unitOfCost === 'Cost/unit') {
          return acc + (parseFloat(curr.cost) * parseFloat(curr.totalUnits))
        } else if (curr.cost !== undefined && curr.cost !== null && curr.totalUnits !== undefined && curr.totalUnits !== undefined) {
          return acc + parseFloat(curr.cost)
        } else {
          return acc;
        }

      }, 0)


    this.data = this.data.map((item: any) => {
      if (item.parent.name === 'Cost of Energy') {

        item.parent.subtotal = total;

        if (item.parent.totalCost < total) {
          item.parent.totalCost = total;
        }

        if (this.employees > 0) {
          item.parent.secondColumn = (total / this.employees).toFixed(2)
        }
      }
      return item
    })

    return this.data;
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
        complete: () => {
          this.assignFuelDataToCorrectCost()
        }
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
      if (extracted.type.includes('Burning oil')) extracted.type = "Kerosene"
      if (extracted.type.includes('Propane')) extracted.type = "LPG"


      let foundType = this.data.findIndex((tableRow: any) => tableRow.name === extracted.type)


      if (foundType === -1) return;


      this.data[foundType].totalUnits = extracted.totalValue
      this.data[foundType].cost = extracted.totalCost
      this.data[foundType].unitsUom = extracted.unit ? extracted.unit : 'kWh'
    })
    this.calculatePieCharts(extractedData)
  }


  calculatePieCharts = (extractedData: any) => {
    const conversionFactors: { [key: string]: number } = {
      'Electricity': 0.22499,
      'Natural Gas (Grid)': 0.18293,
      'Kerosene': 0.24677,
      'Diesel (avg biofuel blend)': 0.23908,
      'Petrol (avg biofuel blend)': 0.22166,
      "Gas oil (Red diesel)": 0.25650,
      'LPG': 0.21449,
      'Propane': 0.21410,
      'Butane': 0.22241,
      'Biogas': 0.00022,
      'Biomethane (compressed)': 0.00038,
      'Wood Chips': 0.01074,
      'Natural Gas off Grid': 0.03021,
      'Bio Gas Off Grid': 0.00020,
      'Oil': 0.24557, //burning oil
      'Bio fuels': 0.03558,//bio diesel
      'Bio Mass': 0.01074,
      'Coal for Industrial use': 0.05629,
    }

    this.breakDownChartData = extractedData.map((fuelType: any) => {
      const selectedConversionFactor = conversionFactors[fuelType.type] ? conversionFactors[fuelType.type] : 0
      const calculatedCO2e = (fuelType.totalValue * selectedConversionFactor) / 1000
      return {
        name: fuelType.type,
        value: calculatedCO2e

      }
    })

  }


  getData = (id: number) => {
    if (!id) {
      return
    }

    this.track.getData(id).subscribe({
        next: (res) => {
          if (res) {

            if (!res.length) return;

            let aggregatedHHData: any = {
              'Gas': 0,
              'Electricity': 0
            }


            res.forEach((row: any) => {
              row.hhd = JSON.parse(row.hhd.replaceAll('"', '').replaceAll("'", '')).map((x: number) => x ? x : 0)
              // Sort the envirotrack data
              const rowTotal = row.hhd.reduce((acc: any, curr: any) => acc + curr, 0);

              // If gas is in the name use that, otherwise count it as electricity for HH formats
              const category = row.mpan.toLowerCase().includes('gas') ? 'Natural Gas (Grid)' : 'Electricity';

              aggregatedHHData[category] += rowTotal;
            })

            this.breakDownChartData = Object.entries(aggregatedHHData).map(([name, total]: any) =>
              ({
                name,
                value: Number((total).toFixed(2))
              })
            );

            console.log(aggregatedHHData)
          }



          this.breakDownChartData.forEach((extracted: any) => {

            let foundType = this.data.findIndex((tableRow: any) => tableRow.name === extracted.name)

            if (foundType === -1) return;

            this.data[foundType].totalUnits += extracted.value
            this.data[foundType].cost = 0
            this.data[foundType].unitsUom = 'kWh'
          })
        },
        complete: () => {
          this.initCo2eScope()
          this.initCo2eBreakdown()
        }
      }
    )
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

  initChartGauge = (gaugeNum: number) => {
    this.gaugeChartOptions = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      title: {
        text: `Percentiles for Sector ${this.sicCodeLetter}`,
        left: 'center',

      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            width: 18
          },
          axisLine: {
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 20
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
          },
          data: [
            {
              value: gaugeNum,
              name: 'Chart'
            }
          ]
        }
      ]
    };
  }


  initCo2eBreakdown = () => {

    this.co2eBreakdown = {
      title: {
        text: 'Breakdown of CO2e',
        left: 'center',
        top: 30,
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: '{a} <br />{b}: {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            name: 'Breakdown of CO2e',
            type: 'png'
          }
        }
      },
      series: [
        {
          name: 'CO2e Data',
          type: 'pie',
          radius: [20, 180],
          itemStyle: {
            borderRadius: 5
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: this.breakDownChartData
        },
      ],
      color: [
        '#72ac3f',
        '#3fa8ac',
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666',
        '#bed8a5',
        '#73c0de',
        '#3ba272',
        '#fc8452',
        '#9a60b4',
        '#ea7ccc',
        '#753d3d',
        '#922e9b',
        '#9f7c3b',
        '#29724d',
        '#68e5d3',
        '#ff6c00',
        '#00f196',
        '#3627fa',
        '#ffb683',
        '#9a017d',
        '#3592c5',
        '#c45a5a',
        '#8aa1e8',
        '#accc9d',
        '#efd59e',
        '#fdbaba',
        '#b5e4fa',
        '#a6f6d0',
        '#faba9f',
        '#e6bafc',
      ]
    };
  }

  initCo2eScope = () => {
    // Reduce to different scopes
    // If Electricity -> Scope 2
    // All others => scope 1
    const getElectricity = this.breakDownChartData.filter((fuelType: any) => fuelType.name.toLowerCase().includes('electricity'))
    const mappedScope2 = getElectricity.map((elec: any) => ({
        name: 'Scope 2',
        value: elec.value
      })
    )

    const allOtherFuelTypes = this.breakDownChartData.filter((fuelType: any) => !fuelType.name.toLowerCase().includes('electricity'))

    let mappedScope1 = []
    if (allOtherFuelTypes.length) {
      mappedScope1 = allOtherFuelTypes.reduce((acc: any, fuelType: any) => {
        return {
          name: 'Scope 1',
          value: acc.value + (fuelType.value || 0)
        }
      }, {value: 0})
    }


    let finalData = []
    if (allOtherFuelTypes.length) {
      finalData = [...mappedScope2, mappedScope1]
    } else {
      finalData = [...mappedScope2]
    }

    this.co2eScope = {
      title: {
        text: 'CO2e by Scope',
        left: 'center',
        top: 30,
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: '{a} <br />{b}: {c} ({d}%)'
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            name: 'CO2e-by-Scope-Chart',
            type: 'png'
          }
        }
      },
      series: [
        {
          name: 'Co2e Data By Scope',
          type: 'pie',
          radius: [20, 180],
          itemStyle: {
            borderRadius: 5
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: finalData
        },
      ],
      color: [
        '#50a3ba',
        '#bed8a5',
        '#dbeef2',
        '#2e5c70',
      ]
    };
  }

  savePETdata = () => {
    const objectToSave: PetToolData = {
      year: this.selectedYear,
      company_id: this.selectedCompany,
      sic_code: this.sicCode,
      sic_letter: this.sicCodeLetter,
      turnover: this.turnover,
      output_unit: this.outputUnit,
      annual_output: this.output,
      number_of_employees: this.employees,
      productivity_score: this.productivityScore,
      innovation_percent: this.innovationPercent,
      training_percent: this.staffTrainingPercent,
      export_percent: this.exportPercent,
      productivity_comparison: this.productivityPercentile,
      mark_start: this.markStart,
      mark_end: this.markEnd,
      total_external_costs: this.externalCost,
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


    if (!this.selectedCompany) return;

    const token = this.storage.get('access_token');
    if (!token) return;


    // Check if already saved - if not post a new row to pet_data
    if (this.selectedPetId) {
      // console.log('PATCHING')
      this.db.patchPetData(this.selectedPetId, objectToSave).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Data saved'
          })

          // // Replace data in petDataArray with res
          const getIdFromPetData = this.allPetData.findIndex((petRow: PetToolData) => petRow.id === this.selectedPetId)
          this.allPetData.splice(getIdFromPetData, 1, res.data)
        }
      })
    } else {
      // console.log('POSTING')
      this.db.savePetData(objectToSave).subscribe({
        next: (res: any) => {
          this.msg.add({
            severity: 'success',
            detail: 'Data saved'
          })

          this.allPetData.push(res.data)
          this.selectedPetId = res.data.id
        },
        error: (error) => console.log(error)
      })
    }

  }

  calculateRawMaterials(parentName: string) {

    const total = this.data.filter((item: any) => item.parent.name === parentName).reduce((acc: number, curr: any) => {
      if (curr.cost !== undefined && curr.cost !== null && curr.totalUnits !== undefined && curr.totalUnits !== undefined) {
        return acc + (parseFloat(curr.cost) * parseFloat(curr.totalUnits))
      } else {
        return acc;
      }
    }, 0)


    this.data = this.data.map((item: any) => {
      if (item.parent.name === parentName) {

        item.parent.subtotal = total;

        if (item.parent.totalCost < total) {
          item.parent.totalCost = total;
        }

        if (this.employees > 0) {
          item.parent.secondColumn = (total / this.employees).toFixed(2)
        }
      }
      return item
    })
    return this.data;
  }


  handleEnergyOrRawMaterials = (groups: any) => {
    if (groups.parent.name === 'Cost of Energy') {
      this.calculateCo2e(groups)
      this.calculateEnergyCostPerUnit(groups)
      return;
    }

    if (groups.parent.name === 'Cost of Raw Materials') {
      return this.calculateRawMaterials('Cost of Raw Materials')
    }
  }

  calculateCo2e = (group: any) => {
    if (group.parent.name !== 'Cost of Energy') return;
    if (group.unitsUom !== 'kWh') return;

    // Find Fuel Type in object
    const conversionFactors: { [key: string]: number } = {
      'Electricity': 0.22499,
      'Natural Gas (Grid)': 0.18293,
      'Kerosene': 0.24677,
      'Diesel (avg biofuel blend)': 0.23908,
      'Petrol (avg biofuel blend)': 0.22166,
      "Gas oil (Red diesel)": 0.25650,
      'LPG': 0.21449,
      'Propane': 0.21410,
      'Butane': 0.22241,
      'Biogas': 0.00022,
      'Biomethane (compressed)': 0.00038,
      'Wood Chips': 0.01074,
      'Natural Gas off Grid': 0.03021,
      'Bio Gas Off Grid': 0.00020,
      'Oil': 0.24557, // burning oil
      'Bio fuels': 0.03558, // biodiesel
      'Bio Mass': 0.01074,
      'Coal for Industrial use': 0.05629,
    }


    const selectedConversionFactor = conversionFactors[group.name] ? conversionFactors[group.name] : 0
    const calculatedCO2e = (group.totalUnits * selectedConversionFactor) / 1000
    group.co2e = calculatedCO2e
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

