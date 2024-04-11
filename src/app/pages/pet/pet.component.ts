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
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {read, utils} from "xlsx";
import {HttpClient} from "@angular/common/http";
import {StorageService} from "../../_services/storage.service";
import {NgxEchartsDirective} from "ngx-echarts";
import {EChartsOption} from "echarts";
import {MessageService} from "primeng/api";

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
  imports: [FormsModule, PanelModule, SelectButtonModule, TableModule, InputNumberModule, ButtonModule, CardModule, DropdownModule, InputTextModule, NgIf, NgxEchartsDirective],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.scss'
})

export class PetComponent implements OnInit {
  url:string = 'https://app.idni.eco'
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
  productivityData!: any // Excel spreadsheet
  sicCodeData!: any // Excel Spreadsheet
  sicCode: string = ''
  sicCodeLetter: string = ''
  template?:any;
  chartOptions!: EChartsOption | null;
  chartData: any = [];
  markStart: any
  markEnd:any
  productivityPercentile: string =''

  constructor(
    // private admin: AdminService,
    // private global: GlobalService,
    // private msg: MessageService
    private http: HttpClient,
    private storage: StorageService,
    private msg: MessageService
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
      this.calculateProductivityComparison()
      return row;
    })
  }

  sicCodeToLetter = () => {
    if (this.sicCode.length < 5) {
      this.sicCodeLetter = ''
      return;
    }
    // Select correct SIC code letter

    const foundRow = this.sicCodeData.find((row: any) => row.sector === this.sicCode)
    if (foundRow) this.sicCodeLetter = foundRow.sic_number

    else this.sicCodeLetter = ''
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


  // getTemplate = () => {
  //   // Change content id to match correct selected template
  //   let id = 20;
  //   let sicCodeId = 21
  //
  //   // TODO: Protect backend links with .env?
  //   this.http.get(`https://ecp.proenviro.co.uk/items/content/${id}`).subscribe({
  //     next: (res: any) => {
  //       this.template = `https://ecp.proenviro.co.uk/assets/${res.data.file}?token=${this.storage.get('access_token')}`
  //
  //       this.http.get(this.template, {
  //         responseType: 'arraybuffer'
  //       }).subscribe({
  //         next: (buffer: ArrayBuffer) => {
  //           const workbook = read(buffer);
  //           const sheets = workbook.SheetNames
  //           const worksheet = workbook.Sheets[workbook.SheetNames[3]];
  //           const raw_data = utils.sheet_to_json(worksheet, {header: 1});
  //           this.productivityData = raw_data
  //         }
  //       })
  //     }
  //   })
  //
  //
  //   this.http.get(`https://ecp.proenviro.co.uk/items/content/${sicCodeId}`).subscribe({
  //     next: (res: any) => {
  //       this.template = `https://ecp.proenviro.co.uk/assets/${res.data.file}?token=${this.storage.get('access_token')}`
  //
  //       this.http.get(this.template, {
  //         responseType: 'arraybuffer'
  //       }).subscribe({
  //         next: (buffer: ArrayBuffer) => {
  //           const workbook = read(buffer);
  //           const sheets = workbook.SheetNames
  //           const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //           const raw_data = utils.sheet_to_json(worksheet, {header: 1});
  //           this.sicCodeData = raw_data
  //         }
  //       })
  //     }
  //   })


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
        severity:'info',
        detail: 'There is no available data for the provided details.'
      })
    }

    const counts = [p10, p25, p50, p75, p90]

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
      // ['100', null]
      ['100', p90*1.5]
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


  getProductivityData = () => {
    this.http.get(`${this.url}/items/sic_codes`).subscribe({
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

  ngOnInit() {
    // this.getCompanies()
    this.getPETReport()
    // this.getTemplate()
    this.getProductivityData()

  }

}
