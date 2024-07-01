import {Component, OnChanges, OnInit} from '@angular/core';
import {EChartsOption} from "echarts";
import {EnvirotrackService} from "../../../envirotrack.service";
import moment from "moment/moment";
import {PanelModule} from "primeng/panel";
import {SelectButtonModule} from "primeng/selectbutton";
import {CalendarModule} from "primeng/calendar";
import {NgxEchartsDirective} from "ngx-echarts";

import {DropdownModule} from "primeng/dropdown";
import {NgIf} from "@angular/common";
import {SharedModules} from "../../../../../shared-module";
import {CardModule} from "primeng/card";
import {GlobalService} from "../../../../../_services/global.service";
import {StorageService} from "../../../../../_services/storage.service";

@Component({
  selector: 'app-envirotrack-small-pie-chart',
  standalone: true,
  imports: [
    PanelModule,
    SelectButtonModule,
    CalendarModule,
    NgxEchartsDirective,
    DropdownModule,
    NgIf,
    SharedModules,
    CardModule
  ],
  templateUrl: './envirotrack-small-pie-chart.component.html',
  styleUrl: './envirotrack-small-pie-chart.component.scss'
})
export class EnvirotrackSmallPieChartComponent implements OnInit {
  data: any;
  months: string[] = [];
  filteredData: any;
  companies: any;
  selectedCompany!: number | null;
  chartData: any = [];
  chartX: string[] = [];
  chartY: string[] = [];
  chartOptions!: EChartsOption;
  max: number = 0;
  dateFilter: number = 12;
  defaultFilters: object[] = [{
    name: 'All Data',
    value: 0
  }, {
    name: 'Past 12 months',
    value: 12
  }, {
    name: 'Past 6 months',
    value: 6
  }, {
    name: 'Past 3 months',
    value: 3
  }, {
    name: 'Past 1 months',
    value: 1
  }];
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  mpan: string[] = [];
  selectedMpan!: string;
  screenWidth: any;
  isConsultant = false
  selectedName: string = ''

  constructor(
    private track: EnvirotrackService,
    private global: GlobalService,
    private storage: StorageService
  ) {
    this.selectedName = this.global?.companyName?.value || ''
  }


