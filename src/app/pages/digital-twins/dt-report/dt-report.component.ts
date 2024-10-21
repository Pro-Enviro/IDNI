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
  availableDigitalTwinData: any[] = []
  selectedRecommendation: any | null = null;
  appliedRecommendations: any[] = [];
  appliedDigitalTwinData: any[] = [];
  energyData: any[] = []
  draggedItem: any;
  totalEnergyUsed: number = 0;
  totalCost: number = 0;
  totalC02Used: number = 0;

  constructor(private dt: DtService) {
    this.dt.companies.subscribe({
      next: (res: any) => this.companies = res
    })
    this.dt.clusters.subscribe({
      next: (cluster) => this.clusters = cluster
    })

    // this.dt.getDigitalTwinData(this.selectedCluster);
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

    const matchedCompanies = this.companies.filter((company: any) =>
      this.clusterCompanies?.some((clusterCompany: any) => clusterCompany.id === company.id)
    );

    if (this.selectedCluster) {
      this.selectedCluster.companies = matchedCompanies;
    }


    console.log(this.selectedCluster)

    this.availableRecommendations = matchedCompanies
      .flatMap((company: any) => company.recommendations || [])
      .flatMap((recommendationObj: any) => recommendationObj.recommendations || []);

    this.availableRecommendations = this.availableRecommendations.map((reco: any, index: number) => {
      reco.generated_id = index;
      return reco;
    })


    this.availableDigitalTwinData = matchedCompanies.flatMap((company: any) => company.digital_twin_data || [])
    const energyData = calculateEnergyData(matchedCompanies);
    this.energyData.push(...energyData);

    const matchedCompanyIds = matchedCompanies.map((company: any) => company.id);

    this.dt.getHHData(matchedCompanyIds).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }


  // Drag functions
  dragStart(recommendation: any) {
    this.draggedItem = recommendation;
  }

  dragEnd() {
    this.draggedItem = null;
  }

  drop() {

    let targetArray = ''
    if (this.draggedItem?.recommendation) {
      targetArray = 'recommendations'
    } else if (this.draggedItem?.type) {
      targetArray = 'digitalTwinData'
    } else {
      return;
    }

    if (this.draggedItem) {
      if (targetArray === 'recommendations' && this.draggedItem) {
        this.dropRecommendation();
      } else if (targetArray === 'digitalTwinData' && this.draggedItem) {
        this.dropDigitalTwinReco();
      }
      this.draggedItem = null;
    }
  }

  dropRecommendation() {
    const index = this.findIndex(this.draggedItem, this.availableRecommendations);
    if (index !== -1) {
      this.appliedRecommendations.push(this.draggedItem);
      this.availableRecommendations.splice(index, 1);
    }
  }

  dropDigitalTwinReco() {
    const index = this.findIndex(this.draggedItem, this.availableDigitalTwinData);
    if (index !== -1) {
      this.appliedDigitalTwinData.push(this.draggedItem);
      this.availableDigitalTwinData.splice(index, 1);
      console.log(this.appliedDigitalTwinData)
    }
  }

  findIndex(item: any, array: any[]) {
    return array.findIndex(arrayItem =>
      ('generated_id' in item && item.generated_id === arrayItem.generated_id) ||
      ('generatedId' in item && item.generatedId === arrayItem.generatedId)
    );
  }

  removeItem(item: any, targetArray: 'recommendations' | 'digitalTwinData') {
    if (targetArray === 'recommendations') {
      this.removeRecommendation(item);
    } else if (targetArray === 'digitalTwinData') {
      this.removeDigitalTwinReco(item);
    }
  }

  removeRecommendation(reco: any) {
      const index = this.findIndex(reco, this.appliedRecommendations);
      if (index !== -1) {
        const [removedReco] = this.appliedRecommendations.splice(index, 1);
        this.availableRecommendations.push(removedReco);
      }
  }

  removeDigitalTwinReco(reco: any) {
    const index = this.findIndex(reco, this.appliedDigitalTwinData)
    if (index !== -1) {
      const [removedReco] = this.appliedDigitalTwinData.splice(index, 1);
      this.availableDigitalTwinData.push(removedReco);
    }
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
    let total = 0;
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

    return `-${percentageSavings.toFixed(1)}%`;
  }

  getCostDifference() {
    const costSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCost, 0);

    // Calculate percentage change
    const percentageSavings = (costSavings / this.totalCost) * 100;

    return `-${percentageSavings.toFixed(1)}%`;
  }


  getEmissionsDifference() {
    return 0;
  }
}
