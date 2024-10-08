
import {Component, OnInit} from '@angular/core';
import moment from "moment";
import * as echarts from "echarts";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";

@Component({
  selector: 'app-envirotrack-report-avg',
  standalone: true,
    imports: [
        SharedModules,
        SharedComponents,
        SidebarModule
    ],
  templateUrl: './envirotrack-report-avg.component.html',
  styleUrls: ['./envirotrack-report-avg.component.scss']
})
export class EnvirotrackReportAvgComponent implements OnInit {
  data: any;
  months: string[] = [];
  filteredData: any;
  companies: any;
  selectedCompany!: number;
  chartData: any = [];
  chartX: string[] = [];
  chartY: string[] = [];
  chartOptions!: echarts.EChartsOption;
  max: number = 0;
  dateFilter: number = 12;
  avgGuide: boolean = false;
  defaultFilters: object[] = [{
    name: 'All Data',
    value: 0
  },{
    name: 'Past 12 months',
    value: 12
  },{
    name: 'Past 6 months',
    value: 6
  },{
    name: 'Past 3 months',
    value: 3
  },{
    name: 'Past 1 months',
    value: 1
  }];
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  mpan: string[] = [];
  selectedMpan!: string;
  shift: boolean = true;
  screenHeight: any;
  screenWidth: any;
  isConsultant: boolean =false;

  constructor(
    private track: EnvirotrackService,
    private global: GlobalService
  ) {}

