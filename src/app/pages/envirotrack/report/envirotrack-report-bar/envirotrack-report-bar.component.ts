import {Component, OnInit} from '@angular/core';
import moment from "moment";
import * as echarts from "echarts";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";

@Component({
  selector: 'app-envirotrack-report-bar',
  standalone: true,
  imports: [
    SharedModules,
    SharedComponents
  ],

  templateUrl: './envirotrack-report-bar.component.html',
  styleUrls: ['./envirotrack-report-bar.component.scss']
})
export class EnvirotrackReportBarComponent implements OnInit {
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
  screenWidth: any;

  constructor(
    private track: EnvirotrackService,
  ) {}

  // saveChartAsBase64 = () => {
  //   console.log('saving as base 64');
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
  //     pixelRatio: 2
  //   })
  //   console.log(data);
  //   return data;
  // }
  initChart = () => {
    this.chartOptions = {
      legend: {
        show: true,
      },
      grid: {
        left: '140'
      },
      title: {
        text: 'Electricity Consumption, kWh',
        left: 'center',
        textStyle:{
          fontSize: this.screenWidth >= 1441 ? 16: 12
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
          width: this.screenWidth >= 1441 ? 200: 120,
          height: this.screenWidth >= 1441 ? 50 : 30
        }
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
        name: 'kWh',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 70
      },
      series: [{
        type: 'bar',
        data: this.chartData,
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
    this.track.getCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data;
      }
    })
  }

  onSelectCompany = () => {
    // this.global.updateSelectedMpan(this.selectedMpan)
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData(this.selectedCompany)
  }

  getTimes = () =>{
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
            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan) : null;
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

    this.chartData = [];
    if(this.dateRange != undefined && this.dateRange[1]){
      this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
      this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    }else {
      if(this.dateFilter){
        this.filteredData = this.data.filter((x:any) => moment(x.date).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length-1])))
        this.chartX = this.months.filter((x:any) => moment(x).isBetween(moment(this.months[this.months.length-1]).subtract(this.dateFilter,'months'), moment(this.months[this.months.length-1])))
      } else {
        this.chartX = this.months
        this.filteredData = this.data
      }
    }
    this.filteredData = this.filteredData.filter((x:any) => x.mpan === this.selectedMpan)
    this.filteredData.forEach((row: any) => {
      row.hhd.forEach((hh: any, i:number) => {
        hh = hh ? hh : 0;
        row.hhd[i] = !isNaN(parseInt(hh.toString())) ? hh : 0
      })
      if(row.hhd.length){
        this.chartData.push([row.date, row.hhd.reduce((x:number, y:number) => (x ? x : 0) + (y ? y : 0) )])
      }

    })

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

    this.screenWidth = window.innerWidth
  }
}
