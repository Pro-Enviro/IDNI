
import {Component, OnInit} from '@angular/core';
import moment from "moment";
import {EnvirotrackService} from "../../envirotrack.service";
import {EChartsOption} from "echarts";
import * as echarts from "echarts";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";

@Component({
  selector: 'app-envirotrack-report-pie',
  standalone: true,
    imports: [SharedModules, SharedComponents, SidebarModule],
  templateUrl: './envirotrack-report-pie.component.html',
  styleUrls: ['./envirotrack-report-pie.component.scss']
})
export class EnvirotrackReportPieComponent implements OnInit {
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
  dateFilter: number = 12;
  pieGuide:boolean = false;
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
  screenWidth: any;
  isConsultant: boolean = false;

  constructor(
    private track: EnvirotrackService,
    private global: GlobalService
  ) {}

  // saveChartAsBase64 = () => {
  //
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
        top: 70,
        left: 'center'
      },
      grid:{
        bottom:'100'
      },
      title: {
        text: 'Electricity Consumption, % split by Day of the Week',
        left: 'center',
        top:30,
        textStyle:{
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
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      series: [{
        top:100,
        type: 'pie',
        data: this.chartData,
        radius: this.screenWidth >= 1441 ? [50,200] : [30,100],
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

  getCompanies = () =>{

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
              this.isConsultant = true;
            }
          })
        }

      }
    })

    // this.track.getCompanies().subscribe({
    //   next: (res: any)=>{
    //     if (res.data) {
    //       this.companies = res.data
    //       this.selectedCompany = res.data[0].id
    //       this.onSelectCompany()
    //     }
    //   }
    // })
  }

  onSelectCompany = () => {
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData(this.selectedCompany)
  }

  getTimes = () => {
    for(let i = 0; i < 48; i++){
      this.chartY.push(moment('00:00', 'HH:mm').add(i*30, 'minutes').format('HH:mm'))
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

          // if (this.global.selectedMpan?.value) {
          //   this.selectedMpan = this.global.selectedMpan.value
          // } else {
            this.selectedMpan === undefined ? this.selectedMpan = this.mpan[0] : null
          // }

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

    if(this.dateRange != undefined && this.dateRange[1]){
      this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
      this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    }else{
      if(this.dateFilter){
        this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length+1])))
        this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length+1])))
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
    this.filteredData = this.filteredData.filter((x:any) => x.mpan === this.selectedMpan)



    this.filteredData.forEach((row: any) => {
      row.hhd.forEach((hh: any, i:number) => {
        hh = hh ? hh : 0;
        row.hhd[i] = !isNaN(parseInt(hh.toString())) ? hh : 0
      })
      if(row.hhd.length) {
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
      { name: 'Sunday', value: sunday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Monday', value: monday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Tuesday', value: tuesday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Wednesday', value: wednesday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Thursday', value: thursday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Friday', value: friday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) ) },
      { name: 'Saturday', value: saturday.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) )}
    ]


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
  }
}
