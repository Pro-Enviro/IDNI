import {Component, OnInit} from '@angular/core';
import {GlobalService} from "../../../_services/global.service";
import {Recommendations} from "./recommendations";
import {MessageService} from "primeng/api";
import _ from 'lodash';
import moment from "moment";
import {SharedComponents} from "../../envirotrack/shared-components";
import {SharedModules} from "../../../shared-module";
import {DialogModule} from "primeng/dialog";
import {EnvirotrackService} from "../../envirotrack/envirotrack.service";
import {DbService} from "../../../_services/db.service";
import {InputTextareaModule} from "primeng/inputtextarea";
import FileSaver from "file-saver";



@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
  standalone: true,
  imports: [SharedComponents, SharedModules, DialogModule, InputTextareaModule]
})
export class GenerateReportComponent implements OnInit {
  companies: any;
  selectedCompany: any;
  exportRow :any = [];
  template: any;
  docxInHtml: any;
  modelVisible: boolean = false;
  recommendations: any[] = []
  chartData: any[] = []
  changeOptions: any[] = ['Behavioural', 'Upgrades', 'Changes to existing technology', 'Improvements to building fabric', 'Resource efficiency', 'Other']
  percentOptions: any[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
  isConsultant: boolean = false;
  typeTotals: any[] = []
  strOptions =  {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  };
  noDecimalsString  =  {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }
  oneDecimalString = {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }
  totalConsumption: any = 0;
  totalCost: number = 0 ;
  totalEmissions: number = 0;
  fuels: any = [];
  exportColumns: any[] = [];
  scopeTable: any[] = []


  cols = [
    {
      field: 'Utility',
      header: 'Utility'
    },
    {
      field: 'Consumption (kWh)',
      header: 'Consumption (kWh)'
    },
    {
      field: 'Consumption %',
      header: 'Consumption %'
    },
    {
      field: 'Cost £',
      header: 'Cost £'
    },
    {
      field: 'Cost %',
      header: 'Cost %'
    },
    {
      field: 'Carbon Emissions CO2e (tonnes)',
      header: 'Carbon Emissions CO2e (tonnes)'
    },
    {
      field: 'Carbon Emissions %',
      header: 'Carbon Emissions %'
    }

  ]


  conversionFactors: any = {
    'Electricity': 0.22499,
    'Gas': 0.18293,
    'Burning oil (Kerosene)': 0.24677,
    'Diesel (avg biofuel blend)': 0.23908,
    'Petrol (avg biofuel blend)': 0.22166,
    "Gas oil (Red diesel)": 0.25650,
    'LPG': 0.21449,
    'Propane': 0.21410,
    'Butane': 0.22241,
    'Biogas': 0.00022,
    'Biomethane (compressed)': 0.00038,
    'Wood Chips': 0.01074
  }
   totalCo2e: any;
    envirotrackData: any;


  constructor(
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService,
    private db: DbService,
  ) {

  }

  getTotal = (propertyToTotal: string) => {
    return this.recommendations.map((rec: any) => !isNaN(rec[propertyToTotal]) ? parseFloat(rec[propertyToTotal]) : 0)
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0)
  }
  addNewRecommendation = (assessment?: any, answerField?: any) => {
    let recommendation = new Recommendations()
    recommendation.recommendationId = this.recommendations.length >= 1 ? this.recommendations.length + 1 : 1;

    if (assessment) {
      recommendation.recommendation = assessment.question
    } else {
      recommendation.recommendation = `New Recommendation`
    }

    this.recommendations.push(recommendation)
  }

  sortRecommendations = () => {
    this.recommendations = this.recommendations.sort((a: any, b: any) => a.paybackPeriod - b.paybackPeriod)

    // Recommendation 1, 2, 3 etc reordered
    this.recommendations.map((reco: any, index: number) => {
      reco.recommendationId = index + 1;
      return reco;
    })
  }
  deleteRecommendation = (deletedRec: Recommendations) => {
    this.recommendations = this.recommendations.filter((rec: any) => rec.recommendationId !== deletedRec.recommendationId)
  }

