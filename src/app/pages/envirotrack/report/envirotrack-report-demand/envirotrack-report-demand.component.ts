import {Component, OnInit} from '@angular/core';
import moment from "moment";
import * as echarts from "echarts";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";
import {DbService} from "../../../../_services/db.service";
@Component({
  selector: 'app-envirotrack-report-demand',
  standalone: true,
    imports: [SharedModules, SharedComponents, SidebarModule],
  templateUrl: './envirotrack-report-demand.component.html',
  styleUrls: ['./envirotrack-report-demand.component.scss']
})
export class EnvirotrackReportDemandComponent implements OnInit {
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
  maxGuide:boolean = false;
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
  }];
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  mpan: string[] = [];
  selectedMpan!: string;
  supply: any;
  asc: any;
  screenWidth: any;
  isConsultant: boolean = false;

  constructor(
    private track: EnvirotrackService,
    private global: GlobalService,
    private db: DbService
  ) {}

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

  initChart = () => {
    this.chartOptions = {
      legend: {
        show: true,
        top: 30
      },
      title: {
        text: 'Maximum Demand',
        left: 'center',
        textStyle: {
          fontSize: this.screenWidth >= 1441 ? 16: 12
        }
      },
      grid: {
        left: '140'
      },

      xAxis: {
        type: 'category',
        data: this.chartX,
        name: 'Date',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
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
          width:this.screenWidth >= 1441 ? 200 : 120,
          height: this.screenWidth >= 1441 ? 50: 30
        }
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
        name: 'kW',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      series: [{
        name: 'kW',
        type: 'line',
        data: this.chartData,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      },
        {
        name: 'MIC',
        type: 'line',
        data: this.asc,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1,
          }
        }
      }
      ]
    }
  }

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
      this.chartY.push(moment('00:00', 'HH:mm').add(i*30, 'minutes').format('HH:mm'))
    }
  }

  getAsc = (startDate: any, endDate: any) => {

    this.asc = [];

    this.db.getASCData(this.selectedCompany).subscribe({
      next: (res: any) => {
        this.supply = res.data
        if (!res.data.length) {
          this.initChart()
        } else {

          this.supply = this.supply.filter((asc_data: any) => asc_data.mpan === this.selectedMpan)


          this.supply.forEach((row: any) => {
            row.start_date = moment(row.start_date);
            row.end_date = moment(row.end_date);
          })


          this.supply = this.supply.sort((a: any, b: any) => a.start_date.unix() - b.start_date.unix())

          this.supply.forEach((row: any) => {
            let checkStart = row.start_date.isBefore(moment(startDate, 'DD/MM/YYYY'))
            const formattedEndDate = row.end_date.format('DD/MM/YYYY')
            this.asc.push([ checkStart ? startDate : row.start_date.format('DD/MM/YYYY'), row.asc],[formattedEndDate, row.asc])
          })

          // if (this.asc.length){
          //   this.asc[this.asc.length-1][0] = endDate
            this.initChart()
          // }
        }
      }
    })

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
            this.months.push(moment(row.date).format('DD/MM/YYYY'))
            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan) : null;
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
        }
      }
    )
  }


  filterData = () =>{

    this.chartData = [];
    this.asc = [];

    if(this.dateRange != undefined && this.dateRange[1]){
      this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
      this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    }else {
      if(this.dateFilter){
        //this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.months[this.months.length-1], 'DD/MM/YYYY').subtract(this.dateFilter,'months'), moment(this.months[this.months.length-1], 'DD/MM/YYYY')))
        //this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length-1], 'DD/MM/YYYY')))

        this.filteredData = this.data.filter((x: any) => moment(x.date).isBetween(moment(this.months[this.months.length - 1],'DD/MM/YYYY').subtract(this.dateFilter, 'months'), moment(this.months[this.months.length + 1])))
        this.chartX = this.months.filter((x: any) => moment(x).isBetween(moment(this.months[this.months.length - 1],'DD/MM/YYYY').subtract(this.dateFilter, 'months'), moment(this.months[this.months.length + 1])))
      } else {
        this.chartX = this.months
        this.filteredData = this.data
      }
    }
    this.filteredData = this.filteredData.filter((x:any) => x.mpan === this.selectedMpan)
    this.chartX = [];
    this.filteredData.forEach((row: any) => {
      row.hhd.forEach((hh: any, i:number) => {
        hh ? row.hhd[i] = !isNaN(parseInt(hh.toString())) ? hh : 0: 0
      })
      this.chartData.push([moment(row.date).format('DD/MM/YYYY'), (Math.max(...row.hhd)*2 )])

    })

    // @ts-ignore
    this.chartData  = this.chartData.sort((a:any,b:any) => moment(a[0],'DD/MM/YYYY').format('YYYYMMDD') - moment(b[0],'DD/MM/YYYY').format('YYYYMMDD'))
    this.chartData.forEach((row:any) => {
      this.chartX.push(row[0])
    })

    this.getAsc(this.chartX[0], this.chartX[this.chartX.length - 1])
    let arr: number[] = this.chartData.map((x:any) => x[2])
    this.max = Math.max(...arr)
  }

  ngOnInit() {
    this.getCompanies();

    if (this.track.selectedCompany.value) {
      this.selectedCompany = this.track.selectedCompany.value
      this.getData(this.selectedCompany)
    }

    this.screenWidth = window.innerWidth

  }
}