  initChart = () => {
    this.chartOptions = {
      legend: {
        show: true,
        top: 50,
        left: 'center'
      },
      grid: {
        bottom: '100'
      },
      title: {
        text: 'Electricity Consumption, kWh',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: this.screenWidth >= 1441 ? 16 : 12,
        }
      },
      graphic: {
        type: 'image',
        left: 10,
        top: 0,
        z: 100,
        style: {
          image: '/assets/img/pro-enviro-logo-email.png',
          x: 0,
          y: 0,
          width: this.screenWidth >= 1441 ? 200 : 120,
          height: this.screenWidth >= 1441 ? 50 : 30
        }
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: '{b} ({d}%)',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      toolbox: {
        show: true,
        left: '0',
        top: '20',
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      series: [{
        top: 100,
        type: 'pie',
        data: this.chartData,
        radius: this.screenWidth >= 1441 ? [50, 200] : [30, 100],
        label: {
          formatter: '{b}  {per|{d}%}',
          fontSize: 14,
          rich: {
            per: {
              fontWeight: "bold",
              fontSize: 18
            }
          }
        },
        itemStyle: {
          borderRadius: 5
        },
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }]
    }
  }

  getCompanies = () => {

    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = this.companies[0].id
                this.onSelectCompany()
              }
            }
          })

        } else if (res.role.name === 'consultant'){

          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = this.companies[0].id
                this.isConsultant = true
                this.onSelectCompany()
              }
            }
          })
        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.isConsultant = true
            }
          })
        }
      }
    })

    //
    // this.track.getCompanies().subscribe({
    //   next: (res: any)=>{
    //     if (res.data) {
    //       this.companies = res.data
    //     }
    //   }
    // })


  }

  onSelectCompany = () => {
    //this.global.updateSelectedMpan(this.selectedMpan)
    //this.selectedCompany ? this.track.updateSelectedCompany(this.selectedCompany) : null;

    this.chartOptions = {}
    this.chartData = []


    this.selectedCompany ? this.getData(this.selectedCompany) : null

  }

  getTimes = () => {
    for (let i = 0; i < 48; i++) {
      this.chartY.push(moment('00:00', 'HH:mm').add(i * 30, 'minutes').format('HH:mm'))
    }
  }

  getData = (id: number) => {
    this.mpan = [];
    this.months = [];
    this.chartData = [];
    this.chartX = [];
    this.chartY = [];
    this.track.getData(id).subscribe({
        next: (res) => {
          ;
          res.forEach((row: any) => {
            row.hhd = JSON.parse(row.hhd.replaceAll('"', '').replaceAll("'", '')).map((x: number) => x ? x : 0)
            this.months.push(row.date)
            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan) : null;
          })

          // if (this.global.selectedMpan?.value) {
          //   this.selectedMpan = this.global.selectedMpan.value
          // } else {
          this.selectedMpan === undefined ? this.selectedMpan = this.mpan[0] : null
          console.log(this.selectedMpan)
          // }

          this.data = res
          this.getTimes()
          this.months.sort();
          this.months.sort((a: string, b: string) => (a.split('/')[1] > b.split('/')[1]) ? 1 : ((b.split('/')[1] > a.split('/')[1]) ? -1 : 0))
          this.months.sort((a: string, b: string) => (a.split('/')[2] > b.split('/')[2]) ? 1 : ((b.split('/')[2] > a.split('/')[2]) ? -1 : 0))
          this.minDate = new Date(this.months[0])
          this.maxDate = new Date(this.months[this.months.length - 1])
          this.filterData()
        }
      }
    )
  }


  filterData = () => {



    if (this.dateRange != undefined && this.dateRange[1]) {
      this.filteredData = this.data.filter((x: any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
      this.chartX = this.months.filter((x: any) => moment(x).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    } else {
      if (this.dateFilter) {
        this.filteredData = this.data.filter((x: any) => moment(x.date).isBetween(moment(this.months[this.months.length - 1]).subtract(this.dateFilter, 'months'), moment(this.months[this.months.length + 1])))
        this.chartX = this.months.filter((x: any) => moment(x).isBetween(moment(this.months[this.months.length - 1]).subtract(this.dateFilter, 'months'), moment(this.months[this.months.length + 1])))
      } else {
        this.chartX = this.months
        this.filteredData = this.data
      }
    }



    let monday: any[] = [];
    let tuesday: any[] = [];
    let wednesday: any[] = [];
    let thursday: any[] = [];
    let friday: any[] = [];
    let saturday: any[] = [];
    let sunday: any[] = [];
    this.filteredData = this.filteredData.filter((x: any) => x.mpan === this.selectedMpan)


    if (!this.filteredData.length) return


    this.filteredData.forEach((row: any) => {
      row.hhd.forEach((hh: any, i: number) => {
        hh = hh ? hh : 0;
        row.hhd[i] = !isNaN(parseInt(hh.toString())) ? hh : 0
      })
      if (row.hhd.length) {
        switch (moment(row.date).format('dddd')) {
          case 'Monday':
            monday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Tuesday':
            tuesday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Wednesday':
            wednesday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Thursday':
            thursday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Friday':
            friday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Saturday':
            saturday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          case 'Sunday':
            sunday.push(row.hhd.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0)))
            break;
          default:
            break;
        }
      }
    })
    this.chartData = [
      {name: 'Sunday', value: sunday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Monday', value: monday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Tuesday', value: tuesday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Wednesday', value: wednesday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Thursday', value: thursday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Friday', value: friday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))},
      {name: 'Saturday', value: saturday.reduce((x: number, y: number) => (x ? x : 0) + (y ? y : 0))}
    ]


    let arr: number[] = this.chartData.map((x: any) => x[2])
    this.max = Math.max(...arr)
    this.initChart()
  }


  fetchDataByRole = () => {
    if (this.global.companyAssignedId.value) {
      this.selectedCompany = this?.global?.companyAssignedId?.value || null;
      this.getData(this?.global?.companyAssignedId?.value)
      this.onSelectCompany()
    }
  }


  ngOnInit() {
    this.isConsultant = false
    this.selectedCompany = null;
    this.getCompanies();
    this.fetchDataByRole()

    this.screenWidth = window.innerWidth;
  }
}










