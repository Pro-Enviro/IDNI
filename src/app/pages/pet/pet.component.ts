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

const rowNames: string[] = ['Cost of Energy', 'Transportation Costs', 'Cost of Water', 'Cost of Waste', 'Cost of Raw Materials', 'Cost of Bought in Goods - Consumables and bought in parts', 'Consultancy Cost', 'Sub Contracting Cost', 'Other External Costs (Legal, rental, accounting etc)']

const energyNames: string[] = ['Electricity','Natural Gas (Grid)', 'Natural Gas off Grid', 'Bio Gas Off Grid', 'LPG','Oil','Kerosene','Bio Fuels','Bio Mass','Coal for Industrial use','Other']
const materialNames: string[] = ['Steel','Stainless Steel','Aluminium','Copper','Bronze','Titanium','Polymers','Elastomers','Textiles','Composites','Aggregates','Cement','Glass','Wood','Chemicals','Lithium','Magnesium','Other']

// const gridAllocationNames: string[] = ['kVa Availability', 'Recorded Winter Max Demand kVa']
// const onSiteNames: string[] = ['PV', 'Wind', 'Solar Thermal', 'CHP', 'Biomass', 'Hydro', 'AD', 'Other']

type UnitsUom = 'Select' | 'litres' | 'kg' |'kWh' | 'tonnes' | 'cubic metres' | 'km' | 'miles'
type RegionsOfOrigin = 'UK' | 'EU' | 'US' | 'Asia'



class BoughtInParts {
  name: string = 'Description of Part'
  secondColumn?:number = 0
  NoOfParts: number = 0
  cost: number = 0
  unitOfCost: 'Cost/unit' | 'Total Cost' | 'Select' = 'Select'
  regionOfOrigin: RegionsOfOrigin  = 'UK'
  parent = {
    name: '',
    addRows: true
  }
}
class TableRow {
  name: string = ''
  secondColumn: number = 0 ;
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  cost: number = 0
  unitOfCost?: 'Select' | 'Total Cost' | 'Cost/unit' = 'Select'
  regionOfOrigin?: RegionsOfOrigin = 'UK'
  parent?: {name: string} = {
    name: ''
  }
}

class MaterialRow {
  name: string = ''
  secondColumn: number = 0 ;
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  cost: number = 0
  regionOfOrigin?: RegionsOfOrigin = 'UK'
  scrappageAndWaste?: number = 0
  parent?: {name: string} = {
    name: ''
  }
}

class GroupItem {
  name: string = ''
  value: number = 0;
  secondColumn = 0
  parent: {name: string} = {
    name: ''
  }
}

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, CarouselTplComponent, FooterComponent, RippleModule, JsonPipe, DropdownModule],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.scss'
})

export class PetComponent implements OnInit {
  // Admin
  selectedCompany!: number;
  companies: any;
  // Table Constants
  turnover: number = 0;
  employees: number = 0;
  totalOfRows: number = 0;
  productivityScore: number = 0;
  innovationPercent: number = 0;
  // TableRows
  rows: TableRow[] = []
  energyRows: TableRow[] = []
  gridAllocationRows: TableRow[] = []
  onSiteRows: TableRow[] = []
  unitsUom: UnitsUom[] = ['Select' , 'litres' , 'kg' ,'kWh' , 'tonnes' , 'cubic metres' , 'km' , 'miles']
  regionOfOrigin: RegionsOfOrigin[] = ['UK' , 'EU' , 'US' , 'Asia']

  data: any = []
  initialParts = new BoughtInParts()

  constructor() {
  }

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
    // this.admin.fnGet(`items/organisation/${this.global.cmp}?fields=companies.companies_id.name,companies.companies_id.id`).subscribe({
    //   next: (res: any) => {
    //     this.companies = res.data.companies.map((x: any) => x.companies_id);
    //     this.selectedCompany = this.companies[0].id;
    this.getPETReport(this.selectedCompany)
    //   }
    // })
  }

  getPETReport = (id: number) => {
    // this.admin.fnGetCompanyDetails(id, ['pet_tool']).subscribe({
    //   next: (res: any) => {
    //     if (res?.pet_tool) {
    //       const combinedRows = JSON.parse(res.pet_tool);
    //       this.turnover = combinedRows.turnover
    //       this.employees = combinedRows.employees
    //       this.totalOfRows = combinedRows.totalOfRows
    //       this.productivityScore = combinedRows.productivityScore
    //       this.innovationPercent = combinedRows.innovationPercent
    //       this.rows = combinedRows.rows
    //       this.energyRows = combinedRows.energyRows
    //       this.gridAllocationRows = combinedRows.gridAllocationRows
    //       this.onSiteRows = combinedRows.onSiteRows
    //     } else {
    //       this.generateRows(rowNames, this.rows)
    //       this.generateRows(energyNames, this.energyRows)
    //       this.generateRows(gridAllocationNames, this.gridAllocationRows)
    //       this.generateRows(onSiteNames, this.onSiteRows)
    //     }
    //   }})


    this.generateClasses('Cost of Energy', TableRow, energyNames)
    this.generateClasses('Cost of Raw Materials ', MaterialRow, materialNames)
    this.generateClasses('Cost of Bought in Goods - Consumables and bought in parts', BoughtInParts)
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
      console.log(this.data)
    } else {
      console.log('No names to use')
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



  calculatePerEmployeeCost = () => {
    let subTotal = 0;
    this.rows = this.rows.map((row: TableRow) => {
      // Calculate per employee
      if (!this.employees) return row;
      row.secondColumn = row.cost / this.employees;
      // Calculate New total
      subTotal += row.cost;
      this.totalOfRows = subTotal;
      // Recalculate Productivity Score
      this.productivityScore = (this.turnover - this.totalOfRows) / this.employees
      return row;
    })
  }

  createReportObject = () => {
    const reportValues = {
      turnover: this.turnover,
      employees: this.employees,
      totalOfRows: this.totalOfRows,
      productivityScore: this.productivityScore,
      innovationPercent: this.innovationPercent,
      rows: this.rows,
      energyRows: this.energyRows,
      gridAllocationRows: this.gridAllocationRows,
      onSiteRows: this.onSiteRows
    }

    console.log(reportValues)
    return reportValues;
  }

  saveReport = () => {
    const report = this.createReportObject()

    // this.admin.updateCompany(this.selectedCompany, {
    //   "pet_tool": JSON.stringify(report)
    // }, ['pet_tool']).subscribe({
    //   next: (res: any) => {
    //     return this.msg.add({
    //       severity: 'success',
    //       detail: 'Saved'
    //     })
    //   },
    //   error: (err: any) => console.log(err)
    // })
  }

  ngOnInit() {
    this.getCompanies()
  }

}
