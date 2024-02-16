import { Component, OnInit} from '@angular/core';

import {MenuItem} from "primeng/api";
import {EnvirotrackService} from "../../envirotrack.service";
import {SharedComponents} from "../../shared-components";

@Component({
  selector: 'app-envirotrack-report',
  standalone: true,
  templateUrl: './envirotrack-report.component.html',
  imports: [
    SharedComponents
  ],
  styleUrls: ['./envirotrack-report.component.scss']

})
export class EnvirotrackReportComponent implements OnInit{

  hhdVisible: boolean = false; // TODO

  items: MenuItem [] = [{
    label:'<span class="material-symbols-outlined material-icon">assessment</span> Electricity consumption, kWh per half-hour',
    escape: false,
    routerLink: 'heatmap',
    // visible: this.hhdVisible
  },{
    label:'<span class="material-symbols-outlined material-icon">scatter_plot</span> Electricity consumption, kWh split by day of the week',
    escape: false,
    routerLink: 'scatter',
  },{
    label:'<span class="material-symbols-outlined material-icon">bar_chart</span> Electricity consumption, kWh',
    escape: false,
    routerLink: 'bar',
  },{
    label:'<span class="material-symbols-outlined material-icon">pie_chart</span> Electricity Consumption, % split by day of the week',
    escape: false,
    routerLink: 'pie'
  },{
    label:'<span class="material-symbols-outlined material-icon">show_chart</span> Christmas Day vs lowest day of the year consumption',
    escape: false,
    routerLink: 'base1'
  },{
    label:'<span class="material-symbols-outlined material-icon">stacked_line_chart</span> Average daily consumption, kWh per half hour',
    escape: false,
    routerLink: 'avg',
    // visible: this.hhdVisible
  },{
    label:'<span class="material-symbols-outlined material-icon">data_exploration</span> Maximum Demand',
    escape: false,
    routerLink: 'demand'
  },
    // {
    //   label:'<span class="material-symbols-outlined material-icon">bar_chart</span> Fuel Usage',
    //   escape: false,
    //   routerLink: 'fieldspertype'
    // }
  ];

  constructor(private track: EnvirotrackService) {
    this.getCompanies()
  }


  getCompanies = () =>{
    // this.track.getCompanies().subscribe({
    //   next: (res)=>{
    //     let selectedCompany = res[0].id
    //     this.getData(selectedCompany)
    //   }
    // })
  }

  getData = (id: number) => {
    this.track.getData(id).subscribe({
          next: (res) => {
            if (res.length || res[0]?.hdd) {
              this.hhdVisible = true
            }
          }
        }
    )
  }

  ngOnInit() {
  }
}
