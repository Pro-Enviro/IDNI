import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
    EnvirotrackBarSmallComponent
} from "../../envirotrack/report/envirotrack-report-bar/envirotrack-bar-small/envirotrack-bar-small.component";
import {
    EnvirotrackSmallPieChartComponent
} from "../../envirotrack/report/envirotrack-report-pie/envirotrack-small-pie-chart/envirotrack-small-pie-chart.component";
import {GlobalService} from "../../../_services/global.service";
import {StorageService} from "../../../_services/storage.service";
import {NgIf} from "@angular/common";
import {EnvirotrackService} from "../../envirotrack/envirotrack.service";
import {StatContainersTplComponent} from "../stat-containers-tpl/stat-containers-tpl.component";

@Component({
  selector: 'app-dasboard-widgets',
  standalone: true,
  imports: [
    EnvirotrackBarSmallComponent,
    EnvirotrackSmallPieChartComponent,
    NgIf,
    StatContainersTplComponent
  ],
  templateUrl: './dasboard-widgets.component.html',
  styleUrl: './dasboard-widgets.component.scss'
})
export class DasboardWidgetsComponent implements OnInit {
  // role: string | null = ''

  constructor(private global: GlobalService, private storage: StorageService,private track: EnvirotrackService) {

  }
  ngOnInit(){}
}
