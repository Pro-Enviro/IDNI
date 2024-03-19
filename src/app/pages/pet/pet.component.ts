import {Component, OnInit} from '@angular/core';
// import {AdminService} from "../../../_services/admin.service";
// import {GlobalService} from "../../../_services/global.service";
import {FormsModule} from "@angular/forms";
// import {MessageService} from "primeng/api";
import {PanelModule} from 'primeng/panel';
import {SelectButtonModule} from "primeng/selectbutton";
import {TableModule} from "primeng/table";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";

const rowNames: string[] = ['Cost of Energy', 'Transportation Costs', 'Cost of Water', 'Cost of Waste', 'Cost of Raw Materials', 'Cost of Bought in Goods - Consumables and bought in parts', 'Consultancy Cost', 'Sub Contracting Cost', 'Other External Costs (Legal, rental, accounting etc)']
const energyNames: string[] = ['Oil', 'Gas', 'LPG', 'Electricity', 'Diesel', 'Kerosene', 'Other']
const gridAllocationNames: string[] = ['kVa Availability', 'Recorded Winter Max Demand kVa']
const onSiteNames: string[] = ['PV', 'Wind', 'Solar Thermal', 'CHP', 'Biomass', 'Hydro', 'AD', 'Other']


class TableRow {
  name: string = ''
  value: number = 0
  secondColumn = 0
}

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule],
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
  trainingPercent: number =0
  exportPercent: number =0
  // TableRows
  rows: TableRow[] = []
  energyRows: TableRow[] = []
  gridAllocationRows: TableRow[] = []
  onSiteRows: TableRow[] = []


  constructor(
    // private admin: AdminService,
    // private global: GlobalService,
    // private msg: MessageService
  ) {
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
    // this.getPETReport(this.selectedCompany)
  }

  getCompanies = () => {
    // this.admin.fnGet(`items/organisation/${this.global.cmp}?fields=companies.companies_id.name,companies.companies_id.id`).subscribe({
    //   next: (res: any) => {
    //     this.companies = res.data.companies.map((x: any) => x.companies_id);
    //     this.selectedCompany = this.companies[0].id;
    // this.getPETReport(this.selectedCompany)
    //   }
    // })
  }

  getPETReport = () => {
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

    this.generateRows(rowNames, this.rows)
    this.generateRows(energyNames, this.energyRows)
    this.generateRows(gridAllocationNames, this.gridAllocationRows)
    this.generateRows(onSiteNames, this.onSiteRows)
  }

  generateRows = (array: string[], newArray: TableRow[]) => {
    array.forEach((name: string) => {
      let newRow = new TableRow();
      newRow.name = name
      newArray.push(newRow)
    })
  }

  calculatePerEmployeeCost = () => {
    let subTotal = 0;
    this.rows = this.rows.map((row: TableRow) => {
      // Calculate per employee
      if (!this.employees) return row;
      row.secondColumn = row.value / this.employees;
      // Calculate New total
      subTotal += row.value;
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
    // this.getCompanies()
    this.getPETReport()
  }

}
