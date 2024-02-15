import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {EChartsOption} from "echarts";
import moment from "moment";
import {PanelModule} from "primeng/panel";
import {NgxEchartsDirective} from "ngx-echarts";

@Component({
  selector: 'app-envirotrack-day-line',
  standalone: true,
  templateUrl: './envirotrack-day-line.component.html',
  imports: [
    PanelModule,
    NgxEchartsDirective
  ],
  styleUrls: ['./envirotrack-day-line.component.scss']
})
export class EnvirotrackDayLineComponent implements OnInit{
  data: any;
  chartOptions!: EChartsOption | null;
  productiveLoad: number = 0;
  nonProductiveLoad: number = 0;
  productivePercent: number = 0;
  nonProductivePercent: number = 0;
  constructor(
    private dialog: DynamicDialogConfig,
  ) {
  }

  // This function receives start, end and date and initializes a chart accordingly
  initChart = (start: string, end: string, date: string) => {
    // Configuration details of chart
    this.chartOptions = {
      title: {
        text: `kWh usage on ${date}`,
        left: 'center'
      },
      legend: {
        show: false
      },
      tooltip: {
        extraCssText: 'text-transform: capitalize',
        trigger: 'item',
        formatter: 'Time: {b}\n ({c} kWh)',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        name: 'Date',
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
      series: [{
        type: 'line',
        name: `kWh usage on ${date}`,
        color: '#006633',
        markArea: {
          silent: true,
          itemStyle: {
            opacity: 0.4
          },
          data: [
            [{
              xAxis: start
            },{
              xAxis: end
            }]
          ]
        },
        data: this.data
      },{
        type: 'pie',
        name: '% of use',
        center: ['85%', '20%'],
        radius: ['5%','30%'],
        itemStyle: {
          borderRadius: 5
        },
        data: [{
          name: 'Productive Load',
          value: this.productiveLoad
        }, {
          name: 'Non Productive Load',
          value: this.nonProductiveLoad
        }]
      }]
    }
  }

  // Angular lifecycle hook to perform operations on component initialization
  ngOnInit(): void {
    // Map data from dialog and trigger times fetching
    this.data = this.dialog.data.data.map((x:any) => [x[1], x[2]])

    // Retrieves appropriate times for chart rendering
    this.getTimes(this.dialog.data.id, this.dialog.data.data[0][0])

  }

  // API call to fetch necessary data and on success, initialize chart with it
  getTimes = (id: number, date: string) => {
    // this.admin.fnGetCompanyDetails(id, [
    //   `${moment(date).format('dddd').toLowerCase()}_start_time`,
    //   `${moment(date).format('dddd').toLowerCase()}_end_time`
    // ]).subscribe({
    //   next: (res: any) => {
    //
    //     this.getLoads(this.data, date, res)
    //     this.initChart(res[`${moment(date).format('dddd').toLowerCase()}_start_time`], res[`${moment(date).format('dddd').toLowerCase()}_end_time`], moment(date).format('dddd DD/MM/YYYY'))
    //   }
    // })
  }

  //Function to find and split productive and non-productive loads
  getLoads = (dataArray: any, date: string, res: any) => {
    let productionStartTime: any = Object.entries(res)[0][1] || '0'
    let productionEndTime: any = Object.entries(res)[1][1] || '0'
    let productionStart = moment(date).set({
      hour: productionStartTime.substring(0,2),
      minute: productionStartTime.substring(3,5)
    })
    let productionEnd = moment(date).set({
      hour: productionEndTime.substring(0,2),
      minute: productionEndTime.substring(3,5)
    })

    let d = dataArray.map((x:any) => [moment(date).set({
        hour: x[0].substring(0, 2),
        minute: x[0].substring(3, 5)
      }), x[1]]
    )

    this.productiveLoad = d.filter((x:any) => x[0].isBetween(productionStart, productionEnd))
      .reduce((accumulator:any, currentArray:any) => accumulator + currentArray[1], 0)
    this.nonProductiveLoad = d.filter((x:any) => !x[0].isBetween(productionStart, productionEnd))
      .reduce((accumulator:any, currentArray:any) => accumulator + currentArray[1], 0)
    this.productivePercent = Math.round(this.productiveLoad / (this.productiveLoad+this.nonProductiveLoad) * 100)
    this.nonProductivePercent = Math.round(this.nonProductiveLoad / (this.productiveLoad+this.nonProductiveLoad) * 100)
  }
}
