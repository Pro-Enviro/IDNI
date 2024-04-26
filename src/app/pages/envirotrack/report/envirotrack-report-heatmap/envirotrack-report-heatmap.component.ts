import {Component, OnInit} from '@angular/core';
import * as echarts from "echarts";
import {EnvirotrackService} from "../../envirotrack.service";
import moment from "moment/moment";
import { PlotlyService, PlotlySharedModule, PlotlyViaCDNModule} from "angular-plotly.js";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {EnvirotrackDayLineComponent} from "../envirotrack-day-line/envirotrack-day-line.component";
import {SharedModules} from "../../../../shared-module";
import {SharedComponents} from "../../shared-components";
import {GlobalService} from "../../../../_services/global.service";
import {SidebarModule} from "primeng/sidebar";

PlotlyViaCDNModule.setPlotlyVersion('latest')


@Component({
  selector: 'app-envirotrack-report-heatmap',
  standalone: true,
  templateUrl: './envirotrack-report-heatmap.component.html',
  providers: [
    DialogService,
    PlotlyService
  ],
  imports: [
    SharedModules,
    SharedComponents,
    PlotlySharedModule,
    PlotlyViaCDNModule,
    SidebarModule
  ],
  styleUrls: ['./envirotrack-report-heatmap.component.scss']
})
export class EnvirotrackReportHeatmapComponent implements OnInit {
  dialogRef: DynamicDialogRef | undefined;
  data: any;
  months: string[] = [];
  filteredData: any;
  companies: any;
  selectedCompany!: number;
  chartData: any = [];
  chartX: string[] = [];
  chartY: string[] = [];
  chartOptions!: echarts.EChartsOption | null;
  max: number = 0;
  dateFilter: number = 12;
  heatmapGuide: boolean = false;
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
    name: 'Q1',
    value: 'q1'
  }, {
    name: 'Q2',
    value: 'q2'
  }, {
    name: 'Q3',
    value: 'q3'
  }, {
    name: 'Q4',
    value: 'q4'
  }];
  dateRange: any;
  minDate!: Date;
  maxDate!: Date;
  mpan: string[] = [];
  selectedMpan!: string;
  testChart!: any;
  chartModel: boolean = true;
  screenWidth: any;
  isConsultant: boolean = false

  constructor(
    private track: EnvirotrackService,
    private dialog: DialogService,
    private global: GlobalService
  ) {
  }

  onPlotClick = (event: any) => {
    this.dialogRef = this.dialog.open(EnvirotrackDayLineComponent, {
      width: '95vw',
      data: {
        data: this.chartData.filter((row: any) => row[0] === event.points[0].x),
        id: this.selectedCompany,
        mpan: this.selectedMpan
      }
    })
  }


  initChart = () => {
    // @ts-ignore


    this.chartOptions = {
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
      width: this.screenWidth >= 1441 ? 950 : this.screenWidth >= 1281 ? 500 : 380,
      title: {
        text: 'Electricity Consumption, kWh split by day of the week',
        left: 'center',
        top: 0,
        textStyle:{
          fontSize: this.screenWidth >= 1441 ? 16 : 12
        }
      },
      toolbox: {
        show: true,
        right:'0',
        top:'0',
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      visualMap: {
        type: 'piecewise',
        min: 0,
        max: Math.round(this.max),
        left: 'right',
        top: '50',
        calculable: true,
        realtime: false,
        splitNumber: 25,
        inRange: {
          color: [
            "#c2c2c2", "#0024FF", "#0049FF", "#006DFF", "#0092FF",
            "#00B6FF", "#00DBFF", "#00FFFF", "#00FFDB", "#00FFB6",
            "#00FF92", "#00FF6D", "#00FF49", "#00FF24", "#00FF00",
            "#24FF00", "#49FF00", "#6DFF00", "#92FF00", "#B6FF00",
            "#DBFF00", "#FFFF00", "#FFDB00", "#FFB600", "#FF9200",
            "#FF6D00", "#FF4900", "#FF2400"
          ]
        }
      },
      xAxis: {
        type: 'category',
        data: this.chartX,
        name: 'DATE',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
      },
      yAxis: {
        type: 'category',
        data: this.chartY,
        name: 'Time',
        nameLocation: "middle",
        nameTextStyle: {
          fontSize: 16,
          fontWeight: "bold"
        },
        nameGap: 40
      },
      dataZoom: [{
        type: 'slider'
      }],
      series: [
        {
          type: 'heatmap',
          data: this.chartData,
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

  getCompanies = () => {

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
  }

  onSelectCompany = () => {
    this.chartData = [];
    this.chartOptions = null;
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getData(this.selectedCompany)
  }

  getTimes = () => {
    for (let i = 0; i < 48; i++) {
      this.chartY.push(moment('00:00', 'HH:mm').add(i * 30, 'minutes').format('HH:mm'))
    }
  }

  getData = (id: number) => {

    if (!id) return;

    this.mpan = [];
    this.months = [];
    this.chartData = [];
    this.chartOptions = null;
    this.chartX = [];
    this.chartY = [];
    this.track.getData(id).subscribe({
        next: (res) => {
          res.forEach((row: any) => {
            row.hhd = JSON.parse(row.hhd.replaceAll('"', '').replaceAll("'", '')).map((x: number) => x ? x : 0)
            this.months.push(row.date)

            !~this.mpan.indexOf(row.mpan) ? this.mpan.push(row.mpan) : null;
          })

          // Changing companies should also change mpan
          // if (this.global.selectedMpan.value) {
          //   this.selectedMpan = this.global.selectedMpan.value
          // } else {
            this.selectedMpan === undefined ? this.selectedMpan = this.mpan[0] : null
          // }


          this.data = res
          this.getTimes()
          this.months.sort();
          this.months.sort((a: string, b: string) => (a.split('/')[1] > b.split('/')[1]) ? 1 : ((b.split('/')[1] > a.split('/')[1]) ? -1 : 0))
          this.months.sort((a: string, b: string) => (a.split('/')[2] > b.split('/')[2]) ? 1 : ((b.split('/')[2] > a.split('/')[2]) ? -1 : 0))
          this.minDate = new Date(this.months[0])
          this.maxDate = new Date(this.months[this.months.length - 1])


          this.filterData()
        },
        error: (err: any) => console.log(err)
      }
    )
  }


  filterData = () => {
    this.chartData = [];
    if (this.dateRange != undefined && this.dateRange[1]) {
      this.filteredData = this.data.filter((x: any) => moment(x.date).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
      this.chartX = this.months.filter((x: any) => moment(x).isBetween(moment(this.dateRange[0]), moment(this.dateRange[1])))
    } else {
      if (this.dateFilter && !isNaN(this.dateFilter)) {
        this.filteredData = this.data.filter((x: any) => moment(x.date).isBetween(moment(this.months[this.months.length - 1]).subtract(this.dateFilter, 'months'), moment(this.months[this.months.length - 1])))
        this.chartX = this.months.filter((x: any) => moment(x).isBetween(moment(this.months[this.months.length - 1]).subtract(this.dateFilter, 'months'), moment(this.months[this.months.length - 1])))
      } else if (this.dateFilter && isNaN(this.dateFilter)) {
        // @ts-ignore
        let dateFilter = parseInt(this.dateFilter.substring(1, 2))
        let start!: Date;
        let end: Date;
        if (dateFilter === 1) {
          start = moment(this.maxDate).subtract(12, 'months').toDate();
          end = moment(this.maxDate).subtract(9, 'months').toDate()
        }
        if (dateFilter === 2) {
          start = moment(this.maxDate).subtract(9, 'months').toDate();
          end = moment(this.maxDate).subtract(6, 'months').toDate()
        }
        if (dateFilter === 3) {
          start = moment(this.maxDate).subtract(6, 'months').toDate();
          end = moment(this.maxDate).subtract(3, 'months').toDate()
        }
        if (dateFilter === 4) {
          start = moment(this.maxDate).subtract(3, 'months').toDate();
          end = moment(this.maxDate).subtract(0, 'months').toDate()
        }


        this.filteredData = this.data.filter((x: any) => {
          return moment(x.date).isBetween(moment(start), moment(start).add(3, 'months'))
        })
        this.chartX = this.months.filter((x: any) => moment(x).isBetween(start, end))



      } else {
        this.chartX = this.months
        this.filteredData = this.data
      }
    }


    this.filteredData.forEach((row: any) => {
      if (row.mpan === this.selectedMpan) {
        row.hhd.forEach((hh: number, i: number) => {
          if (!isNaN(parseInt(hh.toString()))) {
            this.chartData.push([row.date, moment('00:00', 'HH:mm').add(i * 30, 'minutes').format('HH:mm'), hh])
          }
        })
      }
    })


    let arr: number[] = this.chartData.map((x: any) => x[2])
    this.max = Math.max(...arr)



    this.initChart()
    this.initContourChart(this.chartData)

  }

  initContourChart = (data: any) => {



    this.chartData.sort((a: any, b: any) => moment(a[0], 'YYYY-MM-DD') > moment(b[0], 'YYYY-MM-DD'));


    this.testChart = {
      data: [{
        x: data.map((x: any) => x[0]),
        y: data.map((y: any) => y[1]),
        z: data.map((z: any) => z[2]),
        x0: 1,
        xd: 2,
        type: 'contour',
        colorscale: 'Jet',
        contours: {
          coloring: 'heatmap',
        },
        line: {
          color: '#000',
          dash: 'solid',
          width: 0.5
        },
        colorbar: {
          borderWidth: 20,
          borderColor: '#00',
          tickmode: 'auto',
          nticks: 50,
          dtick: 20,
          orientation: 'h'
        }
      }],
      layout: {
        title: {
          text: 'Electricity Consumption, kWh per half-hour',
        },
        // title: 'Energy Footprint',
        xaxis: {
          title: {
            text: 'Date',
            font: {
              // family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          },
        },
        yaxis: {
          title: {
            text: 'Time',
            font: {
              // family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        },
        zaxis: {
          title: {
            text: 'kWh',
            font: {
              // family: 'Courier New, monospace',
              size: 18,
              color: '#7f7f7f'
            }
          }
        },
        images: [
          { // Adjust coords of logo depending on screen size
            x: this.screenWidth >= 1441 ? 0 : this.screenWidth >= 1281 ?-0.1 : -0.18,
            y: this.screenWidth >= 1441 ? 1.24 : this.screenWidth >= 1281 ? 1.26 : 1.29,
            sizex: 0.15,
            sizey: 0.15,
            source: "/assets/img/pro-enviro-logo-email.png",
            xanchor: "left",
            xref: "paper",
            yanchor: "top",
            yref: "paper"
          }
        ],
      }
    }
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
