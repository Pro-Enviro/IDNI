import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {PickListModule} from "primeng/picklist";
import {SharedModule} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {ClusterObject, DtService} from "../../../_services/dt.service";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {SharedModules} from "../../../shared-module";
import {SharedComponents} from "../../envirotrack/shared-components";
import {DropdownChangeEvent} from "primeng/dropdown";
import {CarouselModule} from "primeng/carousel";

@Component({
  selector: 'app-dt-report',
  standalone: true,
  imports: [
    PickListModule,
    SharedModule,
    PanelModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    SharedModules,
    SharedComponents,
    CarouselModule
  ],
  templateUrl: './dt-report.component.html',
  styleUrl: './dt-report.component.scss'
})
export class DtReportComponent {
  companies: any;
  clusters: any;
  clusterCompanies: any[] | undefined;
  filteredClusters: any[] = [] ;
  selectedCluster!: any;
  availableRecommendations: any[] = [];
  selectedRecommendation: any | null = null;
  appliedRecommendations: any[] = [];

  constructor(private dt: DtService) {
    this.dt.companies.subscribe({
      next: (res: any) => this.companies = res
    })
    this.dt.clusters.subscribe({
      next: (cluster) => this.clusters = cluster
    })


  }


  onSelect = (event: AutoCompleteCompleteEvent) => {

    this.filteredClusters = this.clusters.filter(
      (cluster: ClusterObject) => cluster.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }


  onClusterSelect = (event: any) => {
    this.selectedCluster = event.value;
    this.clusterCompanies = event.value.companies || [];

    this.dt.getDigitalTwinData(this.selectedCluster);


    const matchedCompanies = this.companies.filter((company: any) =>
        this.clusterCompanies?.some((clusterCompany: any) => clusterCompany.id === company.id)
    );

    if (this.selectedCluster) {
      this.selectedCluster.companies = matchedCompanies;
    }

    this.availableRecommendations = matchedCompanies
        .flatMap((company: any) => company.recommendations || [])
        .flatMap((recommendationObj: any) => recommendationObj.recommendations || []);

  }

  onRecommendationSelect(event: DropdownChangeEvent) {
    this.selectedRecommendation = event.value;
  }

  applyRecommendation(recommendation: any) {
    if (!this.isRecommendationApplied(recommendation)) {
      this.appliedRecommendations.push(recommendation);
    }
  }


  getTargetHeader() {
    return undefined;
  }

  calculateImpact(company: any, rec: any, energy: string) {
    return undefined;
  }

  getTotalEnergy() {
    return undefined;
  }

  getTotalCO2e() {
    return undefined;
  }

  getTotalEnergyAfterRecommendation(rec: any) {
    return undefined;
  }

  getTotalCO2eAfterRecommendation(rec: any) {
    return undefined;
  }


  isRecommendationApplied(recommendationId: any) {
    return this.appliedRecommendations.some(rec => rec.id === recommendationId);
  }
}