  initChart = () => {
    this.chartOptions = {
      legend: {
        show: true,
        top: 65
      },
      title: {
        text: 'Average daily consumption, kWh per half hour',
        left: 'center',
        top: 40,
        textStyle: {
          fontSize: this.screenWidth >= 1440 ? 16 : 12
        }
      },
      grid: {
        top: '100',
        right: '70',
        bottom: '40',
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
      xAxis: {
        type: 'category',
        data: this.chartX,
        name: 'Time',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
      },
      yAxis: {
        type: 'value',
        name: 'kW per half hour',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'axis',
        valueFormatter: (value: any) => value.toLocaleString('en-US',
          { minimumFractionDigits: 0,
          maximumFractionDigits: 0
          }),
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

    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data

                if (this.global.companyAssignedId.value) {
                  this.selectedCompany = this.global.companyAssignedId.value
                  if (this.global.selectedMpan.value) {
                    this.selectedMpan = this.global.selectedMpan.value;
                  }
                } else {
                  this.selectedCompany = res.data[0].id
                }

                this.onSelectCompany()
              }
            }
          })
        } else if (res.role.name === 'consultant') {

          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                console.log(res.data)
                this.companies = res.data


                if (this.global.companyAssignedId.value) {
                  this.selectedCompany = this.global.companyAssignedId.value
                  if (this.global.selectedMpan.value) {
                    this.selectedMpan = this.global.selectedMpan.value;
                  }
                } else {
                  this.selectedCompany = this.companies[0].id
                }

                this.isConsultant = true
                this.onSelectCompany()
              }
            }
          })
        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.isConsultant = true;
            }
          })
        }

      },
      complete: () => {
        if (this.global.selectedMpan.value) {
          this.selectedMpan = this.global.selectedMpan.value;
        }
      }
    })

    // this.track.getCompanies().subscribe({
    //   next: (res: any)=>{
    //     this.companies = res.data;
    //     this.selectedCompany = res.data[0].id
    //     this.onSelectCompany()
    //   }
    // })
  }

  onSelectCompany = () => {
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.track.updateSelectedCompany(this.selectedCompany)
    this.global.updateCompanyId(this.selectedCompany)
    this.global.updateSelectedMpan(this.selectedMpan)
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
            this.months.push(row.date)
            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan):  null;
          })


          if (this.selectedMpan && this.mpan.includes(this.selectedMpan)){
            this.selectedMpan = this.global.selectedMpan.value
          } else {
            this.selectedMpan = this.mpan[0]
          }


          this.data = res
          this.getTimes()
          this.months.sort();
          this.months.sort((a:string,b:string) => (a.split('/')[1] > b.split('/')[1]) ? 1 : ((b.split('/')[1] > a.split('/')[1]) ? -1 : 0))
          this.months.sort((a:string,b:string) => (a.split('/')[2] > b.split('/')[2]) ? 1 : ((b.split('/')[2] > a.split('/')[2]) ? -1 : 0))
          this.minDate = new Date(this.months[0])
          this.maxDate = new Date(this.months[this.months.length-1])
          this.filterData()
          this.initChart()
        }
      }
    )
  }

  averageTime = (data:any) =>{
    let times: number[] = new Array(48).fill(10);
    let days: number = data.length
    let returnVal: number[] = []
    data.forEach((x:any, i: number) => {

      x[1].forEach((number: number, i: number)=>{
        times[i] += number
      })
    })
    for(let x of times)  {
      returnVal.push(x/days)
    }
    return returnVal
  }

  filterData = () =>{
    if(this.dateRange != undefined && this.dateRange[1]){
      this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    }else {
      if(this.dateFilter){
        this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length+1])))
      } else {
        this.filteredData = this.data
      }
    }

    this.filteredData = this.filteredData.filter((x:any) => x.mpan === this.selectedMpan)

    let monday: any[] = [];
    let tuesday: any[] = [];
    let wednesday: any[] = [];
    let thursday: any[] = [];
    let friday: any[] = [];
    let saturday: any[] = [];
    let sunday: any[] = [];

    this.filteredData.forEach((row: any) => {

      switch (moment(row.date).format('dddd')) {
        case 'Monday':
          monday.push([row.date, row.hhd])
          break;
        case 'Tuesday':
          tuesday.push([row.date, row.hhd])
          break;
        case 'Wednesday':
          wednesday.push([row.date, row.hhd])
          break;
        case 'Thursday':
          thursday.push([row.date, row.hhd])
          break;
        case 'Friday':
          friday.push([row.date, row.hhd])
          break;
        case 'Saturday':
          saturday.push([row.date, row.hhd])
          break;
        case 'Sunday':
          sunday.push([row.date, row.hhd])
          break;
        default: break;
      }

    })


    this.chartData = [
      {
        type: 'line',
        name: 'Monday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.monday_start_time
          },{
            xAxis: this.companies?.monday_end_time
          }]]
        },
        data: this.averageTime(monday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Tuesday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.tuesday_start_time
          },{
            xAxis: this.companies?.tuesday_end_time
          }]]
        },
        data: this.averageTime(tuesday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Wednesday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.wednesday_start_time
          },{
            xAxis: this.companies?.wednesday_end_time
          }]]
        },
        data: this.averageTime(wednesday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Thursday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.thursday_start_time
          },{
            xAxis: this.companies?.thursday_end_time
          }]]
        },
        data: this.averageTime(thursday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Friday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.friday_start_time
          },{
            xAxis: this.companies?.friday_end_time
          }]]
        },
        data: this.averageTime(friday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Saturday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.saturday_start_time
          },{
            xAxis: this.companies?.saturday_end_time
          }]]
        },
        data: this.averageTime(saturday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }, {
        type: 'line',
        name: 'Sunday',
        markArea: {
          itemStyle: {
            opacity: this.shift ? 0.3 : 0
          },
          data: [[{
            xAxis: this.companies?.sunday_start_time
          },{
            xAxis: this.companies?.sunday_end_time
          }]]
        },
        data: this.averageTime(sunday),
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }]

    let arr: number[] = this.chartData.map((x:any) => x[2])
    this.max = Math.max(...arr)
    this.initChart()
  }

  ngOnInit() {
    this.getCompanies();

    if (this.track.selectedCompany.value) {
      this.selectedCompany = this.track.selectedCompany.value
      this.getData(this.selectedCompany)
    }

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

  }
}
