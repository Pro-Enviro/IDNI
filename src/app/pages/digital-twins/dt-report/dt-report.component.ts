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

import {mergeDuplicateSolutions} from "./mergeDuplicateSolutions";
import moment from "moment/moment";


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

  // Charts
  chartOptionsCarbon: any;
  chartOptionsEnergy: any;
  chartOptionsCost: any;
  chartX: any;
  chartData: any;


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


    const mergedRecommendations = mergeDuplicateSolutions(this.availableRecommendations)
    this.availableRecommendations = mergedRecommendations


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


    const mergedDigitalTwinData = mergeDuplicateSolutions(this.availableDigitalTwinData, 'digitalTwin')
    this.availableDigitalTwinData = mergedDigitalTwinData


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

    this.dt.getPETCostingData(matchedCompanyIds).subscribe({
      next: (res: any) => {
        this.addPETCostToTotal(res)
      }
    })

    this.generateCharts()
  }

  addPETCostToTotal = (petData: any[]) => {

    petData.forEach((fuelType: any) => {
      const cost = fuelType.cost;


      const findOtherTypes = this.energyData.findIndex((f: any) => f.customConversionFactor === fuelType.name);

      // If the PET has data and energyData does not, take that. Otherwise take the highest number
      if (findOtherTypes !== -1) {
        if (this.energyData[findOtherTypes].name === 'Electricity HH') {
          this.energyData[findOtherTypes].totalCost += Number(cost);
        } else if (this.energyData[findOtherTypes].totalCost === 0) {
          this.energyData[findOtherTypes].totalCost = Number(cost);
        } else if (this.energyData[findOtherTypes].totalCost <= Number(cost)) {
          this.energyData[findOtherTypes].totalCost = Number(cost);
        }
      } else {

        if (cost === 0) return;

        const newType = {
          type: fuelType.type,
          customConversionFactor: fuelType.type,
          totalValue: fuelType.totalUnits,
          totalCost: cost,
          emissions: fuelType.co2e,
          unit: fuelType.unitsUom,
        };

        this.energyData.push(newType);
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

    this.generateCharts()
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
    this.generateCharts()
  }

  removeDigitalTwinReco(reco: any) {
    const index = this.findIndex(reco, this.appliedDigitalTwinData)
    if (index !== -1) {
      const [removedReco] = this.appliedDigitalTwinData.splice(index, 1);
      this.availableDigitalTwinData.push(removedReco);
    }
    this.generateCharts()
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


  generateCharts() {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];


    // Generate Carbon Chart settings
    const initialCO2 = this.getTotalCO2e();
    const maxHeightCO2 = Math.ceil(initialCO2 * 1.1);
    const minHeightCO2 = Math.floor(initialCO2 * 0.5);

    // Generate Energy Chart settings
    const initialEnergy = this.getTotalEnergy();
    const maxHeightEnergy = Math.ceil(initialEnergy * 1.1);
    const minHeightEnergy = Math.floor(initialEnergy * 0.5);

    // Generate Cost Chart settings
    const initialCost = this.getTotalCost();
    const maxHeightCost = Math.ceil(initialCost * 1.1);
    const minHeightCost = Math.floor(initialCost * 0.5);


    // Calculate baseline projections with 5.35% reduction per year
    const baselineProjectionCO2 = years.map((_, index) => initialCO2 * Math.pow((1 - 0.0535), index));
    const baselineProjectionEnergy = years.map((_, index) => initialEnergy);
    const baselineProjectionCost = years.map((_, index) => initialCost);

    const allAppliedRecommendations = [...this.appliedRecommendations, ...this.appliedDigitalTwinData];

    let cumulativeSavingsCO2 = 0;
    let cumulativeSavingsEnergy = 0;
    let cumulativeSavingsCost = 0;


    // Calculate recommendation lines based on each recommendations saving, cost, co2 etc.
    const withRecommendationsLineCO2 = years.map((_, index) => {
      if (index > 0 && index <= allAppliedRecommendations.length) {
        cumulativeSavingsCO2 += allAppliedRecommendations[index - 1].estimatedCarbonSaving;
      }
      return baselineProjectionCO2[index] - cumulativeSavingsCO2;
    });

    const withRecommendationsLineEnergy = years.map((_, index) => {
      if (index > 0 && index <= allAppliedRecommendations.length) {
        cumulativeSavingsEnergy += allAppliedRecommendations[index - 1].estimatedEnergySaving || 0;
      }
      return baselineProjectionEnergy[index] - cumulativeSavingsEnergy;
    });

    const withRecommendationsLineCost = years.map((_, index) => {
      if (index > 0 && index <= allAppliedRecommendations.length) {
        cumulativeSavingsCost += allAppliedRecommendations[index - 1].estimatedSaving || 0;
      }
      return baselineProjectionCost[index] - cumulativeSavingsCost;
    });


    // Generate bars data
    const generateBarsData = (lineData: number[]) => {
      return years.map((_, yearIndex) => {
        const recommendation = allAppliedRecommendations[yearIndex];
        if (recommendation) {
          return {
            value: lineData[yearIndex],
            name: recommendation.recommendation || recommendation.solutionText || 'Unnamed Recommendation'
          };
        }
        return null;
      });
    };

    const barSeriesTemplate = (barsData: any[]) => [{
      type: 'bar',
      barWidth: '70%',
      color: 'rgba(204,204,204,0.74)',
      data: barsData.map(data => ({
        value: data?.value || 0,
        name: data?.name || '',
        label: {
          show: !!data,
          position: 'inside',
          fontSize: 8,
          fontWeight: 'bold',
          color: '#000',
          align: 'center',
          verticalAlign: 'middle',
          formatter: function (params: any) {
            return params.data.name;
          }
        }
      })),
      name: 'Recommendations'
    }];

    const createChartOptions = (title: string, baselineProjection: number[], withRecommendationsLine: number[],
                                minHeight: number, maxHeight: number, yAxisName: string, tooltipUnit: string, caption: string) => ({
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {type: 'cross'},
        formatter: (params: any) => {
          let tooltip = `Year: ${params[0].name}<br/>`;
          params.forEach((param: any) => {
            if (param.seriesType === 'line') {
              tooltip += `${param.seriesName}: ${Math.round(param.value).toLocaleString()} ${tooltipUnit}<br/>`;
            } else if (param.value > 0) {
              tooltip += `${param.seriesName}: ${Math.round(param.value).toLocaleString()} ${tooltipUnit}<br/>`;
            }
          });
          return tooltip;
        }
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true
          }
        }
      },
      legend: {
        data: ['No Action', 'Cluster Action', ...this.appliedRecommendations.map(r => r.recommendation)],
        top: 30
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years,
        axisTick: {alignWithLabel: true},
        axisPointer: {type: 'shadow'},
        name: 'Year',
        nameLocation: 'middle',
        nameGap: 60,
      },
      yAxis: {
        type: 'value',
        min: minHeight,
        max: maxHeight,
        name: yAxisName,
        nameLocation: 'middle',
        nameGap: 80,
        axisLabel: {
          formatter: (value: number) => Math.round(value).toLocaleString()
        }
      },
      series: [
        {
          name: 'No Action',
          type: 'line',
          data: baselineProjection,
          lineStyle: {type: 'dashed', width: 2},
          color: '#ff7043',
          symbol: 'circle',
          symbolSize: 8,
          z: 2,
          showSymbol: true
        },
        {
          name: 'Cluster Action',
          type: 'line',
          data: withRecommendationsLine,
          lineStyle: {width: 2},
          color: '#2e7d32',
          symbol: 'circle',
          symbolSize: 8,
          z: 2,
          showSymbol: true
        },
        ...barSeriesTemplate(generateBarsData(withRecommendationsLine))
      ],
      graphic: caption ? [
        {
          type: 'text',
          left: 'center',
          bottom: '0%',
          style: {
            text: caption,
            fontSize: 12,
            fill: '#666',
            width: '80%',
            overflow: 'break'
          }
        }
      ] : undefined
    });

    const carbonCaption = "No action scenario assumes 5.35% reduction in grid carbon intensity (mean average for previous 5 years).\n" +
      "A carbon conversion factor of 0.2499 kgCO2e/kWh electricity including transmission & distribution, UK greenhouse gas reporting";
    const energyCaption = "No action scenario assumes constant energy consumption. "
    const costCaption = "Both scenarios assume constant energy price."


    this.chartOptionsCarbon = createChartOptions(
      `${this.selectedCluster.name} Cluster Annual Carbon Footprint`,
      baselineProjectionCO2,
      withRecommendationsLineCO2,
      minHeightCO2,
      maxHeightCO2,
      'Tonnes of CO2 equivalent per annum',
      'tCO2e',
      carbonCaption
    );

    this.chartOptionsEnergy = createChartOptions(
      `${this.selectedCluster.name} Cluster Annual Energy Consumption`,
      baselineProjectionEnergy,
      withRecommendationsLineEnergy,
      minHeightEnergy,
      maxHeightEnergy,
      'kWh of energy consumption per annum',
      'kWh',
      energyCaption
    );

    this.chartOptionsCost = createChartOptions(
      `${this.selectedCluster.name} Cluster Annual Energy Cost`,
      baselineProjectionCost,
      withRecommendationsLineCost,
      minHeightCost,
      maxHeightCost,
      'Cost (£) of energy consumption per annum',
      '£',
      costCaption
    );

  }
}
