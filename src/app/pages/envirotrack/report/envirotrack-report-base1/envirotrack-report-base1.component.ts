import { Component } from '@angular/core';
import moment from "moment";
import {EnvirotrackService} from "../../envirotrack.service";
import {EChartsOption} from "echarts";
import {MessageService} from "primeng/api";
import * as echarts from "echarts";
import {SharedModules} from "../../../../shared-module";
import {SelectButtonModule} from "primeng/selectbutton";
import {SharedComponents} from "../../shared-components";

@Component({
  selector: 'app-envirotrack-report-base1',
  standalone: true,
  imports: [SharedModules, SharedComponents],
  templateUrl: './envirotrack-report-base1.component.html',
  styleUrls: ['./envirotrack-report-base1.component.scss']
})

export class EnvirotrackReportBase1Component {
  data: any;
  months: string[] = [];
  filteredData: any;
  companies: any;
  selectedCompany!: number;
  chartData: any = [];
  chartX: string[] = [];
  chartY: string[] = [];
  chartOptions!: EChartsOption;
  max: number = 0;
  dateFilter!: number;
  defaultFilters: object[] = [];
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  firstYear!: number;
  lastYear!: number;
  mpan: string[] = [];
  selectedMpan!: string;
  screenWidth: any;

  constructor(
    private track: EnvirotrackService,
    private msg: MessageService,
  ) {}

  initChart = () => {
    this.chartOptions = {
      legend: {
        show: true,
        top: 35,
      },
      title: {
        text: 'Christmas Day vs lowest day of the year consumption',
        left: 'center',
        top: 8,
        textStyle: {
          fontSize: this.screenWidth >= 1441 ? 16 : 12
        }
      },
      grid: {
        left: '140'
      },
      graphic: {
        type: 'image',
        left: 10,
        top: 5,
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
      xAxis: {
        type: "category",
        data: this.chartX,
        name: 'TIME',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
      },
      yAxis: {
        type: 'value',
        name: 'kWh',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      series: this.chartData
    }
  }

  // saveChartAsBase64 = () => {
  //   if (!this.chartOptions) return;
  //
  //   // Create temporary chart that uses echarts.instanceOf
  //   const div = document.createElement('div')
  //   div.style.width = '1200px'
  //   div.style.height = '1200px'
  //
  //   const temporaryChart = echarts.init(div)
  //
  //   temporaryChart.setOption({...this.chartOptions, animation: false})
  //
  //   const data = temporaryChart.getDataURL({
  //     backgroundColor: '#fff',
  //     pixelRatio: 4
  //   })
  //   return data;
  // }

  getCompanies = () =>{
    this.track.getCompanies().subscribe({
      next: (res: any)=>{
        this.companies = res.data;
      }
    })
  }

  onSelectCompany = () => {
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.getData(this.selectedCompany)
  }

  getTimes = () =>{
    for(let i = 0; i < 48; i++){
      this.chartX.push(moment('00:00', 'HH:mm').add(i*30, 'minutes').format('HH:mm'))
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
          res.forEach((row: any) => {
            row.hhd = JSON.parse(row.hhd.replaceAll('"','').replaceAll("'",'')).map((x:number) => x ? x : 0)
            if(row.hhd.length){
              row.total = row.hhd.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0))
            }

            this.months.push(row.date)
            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan):  null;
          })

          // if (this.global.selectedMpan?.value) {
          //   this.selectedMpan = this.global.selectedMpan.value
          // } else {
            this.selectedMpan === undefined ? this.selectedMpan = this.mpan[0] : null
          // }

          this.data = res.filter((x:any) => x.total)
          this.getTimes()
          this.months.sort();
          this.months.sort((a:string,b:string) => (a.split('/')[1] > b.split('/')[1]) ? 1 : ((b.split('/')[1] > a.split('/')[1]) ? -1 : 0))
          this.months.sort((a:string,b:string) => (a.split('/')[2] > b.split('/')[2]) ? 1 : ((b.split('/')[2] > a.split('/')[2]) ? -1 : 0))
          this.minDate = new Date(this.months[0])
          this.maxDate = new Date(this.months[this.months.length-1])

          this.firstYear = moment(this.months[0]).year()

          for(let i:number = moment().year(); i >= this.firstYear; i-- ){
            if(this.data.filter((x:any) => x.date === `${i}-12-25`).length){
              this.lastYear = i;
              this.dateFilter = i;
              break;
            }
          }

          this.filterData()
        }
      }
    )
  }


  filterData = () =>{
    this.defaultFilters = [];
    this.data = this.data.filter((x:any) => x.mpan === this.selectedMpan)
    for(let i: number = this.firstYear; i <= this.lastYear; i++){
      this.defaultFilters.push({
        name: i,
        value: i
      })
    }
    let tmp = this.data.filter((x:any) => moment(x.date).year() === this.dateFilter)
    let lowDay
    if(tmp.length) {
       lowDay = tmp.reduce((x: any, y: any) => x.total < y.total ? x : y)
    } else {
      lowDay = 0
    }
    let cDay = this.data.filter((x:any) => x.date === `${this.dateFilter}-12-25`)[0]
    if(cDay === undefined){
      this.msg.add({
        severity: 'warn',
        detail: 'No data found for Christmas Day'
      })
      return
    }
    this.chartData =  [{
      type: 'line',
      name: cDay.date,
      data: cDay.hhd,
      emphasis: {
        itemStyle: {
          borderColor: '#333',
          borderWidth: 1,
        }
      }
    },{
      type: 'line',
      name: lowDay.date,
      data: lowDay.hhd,
      emphasis: {
        itemStyle: {
          borderColor: '#333',
          borderWidth: 1,
        }
      }
    }]

    this.initChart()
  }

  ngOnInit() {
    this.getCompanies();
    this.screenWidth = window.innerWidth;
  }
}
