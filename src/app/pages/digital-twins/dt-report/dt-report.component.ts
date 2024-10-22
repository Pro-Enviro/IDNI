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
import Fuse from "fuse.js";

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
  appliedRecommendations: any[] = [];
  appliedDigitalTwinData: any[] = [];
  energyData: any[] = []
  draggedItem: any;
  totalEnergyUsed: number = 0;
  totalCost: number = 0;
  totalC02Used: number = 0;
  implementationCost: number = 0;

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

  getCompanyName = (companyId: number) => {
    console.log(companyId)
    if (!companyId) return;
    if (!this.clusterCompanies?.length) return;

    const hello = this.clusterCompanies.filter((company: any) => company.id === companyId);
    console.log(hello)
  }

  sumProperties = (item1: any, item2: any) => {
    item1.estimatedEnergySaving += item2.estimatedEnergySaving || 0;
    item1.estimatedCarbonSaving += item2.estimatedCarbonSaving || 0;
    item1.estimatedCost += item2.estimatedCost || 0;
    item1.estimatedSaving += item2.estimatedSaving || 0;
  }

  onClusterSelect = (event: any) => {
    this.availableRecommendations = []
    this.availableDigitalTwinData = []
    this.appliedRecommendations = []
    this.appliedDigitalTwinData = []
    this.totalC02Used = 0;
    this.totalCost = 0;
    this.totalEnergyUsed = 0;
    this.draggedItem = null;
    this.energyData = []


    this.selectedCluster = event.value;
    this.clusterCompanies = event.value.companies || [];


    const matchedCompanies = this.companies.filter((company: any) =>
      this.clusterCompanies?.some((clusterCompany: any) => clusterCompany.id === company.id)
    );

    if (this.selectedCluster) {
      this.selectedCluster.companies = matchedCompanies;
    }

    // Select recommendations for drag and drop
    this.availableRecommendations = matchedCompanies
      .flatMap((company: any) => {
        const obj = {
          recommendations: company.recommendations,
          company: company.name
        }


        return obj;
      })
      .flatMap((recommendationObj: any) => {
        const data = recommendationObj?.recommendations || []

        if (!data.recommendations?.length) return []

        return data.recommendations.map((rec: any) => ({
          ...rec,
          companyName: recommendationObj.company
        }))
      });


    this.availableRecommendations = this.availableRecommendations.map((reco: any, index: number) => {
      reco.generated_id = index;
      return reco;
    })

    // Go through recommendations are collate similar named ones
    const fuseOptions = {
      threshold: 0.3,
      includeScore: true,
      keys: ['recommendation']
    }

    const fuse = new Fuse(this.availableRecommendations, fuseOptions);

    this.availableRecommendations.forEach((reco: any) => {
      const foundDuplicates = fuse.search(reco.recommendation)
        .filter(result => result.item !== reco)
        .map(result => result.item);

      if (foundDuplicates.length > 0) {
        foundDuplicates.forEach(duplicate => {
          this.sumProperties(reco, duplicate);

          // Remove duplicate from recommendations
          const indexToRemove = this.availableRecommendations.indexOf(duplicate);
          if (indexToRemove !== -1) {
            this.availableRecommendations.splice(indexToRemove, 1);
          }

          // Add counter to current Reco
          if (reco.counter) reco.counter++;
          else reco.counter = 1;
        })
      }
    })


    // Select solution recommendations from report page
    this.availableDigitalTwinData = matchedCompanies.flatMap((company: any) => {
      const data = company.digital_twin_data || []

      return data.map((d: any) => ({
        ...d,
        companyName: company.name
      }))

      // return company.digital_twin_data
    })

    // Filter if not text is available
    this.availableDigitalTwinData = this.availableDigitalTwinData.filter((company: any) => company?.solutionText)


    // SOLUTIONS - Commented code will hide similar solutions
    const fuseTwinsOptions = {
      threshold: 0.0,
      includeScore: true,
      keys: ['solutionText']
    }

    const fuseTwins = new Fuse(this.availableDigitalTwinData, fuseTwinsOptions);

    this.availableDigitalTwinData.forEach((reco: any) => {

      const foundDuplicates = fuseTwins.search(reco.solutionText)
        .filter(result => result.item !== reco)
        .map(result => result.item);

      if (foundDuplicates.length > 0) {
        foundDuplicates.forEach(duplicate => {
          // TODO: Sum up
          // this.sumProperties(reco, duplicate);

          // Remove duplicate from recommendations
          const indexToRemove = this.availableDigitalTwinData.indexOf(duplicate);
          if (indexToRemove !== -1) {
            this.availableDigitalTwinData.splice(indexToRemove, 1);
          }

          // Add counter to current Reco
          if (reco.counter) reco.counter++;
          else reco.counter = 1;
        })
      }
    })


    // Get Non-HH energy data
    const energyData = calculateEnergyData(matchedCompanies);
    this.energyData.push(...energyData);

    const matchedCompanyIds = matchedCompanies.map((company: any) => company.id);

    // Get HH energy data
    this.dt.getHHData(matchedCompanyIds).subscribe({
      next: (res: any) => {
        const reducedData = res.reduce((acc: any, curr: any) => {
          const baseType = curr.type.split(' - ')[0]

          return {
            type: baseType,
            totalValue: (acc.totalValue || 0) + curr.consumption,
            totalCost: (acc.totalCost || 0) + curr.cost,
            emissions: (acc.emissions || 0) + curr.emissions,
            unit: baseType === 'Electricity HH' ? 'kWh' : '',
            customConversionFactor: baseType === 'Electricity HH' ? 'Electricity' : '',
          }
        }, {})

        this.energyData.push(reducedData)
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
    } else if (this.draggedItem?.solutionText) {
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
    return total;
  }

  getTotalCO2e() {
    let total = 0;
    if (this.energyData.length) {
      const totalCost = this.energyData.reduce((sum, fuelType) => sum + (fuelType.emissions || 0), 0);
      this.totalC02Used = totalCost;
      return totalCost
    }

    return total;
  }

  getEnergySavingsTotal = () => {
    const energySavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedEnergySaving, 0);
    const energySavingsFromTwin = this.appliedDigitalTwinData.reduce((total, rec) => total + rec.estimatedEnergySaving, 0)

    return energySavings + energySavingsFromTwin
  }

  getEstimatedCostSavings = () => {
    const costSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedSaving, 0);
    const costSavingsFromTwin = this.appliedDigitalTwinData.reduce((total, rec) => total + rec.estimatedSaving, 0)

    return costSavings + costSavingsFromTwin
  }

  getEstimatedCarbonSaving = () => {
    const co2eSavings = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCarbonSaving, 0);
    const co2eSavingsFromTwin = this.appliedDigitalTwinData.reduce((total, rec) => total + rec.estimatedCarbonSaving, 0)
    return co2eSavings + co2eSavingsFromTwin;
  }


  calculateEnergyImpact() {
    if (!this.totalEnergyUsed) return 0
    const energySavings = this.getEnergySavingsTotal()
    return this.totalEnergyUsed - energySavings;
  }

  calculateCostImpact() {
    if (!this.totalCost) return 0
    const costSavings = this.getEstimatedCostSavings()
    return this.totalCost - costSavings;
  }

  calculateC02Impact() {
    if (!this.totalC02Used) return 0
    const costSaving = this.getEstimatedCarbonSaving()
    return this.totalC02Used - costSaving;
  }


  // Percentage Calculations

  getEnergyDifference() {
    if (!this.totalEnergyUsed) return 0

    const energySavings = this.getEnergySavingsTotal()

    // Calculate percentage change
    const percentageSavings = (energySavings / this.totalEnergyUsed) * 100;

    return `-${percentageSavings.toFixed(1)}%`;
  }

  getCostDifference() {
    if (!this.totalCost) return 0;

    const costSavings = this.getEstimatedCostSavings()

    // Calculate percentage change
    const percentageSavings = (costSavings / this.totalCost) * 100;

    return `-${percentageSavings.toFixed(1)}%`;
  }


  getEmissionsDifference() {
    if (!this.totalC02Used) return 0;

    const carbonSavings = this.getEstimatedCarbonSaving()

    // Calculate percentage change
    const percentageSavings = (carbonSavings / this.totalC02Used) * 100;

    return `-${percentageSavings.toFixed(1)}%`;
  }

  calculateImplementationCost() {

    const implementationCost = this.appliedRecommendations.reduce((total, rec) => total + rec.estimatedCost, 0);
    const implementationCostFromTwin = this.appliedDigitalTwinData.reduce((total, rec) => total + rec.estimatedCost, 0)

    return implementationCost + implementationCostFromTwin;
  }


}
