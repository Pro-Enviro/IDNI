import { Component } from '@angular/core';
import {Cluster, Companies, DtService} from "../../_services/dt.service";
import {DtClusterComponent} from "./dt-cluster/dt-cluster.component";
import {MessageService} from "primeng/api";
import {DtReportComponent} from "./dt-report/dt-report.component";
import {NgIf} from "@angular/common";



@Component({
  selector: 'app-digital-twins',
  standalone: true,
  imports: [
    DtClusterComponent,
    DtReportComponent,
    NgIf
  ],
  templateUrl: './digital-twins.component.html',
  styleUrl: './digital-twins.component.scss'
})
export class DigitalTwinsComponent {
  companies: Companies[] | undefined
  clusters: any;
  constructor(
    private dt: DtService,
    private msg: MessageService
  ) {
    this.dt.companies.subscribe({
      next: (res: any) => this.companies = res
    })
    this.dt.clusters.subscribe({
      next: (cluster) => this.clusters = cluster
    })
  }

  saveCluster = (cluster: Cluster) => {
    if(!cluster.name){
      this.msg.add({
        severity: 'warn',
        detail: 'Please enter cluster name'
      })
      return;
    }
    this.dt.saveCluster({id: cluster.id, name: cluster.name, companies: cluster.companies.map(({id}) => id)})
  }

}