import {Component} from '@angular/core';
import {PickListModule} from "primeng/picklist";
import {SharedModule} from "primeng/api";
import {PanelModule} from "primeng/panel";
import {ClusterObject, DtService} from "../../../_services/dt.service";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {SharedModules} from "../../../shared-module";
import {SharedComponents} from "../../envirotrack/shared-components";
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
  totalEnergyUsed: number = 0;
  totalCost: number = 0;
  totalC02Used: number = 0 ;

  constructor(private dt: DtService) {
    this.dt.companies.subscribe({
      next: (res: any) => this.companies = res
    })
    this.dt.clusters.subscribe({
      next: (cluster) => this.clusters = cluster
    })

  }

  // Cluster Selection

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

    this.availableRecommendations = this.availableRecommendations.map((reco: any, index: number) => {
        reco.generated_id = index;
        return reco;
    })

    const energyData = calculateEnergyData(matchedCompanies);
    this.energyData.push(...energyData);

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

  findIndex(recomendation: any) {
    let index = -1;
    for (let i = 0; i < (this.availableRecommendations as any[]).length; i++) {
      if (recomendation.generated_id === (this.availableRecommendations as any[])[i].generated_id) {
        index = i;
        break;
      }
    }
    return index;
  }

  removeRecommendation(reco: any) {
    this.appliedRecommendations = this.appliedRecommendations.filter(rec => rec.generated_id !== reco.generated_id);

    this.availableRecommendations = [...this.availableRecommendations, reco];
  }

  // Calculate Totals

  getTotalEnergy() {
    let total = 0;
    if (this.energyData.length) {
      const totalEnergy = this.energyData.reduce((sum, fuelType) => sum + (fuelType.totalValue || 0), 0);
      this.totalEnergyUsed = totalEnergy;
      return totalEnergy;
    }

    return total;
  }
  getTotalCost() {
    let total =0 ;
    if (this.energyData.length) {
      const totalCost = this.energyData.reduce((sum, fuelType) => sum + (fuelType.totalCost || 0), 0);
      this.totalCost = totalCost;
      return totalCost
    }

  }

  getTotalCO2e() {
    return 0;
  }

  calculateEnergyImpact() {
    const energySavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedEnergySaving, 0);
    return this.totalEnergyUsed - energySavings;
  }

  calculateC02Impact() {
    const co2eSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCarbonSaving, 0);

    return this.totalC02Used - co2eSavings;
  }

  calculateCostImpact() {
    const costSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCost, 0);
    return this.totalCost - costSavings;
  }

  getEnergyDifference() {
      const energySavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedEnergySaving, 0);

    // Calculate percentage change
    const percentageSavings = (energySavings / this.totalEnergyUsed) * 100;

      return `-${percentageSavings.toFixed(1)}%` ;
  }

  getCostDifference() {
    const costSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCost, 0);

    // Calculate percentage change
    const percentageSavings = (costSavings / this.totalCost) * 100;

    return `-${percentageSavings.toFixed(1)}%` ;
  }



}
