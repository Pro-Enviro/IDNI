import { Component } from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {EnvirotrackReportPieComponent} from "../envirotrack/report/envirotrack-report-pie/envirotrack-report-pie.component";
import {NgxEchartsDirective} from "ngx-echarts";
import {EnvirotrackReportHeatmapComponent} from "../envirotrack/report/envirotrack-report-heatmap/envirotrack-report-heatmap.component";
import {EnvirotrackReportBarComponent} from "../envirotrack/report/envirotrack-report-bar/envirotrack-report-bar.component";
import {EnvirotrackSmallPieChartComponent} from "../envirotrack/report/envirotrack-report-pie/envirotrack-small-pie-chart/envirotrack-small-pie-chart.component";
import {EnvirotrackBarSmallComponent} from "../envirotrack/report/envirotrack-report-bar/envirotrack-bar-small/envirotrack-bar-small.component";
import {PanelMenuModule} from "primeng/panelmenu";
import {GlobalService} from "../../_services/global.service";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarModule,
    RouterLink,
    ButtonModule,
    MenubarModule,
    EnvirotrackReportPieComponent,
    NgxEchartsDirective,
    EnvirotrackReportHeatmapComponent,
    EnvirotrackReportBarComponent,
    EnvirotrackSmallPieChartComponent,
    EnvirotrackBarSmallComponent,
    PanelMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  showFuelData: boolean = true;
  // envirotrackReport : MenuItem[] =[
  //   {
  //     label:'<span class="material-symbols-outlined">dashboard</span> Dashboard',
  //     routerLink:'/dashboard',
  //     escape: false
  //   },
  //   {
  //     label:'<span class="material-symbols-outlined">flowsheet</span> Fuel Data',
  //     routerLink:'/dashboard/fuel-data',
  //     escape: false
  //   },
  //   {
  //     label:'<span class="material-symbols-outlined">add_chart</span> Data Upload',
  //     escape: false,
  //     routerLink:'/dashboard/import'
  //   },
  //
  //   {
  //     label:'<span class="material-symbols-outlined">add_chart</span> PET',
  //     routerLink:'/dashboard/pet'
  //   }
  // ]


  envirotrackReport : MenuItem[] =[]

  constructor(private global: GlobalService) {
    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user'){
          this.showFuelData = false
        }
      },
      complete: () => {
        this.envirotrackReport  =[
          {
            label:'<span class="material-symbols-outlined">dashboard</span> Dashboard',
            routerLink:'/dashboard',
            escape: false
          },
          {
            label:'<span class="material-symbols-outlined">flowsheet</span> Fuel Data',
            routerLink:'/dashboard/fuel-data',
            escape: false,
            visible: this.showFuelData
          },
          {
            label:'<span class="material-symbols-outlined">add_chart</span> Data Upload',
            escape: false,
            routerLink:'/dashboard/import'
          },

          {
            label:'<span class="material-symbols-outlined">timeline</span> PET',
            routerLink:'/dashboard/pet',
            escape: false
          },
          {
            label:'<span class="material-symbols-outlined">data_thresholding</span> Recommendations',
            routerLink:'/dashboard/recommendations',
            escape: false
          },
          {
            label:'<span class="material-symbols-outlined">query_stats</span> Report',
            escape: false,
            routerLink:'/dashboard/heatmap',
            items:[
              {
                label:'<span class="material-symbols-outlined material-icon">assessment</span>Electricity Consumption, kWh per half-hour',
                escape: false,
                routerLink: '/dashboard/heatmap'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">scatter_plot</span>Electricity Consumption, kWh split by day of the week',
                escape: false,
                routerLink: '/dashboard/scatter',
              },
              {
                label:'<span class="material-symbols-outlined material-icon">bar_chart</span>Electricity Consumption, kWh',
                escape: false,
                routerLink: '/dashboard/bar'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">pie_chart</span>Electricity Consumption, % split by day of the week',
                escape: false,
                routerLink: '/dashboard/pie'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">show_chart</span>Christmas Day vs Lowest Day of the year consumption',
                escape: false,
                routerLink: '/dashboard/base1'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">stacked_line_chart</span>Average Daily Consumption, kWh per half hour',
                escape: false,
                routerLink: '/dashboard/avg'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">data_exploration</span>Maximum Demand',
                escape: false,
                routerLink: '/dashboard/demand'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">pie_chart</span>Breakdown of CO2e (tonnes) by emissions source',
                escape: false,
                routerLink: '/dashboard/co2emissions'
              },
              {
                label:'<span class="material-symbols-outlined material-icon">data_usage</span>Breakdown of CO2e (tonnes) by scope',
                escape: false,
                routerLink: '/dashboard/co2emissionsbyscope'
              }
            ]
          }

        ]
      }
    })



  }
}
