import { Component } from '@angular/core';
import {SidebarModule} from "primeng/sidebar";
import {RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {MenuItem, Message, MessageService} from "primeng/api";
import {EnvirotrackReportPieComponent} from "../envirotrack/report/envirotrack-report-pie/envirotrack-report-pie.component";
import {NgxEchartsDirective} from "ngx-echarts";
import {EnvirotrackReportHeatmapComponent} from "../envirotrack/report/envirotrack-report-heatmap/envirotrack-report-heatmap.component";
import {EnvirotrackReportBarComponent} from "../envirotrack/report/envirotrack-report-bar/envirotrack-report-bar.component";
import {EnvirotrackSmallPieChartComponent} from "../envirotrack/report/envirotrack-report-pie/envirotrack-small-pie-chart/envirotrack-small-pie-chart.component";
import {EnvirotrackBarSmallComponent} from "../envirotrack/report/envirotrack-report-bar/envirotrack-bar-small/envirotrack-bar-small.component";
import {PanelMenuModule} from "primeng/panelmenu";
import {GlobalService} from "../../_services/global.service";
import {DividerModule} from "primeng/divider";
import {RippleModule} from "primeng/ripple";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {MessagesModule} from "primeng/messages";
import {NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {MenuModule} from "primeng/menu";
import { createDirectus, authentication, rest, logout } from '@directus/sdk';
import {from} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "../../_services/users/auth.service";




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
    PanelMenuModule,
    DividerModule,
    RippleModule,
    ToggleButtonModule,
    FormsModule,
    PanelMenuModule,
    MessagesModule,
    NgIf,
    DialogModule,
    MenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  sideMenu: boolean = false;
  showFuelData: boolean = true;
  checked: boolean = false;
  menuBar : MenuItem[] =[]
  miniMenu: MenuItem[] = []
  items: MenuItem[] | undefined;
  client: any;

  showWarningBanner: boolean = false;
  messages: Message[] = [{severity: 'warn', summary: 'Using Microsoft Edge', detail: 'This website works best on Firefox or Chrome'}]
  showMenu: boolean = false;
  dropMenu:boolean=false;
  helpMenu:boolean=false;


  constructor(private global: GlobalService,private route: Router,private auth: AuthService,private msg: MessageService) {

    // Check for Microsoft Edges
    if (/Edg/.test(navigator.userAgent)) {
      this.showWarningBanner = true;
    }


    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.showFuelData = false
        }
      },
      complete: () => {
        // @ts-ignore
        this.menuBar = [
          {
            label: '<span class="material-symbols-outlined">dashboard</span> Dashboard',
            routerLink: '/dashboard',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">flowsheet</span> Non Half-Hourly Data',
            routerLink: '/dashboard/fuel-data',
            escape: false,
            visible: this.showFuelData
          },
          {
            label: '<span class="material-symbols-outlined">add_chart</span> Half-Hourly Data Upload',
            escape: false,
            routerLink: '/dashboard/import'
          },
          {
            label: '<span class="material-symbols-outlined">timeline</span> PET',
            routerLink: '/dashboard/pet',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">data_thresholding</span> Recommendations',
            routerLink: '/dashboard/recommendations',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">query_stats</span> Report',
            escape: false,
            routerLink: '/dashboard/heatmap',
            items: [
              {
                label: '<span class="material-symbols-outlined material-icon">assessment</span>Electricity Consumption, kWh per half-hour',
                escape: false,
                routerLink: '/dashboard/heatmap'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">scatter_plot</span>Electricity Consumption, kWh split by day of the week',
                escape: false,
                routerLink: '/dashboard/scatter',
              },
              {
                label: '<span class="material-symbols-outlined material-icon">bar_chart</span>Electricity Consumption, kWh',
                escape: false,
                routerLink: '/dashboard/bar'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">pie_chart</span>Electricity Consumption, % split by day of the week',
                escape: false,
                routerLink: '/dashboard/pie'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">show_chart</span>Christmas Day vs Lowest Day of the year consumption',
                escape: false,
                routerLink: '/dashboard/base1'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">stacked_line_chart</span>Average Daily Consumption, kWh per half hour',
                escape: false,
                routerLink: '/dashboard/avg'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">data_exploration</span>Maximum Demand',
                escape: false,
                routerLink: '/dashboard/demand'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">pie_chart</span>Breakdown of CO2e (tonnes) by emissions source',
                escape: false,
                routerLink: '/dashboard/co2emissions'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">data_usage</span>Breakdown of CO2e (tonnes) by scope',
                escape: false,
                routerLink: '/dashboard/co2emissionsbyscope'
              }
            ]
          },
          {
            label: '<span class="material-symbols-outlined">help</span> Help',
            escape: false,
            //routerLink:'/dashboard/help',
            items: [
              {
                label: '<span class="material-symbols-outlined">problem</span> Bug Report',
                escape: false,
                routerLink: '/dashboard/bug-report'
              },
              {
                label: '<span class="material-symbols-outlined">live_help</span> FAQ\'s',
                escape: false,
                routerLink: '/dashboard/faqs'
              }
            ]
          },


        ]


        this.miniMenu = [
          {
            label: '<span class="material-symbols-outlined">dashboard</span>',
            routerLink: '/dashboard',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">flowsheet</span>',
            routerLink: '/dashboard/fuel-data',
            escape: false,
            visible: this.showFuelData
          },
          {
            label: '<span class="material-symbols-outlined">add_chart</span>',
            escape: false,
            routerLink: '/dashboard/import'
          },

          {
            label: '<span class="material-symbols-outlined">timeline</span>',
            routerLink: '/dashboard/pet',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">data_thresholding</span>',
            routerLink: '/dashboard/recommendations',
            escape: false
          },
          {
            label: '<span class="material-symbols-outlined">query_stats</span> ',
            escape: false,
            routerLink: '/dashboard/heatmap',
            items: [
              {
                label: '<span class="material-symbols-outlined material-icon">assessment</span>',
                escape: false,
                routerLink: '/dashboard/heatmap'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">scatter_plot</span>',
                escape: false,
                routerLink: '/dashboard/scatter',
              },
              {
                label: '<span class="material-symbols-outlined material-icon">bar_chart</span>',
                escape: false,
                routerLink: '/dashboard/bar'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">pie_chart</span>',
                escape: false,
                routerLink: '/dashboard/pie'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">show_chart</span>',
                escape: false,
                routerLink: '/dashboard/base1'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">stacked_line_chart</span>',
                escape: false,
                routerLink: '/dashboard/avg'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">data_exploration</span>',
                escape: false,
                routerLink: '/dashboard/demand'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">pie_chart</span>',
                escape: false,
                routerLink: '/dashboard/co2emissions'
              },
              {
                label: '<span class="material-symbols-outlined material-icon">data_usage</span>',
                escape: false,
                routerLink: '/dashboard/co2emissionsbyscope'
              }
            ]
          },
          {
            label: '<span class="material-symbols-outlined">help</span>',
            escape: false,
            //routerLink:'/dashboard/help',
            items: [
              {
                label: '<span class="material-symbols-outlined">problem</span>',
                escape: false,
                routerLink: '/dashboard/bug-report'
              },
              {
                label: '<span class="material-symbols-outlined">live_help</span>',
                escape: false,
                routerLink: '/dashboard/faqs'
              }
            ]
          }

        ]

      }
    })
  }

  handleLogOut = () => {
    this.auth.logout()
    this.msg.add({
      severity:'warn',
      summary: 'You have been Logged Out !'
    })
  }
}