  getCompanies = () => {
    this.global.getCurrentUser().subscribe({
      next: (res: any) => {
        if (res.role.name === 'user') {
          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = res.data[0].id
                this.onSelectCompany()
              }
            }
          })
        } else if (res.role.name === 'consultant'){

          this.track.getUsersCompany(res.email).subscribe({
            next: (res: any) => {
              if (res.data) {
                this.companies = res.data
                this.selectedCompany = this.companies[0].id
                this.isConsultant = true
                this.onSelectCompany()
              }
            }
          })

        } else {
          this.track.getCompanies().subscribe({
            next: (res: any) => {
              this.companies = res.data;
              this.isConsultant = true

            }
          })
        }

      }
    })
  }
  onSelectCompany = () => {
    this.recommendations = []
    this.typeTotals = []
    this.scopeTable = []
    this.totalConsumption = []

    this.track.updateSelectedCompany(this.selectedCompany)
    this.getReportValues(this.selectedCompany)
    this.getFuelData()
  }



  getReportValues = (selectedCompany: number) => {
    if (!selectedCompany) return;
    this.db.getRecommendations(selectedCompany).subscribe({
      next: (res: any) => {
        if (res?.data?.recommendations) {
          const parsed = JSON.parse(res.data.recommendations);
          this.recommendations = parsed.recommendations
        }
      },
      error: (error: any) => console.log(error),

    })
  }

  getFuelData = () => {
    this.fuels = []


    if (this.selectedCompany) {


      this.track.getFuelData(this.selectedCompany).subscribe({
        next: (res: any) => {

          if (res?.data?.fuel_data) {
            this.fuels = JSON.parse(res.data?.fuel_data)
          }
        },
        error: (err) => console.log(err),
        complete: () =>  this.assignFuelDataToCorrectCost()
      })
    }
  }

  assignFuelDataToCorrectCost = () => {
    if (!this.fuels.length) return;
    // loop through fuel types and just get total of all values/units/ total cost/

    let extractedData = this.fuels.map((fuel: any) => {

      let totalValue = 0
      let totalCost = 0
      let unit: string = ''

      fuel.rows.forEach((row: any) => {
        const findValue = row.findIndex((cell: any) => cell.name === 'Value')
        const findUnit = row.findIndex((cell: any) => cell.name === 'Unit')
        const findCost = row.findIndex((cell: any) => cell.name === 'Total')

        // Check if not available
        if (findValue !== -1) totalValue += parseFloat(row[findValue].value)
        if (findCost !== -1) totalCost += parseFloat(row[findCost].value)
        if (findUnit !== -1) unit = row[findUnit].value
      })


      return {
        type: fuel.type,
        consumption: totalValue,
        cost: totalCost,
        emissions: (totalValue * this.conversionFactors[fuel.type] || 0),
        conversionFactor: this.conversionFactors[fuel.type] ? this.conversionFactors[fuel.type] : 0,
        unit: unit ? unit : 'kWh'
      }
    })

    this.typeTotals = extractedData
    this.scopeTable = [...extractedData]

    this.getData(this.selectedCompany)


  }

  getData = (id: number) => {
    if(!id){
      return
    }
    this.track.getData(id).subscribe({
        next: (res) => {
          if (res){
            let grandTotal = 0;
            res.forEach((row: any) => {
              row.hhd = JSON.parse(row.hhd.replaceAll('"','').replaceAll("'",'')).map((x:number) => x ? x : 0)
              // Sort the envirotrack data
              grandTotal += row.hhd.reduce((acc: number, curr: number) => acc + curr, 0)
            })
            this.envirotrackData = {
              type: 'Electricity',
              consumption:( grandTotal/1000).toFixed(2),
              cost: 0,
              emissions: (grandTotal * 0.22499) / 1000
            }
            this.scopeTable.push(this.envirotrackData)
            this.typeTotals.push(this.envirotrackData)

          }
        },
        complete: () => {
          this.calculateScopeTable()
          this.recalculateTotals()
        }
      }
    )
  }



  createReportObject = (save?: string) => {
    // Filter out empty recommendations
    let filteredRecommendations: Recommendations[] =
      this.recommendations.filter((rec: Recommendations) => rec.recommendation.length)

    // Calculate Recommendation totals table
    const recoTotals: any = {
      totalEnergySaving: 0,
      totalSaving: 0,
      totalCost: 0,
      totalCarbon: 0
    }

    this.recommendations.forEach((rec: Recommendations, index: number) => {
      recoTotals.totalEnergySaving += Number(rec.estimatedEnergySaving)
      recoTotals.totalSaving += Number(rec.estimatedSaving)
      recoTotals.totalCost += Number(rec.estimatedCost)
      recoTotals.totalCarbon += Number(rec.estimatedCarbonSaving)
    })

    const strOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }

    let commaOnLargeNumbers: any;


    // This is to format the text for the report, without replacing the object on the page (Causes issues when saving)
    const recoTotalsCopy = _.cloneDeep(recoTotals)


    // Generating the Word Report
    if (!save) {

      commaOnLargeNumbers = {
        totalEnergySaving: recoTotalsCopy.totalEnergySaving ? recoTotalsCopy.totalEnergySaving.toLocaleString('en-US', strOptions) : 0,
        totalSaving: recoTotalsCopy.totalSaving.toLocaleString('en-US', strOptions),
        totalCost: recoTotalsCopy.totalCost.toLocaleString('en-US', strOptions),
        totalCarbon: recoTotalsCopy.totalCarbon.toLocaleString('en-US', strOptions)
      }

      // Add locale string to recommendations
      filteredRecommendations = filteredRecommendations.map((recommendation: Recommendations) => {
        recommendation.estimatedCarbonSaving = recommendation.estimatedCarbonSaving.toLocaleString('en-US', strOptions)
        recommendation.estimatedCost = recommendation.estimatedCost.toLocaleString('en-US', strOptions)
        recommendation.estimatedEnergySaving = recommendation.estimatedEnergySaving.toLocaleString('en-US', strOptions)
        recommendation.estimatedSaving = recommendation.estimatedSaving.toLocaleString('en-US', strOptions)
        return recommendation
      })
    }


    const report: any = {

      recommendations: filteredRecommendations.sort((a: any, b: any) => a.paybackPeriod - b.paybackPeriod),
      totals: !save ? recoTotals : commaOnLargeNumbers,
    }

    return report;
  }


  recommendationCols = [
    { field: 'number', header: 'No.'},
    { field: 'recommendation', header: 'Recommendation' },
    { field: 'type_of_change', header: 'Type of Change' },
    { field: 'estimated_annual_energy_saving', header: 'Estimated Annual Energy Saving (kWh/yr)' },
    { field: 'estimated_annual_saving', header: 'Estimated Annual saving (£ exc VAT/yr)' },
    { field: 'estimated_cost_to_implement', header: 'Estimated cost to implement (£ excl. VAT)' },
    { field: 'payback_period', header: 'Payback Period' },
    { field: 'estimated_annual_carbon_saving ', header: 'Estimated Annual carbon saving (tCo2e/yr)' },
    { field: 'margin_of_error', header: 'Margin Of Error (%)' },
    { field: 'total_energy_saving', header: 'Total Annual energy saving (kWh/yr)' },
    {field:  'total_annual_saving', header:'Total Annual Saving (£ exc VAT/yr)' },
    {field:  'total_est_cost', header:'Total Estimated Cost' },
    {field: 'total_carbon_saving', header: 'Total Carbon saving' },

  ]


  exportExcel = () => {
    let totalEstimatedEnergySaving = this.recommendations.reduce((total, row) => {
      return total + row.estimatedEnergySaving;
    }, 0);

    let totalAnnualSaving = this.recommendations.reduce((total, row) => {
      return total + row.estimatedSaving;
    }, 0);

    let totalEstimatedCost = this.recommendations.reduce((total, row) => {
      return total + row.estimatedCost;
    },0)

    let totalCarbonSaving = this.recommendations.reduce((total,row) => {
      return total + row.estimatedCarbonSaving;
    },0)

    const headers = this.recommendationCols.map(col => col.header);


    let array = this.recommendations.map((row,index) => {
      return {
        'No.': index+1,
        'Recommendation': row.recommendation,
        'Type of Change': row.changeType,
        'Estimated Annual Energy Saving (kWh/yr)': row.estimatedEnergySaving,
        'Estimated Annual saving (£ exc VAT/yr)': row.estimatedSaving,
        'Estimated cost to implement (£ excl. VAT)': row.estimatedCost,
        'Payback Period': row.paybackPeriod,
        'Estimated Annual carbon saving (tCo2e/yr)': row.estimatedCarbonSaving,
        'Margin Of Error (%)': row.marginOfErrorSavings,
      }
    });

    let totalsRow:any = {
      'No.': '',
      'Recommendation': 'Total',
      'Type of Change': '',
      'Estimated Annual Energy Saving (kWh/yr)': totalEstimatedEnergySaving,
      'Estimated Annual saving (£ exc VAT/yr)': totalAnnualSaving,
      'Estimated cost to implement (£ excl. VAT)': totalEstimatedCost,
      'Payback Period': '',
      'Estimated Annual carbon saving (tCo2e/yr)': totalCarbonSaving,
      'Margin Of Error (%)': '',
    };

    array.push(totalsRow);


    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(array);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `Recommendation Summary ${moment(new Date()).format('DD-MM-YYYY')}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }



  saveForm = () => {
    const report = this.createReportObject('save')

    this.db.saveRecommendations(this.selectedCompany, {'recommendations': JSON.stringify(report)})
      .subscribe({
      next: (res: any) => {
        return this.msg.add({
          severity: 'success',
          detail: 'Report saved'
        })
      },
      error: (error: any) => console.log(error),
    })
  }

  recalculateTotals = () => {
    this.totalCost = this.typeTotals.reduce((acc: any, curr: any) => acc + curr.cost, 0)
    this.totalConsumption = this.typeTotals.reduce((acc: any, curr: any) => acc + curr.consumption, 0)
    this.totalEmissions = (this.typeTotals.reduce((acc: any, curr: any) => acc + curr.emissions, 0)) / 1000

    this.totalConsumption = parseFloat(this.totalConsumption).toLocaleString('en-US', this.noDecimalsString)
  }

  calculateConsumptionPercent = (typeTotal: any) => {
    typeTotal.consumption = Number(typeTotal.consumption)
    const percent:number = (parseFloat(typeTotal.consumption) / parseFloat(this.totalConsumption)) * 100
    return percent.toFixed(1)
  }

  calculateCostPercent = (typeTotal: any) => {
    if (typeTotal.cost === 0 || isNaN(typeTotal.cost)) return 0

    const percent = (parseFloat(typeTotal.cost) / this.totalCost) * 100
    return percent.toFixed(1)
  }

  calculateEmissions = (typeTotal: any) => {

    if (typeTotal.type === 'Electricity') {
      typeTotal.conversionFactor = 0.22499
    }

    const data = (parseFloat(typeTotal.consumption) * parseFloat(typeTotal.conversionFactor)) / 1000

    let strOptions = this.strOptions

    // To handle small amounts
    if (data < 0.001) strOptions = {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }

    return data.toLocaleString('en-US', strOptions)
  }

  calculateEmissionsPercent = (typeTotal: any) => {
    const percent = ((typeTotal.emissions / 1000) / this.totalEmissions) * 100
    return percent.toFixed(1)
  }

  exportExcelForBreakdownTable = () => {

    let array = this.typeTotals.map(row => {
      return {
        'Utility': row.type,
        'Consumption (kWh)': row.consumption,
        'Consumption %': this.calculateConsumptionPercent(row),
        'Cost £': row.cost,
        'Cost %': this.calculateCostPercent(row),
        'Carbon Emissions Co2e (tonnes)': row.emissions / 1000,
        'Carbon Emissions %': this.calculateEmissionsPercent(row),
      }
    });

    let totalsRow = {
      'Utility': 'Total',
      'Consumption (kWh)': this.totalConsumption,
      'Consumption %': '',
      'Cost £': this.totalCost,
      'Cost %': '',
      'Carbon Emissions Co2e (tonnes)': this.totalEmissions,
      'Carbon Emissions %': ''
    };


    array.push(totalsRow);


    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(array);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, `Breakdown of Energy Costs ${moment(new Date()).format('DD-MM-YYYY')}`);
    });
  }


  calculateScopeTable = () => {
    const conversionFactors: { [key: string]: number } = {
      'Electricity': 0.22499,
      'Natural Gas (Grid)': 0.18293,
      'Kerosene': 0.24677,
      'Diesel (avg biofuel blend)': 0.23908,
      'Petrol (avg biofuel blend)': 0.22166,
      "Gas oil (Red diesel)": 0.25650,
      'LPG': 0.21449,
      'Propane': 0.21410,
      'Butane': 0.22241,
      'Biogas': 0.00022,
      'Biomethane (compressed)': 0.00038,
      'Wood Chips': 0.01074,
      'Natural Gas off Grid': 0.03021,
      'Bio Gas Off Grid':   0.00020,
      'Oil': 0.24557, //burning oil
      'Bio fuels': 0.03558, //biodiesel
      'Bio Mass': 0.01074,
      'Coal for Industrial use': 0.05629,
    }



    this.scopeTable = this.scopeTable.map((fuelType: any) => {
      fuelType.scope = fuelType.type === 'Electricity' ? 'Scope 2' : 'Scope 1'

      const selectedConversionFactor = conversionFactors[fuelType.type] ? conversionFactors[fuelType.type] : 0
      const calculatedCO2e = (fuelType.consumption * selectedConversionFactor) / 1000
      fuelType.co2e = Number(calculatedCO2e)

      return fuelType
    })


    // Update Co2e totals
    this.totalCo2e = this.typeTotals.reduce((acc: any, curr: any) => {
      if (curr.co2e > 0 ){
        return acc + curr.co2e
      }
      return acc;
    }, 0)

    this.typeTotals.sort((a: any, b: any) => b.consumption - a.consumption)
    this.scopeTable.sort((a: any, b: any) => b.co2e - a.co2e)
  }

  calculateCo2ePercent(typeTotal: any) {
    const calculatedPercent = ( typeTotal.co2e / this.totalCo2e) * 100
    if (calculatedPercent > 0 ) {
      return calculatedPercent.toFixed(2);
    }

    return 0;
  }





  ngOnInit(): void {
    this.getCompanies();
    this.getFuelData()

  }


}





