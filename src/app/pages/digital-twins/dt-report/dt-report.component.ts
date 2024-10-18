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
import {calculateEnergyData} from "./calculateEnergyData";

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
  filteredClusters: any[] = [];
  selectedCluster!: any;
  availableRecommendations: any[] = [];
  selectedRecommendation: any | null = null;
  appliedRecommendations: any[] = [];
  energyData: any[] = []
  draggedRecommendation: any;

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

    const energyData = calculateEnergyData(matchedCompanies);
    this.energyData.push(...energyData);

  }

  getClusterEnergyData = () => {

  }

  onRecommendationSelect(event: DropdownChangeEvent) {
    this.selectedRecommendation = event.value;
  }

  applyRecommendation(recommendation: any) {
    if (!this.isRecommendationApplied(recommendation)) {
      this.appliedRecommendations.push(recommendation);
    }
  }


  getTotalEnergy() {
    let total = 0;
    if (this.energyData.length) {
      const totalEnergy = this.energyData.reduce((sum, fuelType) => sum + (fuelType.totalValue || 0), 0);
      return totalEnergy;
    }

    return total;
  }

  getTotalCO2e() {
    return undefined;
  }

  isRecommendationApplied(recommendationId: any) {
    return this.appliedRecommendations.some(rec => rec.id === recommendationId);
  }


  // Drag functions
  dragStart(recommendation: any) {
    this.draggedRecommendation = recommendation;
  }

  dragEnd() {
    this.draggedRecommendation = null;
  }

  drop() {
    if (this.draggedRecommendation) {
      let draggedRecommendationIndex = this.findIndex(this.draggedRecommendation);
      this.appliedRecommendations = [...(this.appliedRecommendations as any[]), this.draggedRecommendation];
      this.availableRecommendations = this.availableRecommendations?.filter((val, i) => i != draggedRecommendationIndex);
      this.draggedRecommendation = null;
    }
  }

  findIndex(product: any) {
    let index = -1;
    for (let i = 0; i < (this.availableRecommendations as any[]).length; i++) {
      if (product.id === (this.availableRecommendations as any[])[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }
}
