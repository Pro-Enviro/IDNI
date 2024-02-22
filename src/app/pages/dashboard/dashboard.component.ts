import { Component } from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {MenuItem} from "primeng/api";
import {
  EnvirotrackReportPieComponent
} from "../envirotrack/report/envirotrack-report-pie/envirotrack-report-pie.component";
import {NgxEchartsDirective} from "ngx-echarts";
import {
  EnvirotrackReportHeatmapComponent
} from "../envirotrack/report/envirotrack-report-heatmap/envirotrack-report-heatmap.component";
import {
  EnvirotrackReportBarComponent
} from "../envirotrack/report/envirotrack-report-bar/envirotrack-report-bar.component";
import {
  EnvirotrackSmallPieChartComponent
} from "../envirotrack/report/envirotrack-report-pie/envirotrack-small-pie-chart/envirotrack-small-pie-chart.component";

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
    EnvirotrackSmallPieChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  envirotrackPage: MenuItem[] = [
    {
      label:'<span class="material-symbols-outlined">dashboard</span> Dashboard',
      routerLink:''
    },
    {
      label:'<span class="material-symbols-outlined">flowsheet</span> Fuel Data',
      routerLink:'envirotrack/fuel-data',
    },
    {
      label:'<span class="material-symbols-outlined">stacked_line_chart</span> Envirotrack Import',
      routerLink:'envirotrack/import'
    },
    {
      label:'<span class="material-symbols-outlined">monitoring</span> Envirotrack Report',
      routerLink:'/envirotrack/report/heatmap',
      items:[
        {
          label:'<span class="material-symbols-outlined material-icon">assessment</span> Electricity consumption, kWh per half-hour',
          escape: false,
          routerLink: 'heatmap'
        },
        {
          label:'<span class="material-symbols-outlined material-icon">scatter_plot</span> Electricity consumption, kWh split by day of the week',
          escape: false,
          routerLink: 'scatter',
        },
        {
          label:'<span class="material-symbols-outlined material-icon">bar_chart</span> Electricity consumption, kWh',
          escape: false,
          routerLink: 'bar'
        },
        {
          label:'<span class="material-symbols-outlined material-icon">pie_chart</span> Electricity Consumption, % split by day of the week',
          escape: false,
          routerLink: 'pie'
        },
        {
          label:'<span class="material-symbols-outlined material-icon">show_chart</span> Christmas Day vs lowest day of the year consumption',
          escape: false,
          routerLink: 'base1'
        },
        {
          label:'<span class="material-symbols-outlined material-icon">stacked_line_chart</span> Average daily consumption, kWh per half hour',
          escape: false,
          routerLink: 'avg'
        },
        {
          label:'<span class="material-symbols-outlined material-icon">data_exploration</span> Maximum Demand',
          escape: false,
          routerLink: 'demand'
        }

      ]
    }
  ]

}
