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

@Component({
  selector: 'app-dasboard-widgets',
  standalone: true,
  imports: [
    EnvirotrackBarSmallComponent,
    EnvirotrackSmallPieChartComponent,
    NgIf
  ],
  templateUrl: './dasboard-widgets.component.html',
  styleUrl: './dasboard-widgets.component.scss'
})
export class DasboardWidgetsComponent implements OnInit {
  role: string | null = ''

  constructor(private global: GlobalService, private storage: StorageService,private track: EnvirotrackService) {
    // this.global.getCurrentUser().subscribe({
    //   next: (res: any) => {
    //     if (res.role.name === 'user'){
    //       this.track.getUsersCompany(res.email).subscribe({
    //         next: (res: any) => {
    //           if (res.data){
    //             this.companies = res.data
    //           }
    //         }
    //       })
    //     } else {
    //       this.track.getCompanies().subscribe({
    //         next:(res: any) => {
    //           this.companies = res.data;
    //         }
    //       })
    //     }
    //
    //   }
    // })
  }
  ngOnInit(){
    this.role = this.global.role.value || this.storage.get('_rle')
  }


}
