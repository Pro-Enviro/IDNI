import { Component } from '@angular/core';
import {
    EnvirotrackBarSmallComponent
} from "../../envirotrack/report/envirotrack-report-bar/envirotrack-bar-small/envirotrack-bar-small.component";
import {
    EnvirotrackSmallPieChartComponent
} from "../../envirotrack/report/envirotrack-report-pie/envirotrack-small-pie-chart/envirotrack-small-pie-chart.component";

@Component({
  selector: 'app-dasboard-widgets',
  standalone: true,
    imports: [
        EnvirotrackBarSmallComponent,
        EnvirotrackSmallPieChartComponent
    ],
  templateUrl: './dasboard-widgets.component.html',
  styleUrl: './dasboard-widgets.component.scss'
})
export class DasboardWidgetsComponent {

}
