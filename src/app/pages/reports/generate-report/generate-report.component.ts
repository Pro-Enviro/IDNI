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
import {UnitsUom} from "../../pet-login-protected/pet-tool-types";


export interface DigitalTwinRows {
  id?: number
  generatedId: string
  company: number
  type?: string
  unit?: string
  total?: number
  deficit?: boolean
  solution?: boolean
  solutionText?: string
}

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
  changeOptions: any[] = ['Behavioural', 'Upgrades', 'Changes to existing technology', 'Improvements to building fabric', 'Install New Technology','Resource efficiency', 'Other']
  percentOptions: any[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 15, 20, 25, 30, 35, 40,45,50]
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
  energySurplus: DigitalTwinRows[] = []
  energyDeficit: DigitalTwinRows[] = []
  energySolution: DigitalTwinRows[] = []
  unitTypes: UnitsUom[] = ['Select', 'litres', 'kg', 'kWh', 'tonnes', 'metres', 'cubic metres', 'km', 'miles', 'million litres']

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
    halfHourlyData: any;


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

  getClusterTotal = (propertyToTotal: string) => {
    return this.energySolution.map((rec: any) => !isNaN(rec[propertyToTotal]) ? parseFloat(rec[propertyToTotal]) : 0)
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

  deleteSurplus = (surplusToDelete: DigitalTwinRows) => {
    if (!surplusToDelete.id) return;
    this.energySurplus = this.energySurplus.filter((sup: DigitalTwinRows) => sup.id !== surplusToDelete.id)

    this.db.deleteDigitalTwinRow(surplusToDelete.id).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity:'info',
          detail: 'Deleted row'
        })
      }
    })

  }

  deleteDeficit = (deficitToDelete: DigitalTwinRows) => {
    if (!deficitToDelete.id) return;

    this.energyDeficit = this.energyDeficit.filter((sup: DigitalTwinRows) => sup.id !== deficitToDelete.id )

    this.db.deleteDigitalTwinRow(deficitToDelete.id).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity:'info',
          detail: 'Deleted row'
        })
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  deleteSolution = (solution: DigitalTwinRows) => {
    if (!solution.id) return;

    this.energySolution = this.energySolution.filter((sol: DigitalTwinRows) => sol.id !== solution.id);

    this.db.deleteDigitalTwinRow(solution.id).subscribe({
      next: (res: any) => {
        this.msg.add({
          severity:'info',
          detail: 'Deleted row'
        })
      },
      error: (error: any) => {
        console.log(error)
      }
    })

  }

  addNewSurplus = () => {
    let surplus = {
      generatedId: "id" + Math.random().toString(16).slice(2),
      type: '',
      unit: '',
      total: 0,
      company: this.selectedCompany
    }

    this.energySurplus.push(surplus)
  }

  addNewDeficit = () => {
    let deficit = {
      generatedId: "id" + Math.random().toString(16).slice(2),
      type: '',
      unit: '',
      total: 0,
      deficit: true,
      company: this.selectedCompany
    }

    this.energyDeficit.push(deficit)
  }

  addNewSolution = () => {
    let solution = {
      generatedId: "id" + Math.random().toString(16).slice(2),
      company: this.selectedCompany,
      solutionText: 'Add your solution',
      estimatedEnergySaving:0,
      estimatedSaving: 0,
      estimatedCost: 0,
      estimatedCarbonSaving:0,
      paybackPeriod: 0
    }

    this.energySolution.push(solution)
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
    this.energySurplus = []
    this.energyDeficit = []
    this.energySolution = []

    this.track.updateSelectedCompany(this.selectedCompany)
    this.getReportValues(this.selectedCompany)
    this.getCompanyDigitalTwinData(this.selectedCompany)
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

  getCompanyDigitalTwinData = (selectedCompany: number) => {
    if (!selectedCompany) return;

    this.db.getDigitalTwinData(selectedCompany).subscribe({
      next:(res: any) => {
        if (res.data) {
          // res.data.forEach((data: any) => {
          //   if (data.deficit) {
          //     this.energyDeficit.push(data)
          // } else if (data.solution){
          //     this.energySolution.push(data)
          // } else {
          //     console.log(data)
          //   this.energySurplus.push(data)
          // }
          // })
          res.data.forEach((data: any) => {
            this.energySolution.push(data)
          })
        }
      }
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
    // if (!this.fuels.length) return;
    // loop through fuel types and just get total of all values/units/ total cost/

    let extractedData = this.fuels?.map((fuel: any) => {

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
            const groupedData = new Map();

            // Group by mpan
            res.forEach((row: any) => {
              row.hhd = JSON.parse(row.hhd.replaceAll('"','').replaceAll("'",'')).map((x: number) => x ? x : 0);

              // Group by mpan
              if (!groupedData.has(row.mpan)) {
                groupedData.set(row.mpan, []);
              }
              groupedData.get(row.mpan).push(row);
            });

            // Calculate totals for each group by mpan
            groupedData.forEach((rows, mpan) => {
              let grandTotal = 0;

              // Calculate total consumption for the current mpan
              rows.forEach((row: any) => {
                grandTotal += row.hhd.reduce((acc: number, curr: number) => acc + curr, 0);
              });

              // Store the result for the current mpan
              const envirotrackData = {
                type: `Electricity HH - ${mpan}`,
                consumption: grandTotal.toFixed(2),
                cost: 0,
                emissions: (grandTotal * 0.22499) / 1000
              };

              // Add the result to your tables
              this.scopeTable.push(envirotrackData);
              this.typeTotals.push(envirotrackData);
            });
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
    if (!this.selectedCompany) return;
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

  saveSurplusData = (isDeficit: boolean = false, ) => {
    if (!this.selectedCompany) return;

    const arrayToUse = isDeficit ? this.energyDeficit : this.energySurplus
    // Patch or post new rows of data
    arrayToUse.forEach((energyType: DigitalTwinRows) => {
      if (!energyType.id) {
        let rowToSend = {
          type: energyType.type,
          generatedId: energyType.generatedId,
          company: energyType.company,
          unit: energyType.unit,
          total: energyType.total,
          deficit: isDeficit,
        }

        if (!rowToSend.type) return;
        if (!rowToSend.company) return;

        this.db.saveDigitalTwinRow(rowToSend).subscribe({
          next: (res: any) => {},
          error: (error: any) => console.log(error)
        })
      } else {
        this.db.patchDigitalTwinRow(energyType.id, energyType).subscribe({
          next: (res: any) => {},
          error: (error: any) => console.log(error),
        })
      }
    })

    this.msg.add({
      severity:'success',
      detail: 'Data Saved'
    })
  }

  saveSolutionData = () => {
    if (!this.selectedCompany) return;

    //console.log(this.energySolution)

    this.energySolution.forEach((solution: DigitalTwinRows) => {
      if (!solution.id) {

        if (!solution.company) return;

        this.db.saveDigitalTwinRow(solution).subscribe({
          next: (res: any) => {
            if (res.data) {
              const index = this.energySolution.findIndex((solutions: DigitalTwinRows) => solutions.generatedId === res.data.generatedId)
              if (index !== -1) {
                this.energySolution[index] = res.data
              }
            }
          },
          error: (error: any) => console.log(error),
        })

      } else {
        this.db.patchDigitalTwinRow(solution.id, solution).subscribe({
          next: (res: any) => {
            if (res?.data) {
              const index = this.energySolution.findIndex(
                (solutions: DigitalTwinRows) => solutions.id === solution.id
              );
              if (index !== -1) {
                this.energySolution[index] = res.data;
              }
            }
          },
          error: (error: any) => console.log(error),
        })
      }

    })
    this.msg.add({
      severity:'success',
      detail: 'Data Saved'
    })

  }



  recalculateTotals = () => {
    this.totalCost = this.typeTotals.reduce((acc: any, curr: any) => acc + curr.cost, 0)
    this.totalConsumption = this.typeTotals.reduce((acc: any, curr: any) => acc + curr.consumption, 0)
    this.totalEmissions = (this.typeTotals.reduce((acc: any, curr: any) => acc + curr.emissions, 0)) / 1000

    this.totalConsumption = parseFloat(this.totalConsumption).toFixed(0)

  }

  calculateConsumptionPercent = (typeTotal: any) => {
    typeTotal.consumption = Number(typeTotal.consumption)
    const percent: number = (parseFloat(typeTotal.consumption) / parseFloat(this.totalConsumption)) * 100
    return percent.toFixed(1)
  }

  calculateCostPercent = (typeTotal: any) => {
    if (typeTotal.cost === 0 || isNaN(typeTotal.cost)) return 0

    const percent = (parseFloat(typeTotal.cost) / this.totalCost) * 100
    return percent.toFixed(1)
  }

  calculateEmissions = (typeTotal: any) => {
    if (typeTotal.type.includes('Electricity')) {
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
      'Gas':0.18293,
      'Kerosene': 0.24677,
      'Diesel (avg biofuel blend)': 0.23908,
      'Petrol (avg biofuel blend)': 0.22166,
      'Gas oil (Red diesel)': 0.25650,
      'LPG': 0.21449,
      'Propane': 0.21410,
      'Butane': 0.22241,
      'Biogas': 0.00022,
      'Biomethane (compressed)': 0.00038,
      'Wood Chips': 0.01074,
      'Natural Gas off Grid': 0.03021,
      'Bio Gas Off Grid': 0.00020,
      'Bio fuels': 0.03558, // biodiesel
      'Bio Mass': 0.01074,
      'Coal for Industrial use': 0.05629,
      'Burning oil (Kerosene)': 0.24677,
    };


    this.scopeTable = this.scopeTable.map((fuelType: any) => {
      //default conversion factor
      const defaultConversionFactor = 0.22;

      // scope based on type
      if (fuelType.type === 'Electricity' || fuelType.type.startsWith('Electricity HH')) {
        fuelType.scope = 'Scope 2';
      } else {
        fuelType.scope = 'Scope 1';
      }

      //conversion factor based on the object above - conversionFactors
      let selectedConversionFactor = conversionFactors[fuelType.type];

      // If the type is a half-hourly data (starts with 'Electricity HH -') the conversion factor is set here
      if (!selectedConversionFactor && fuelType.type.startsWith('Electricity HH')) {
        selectedConversionFactor = 0.22499;
      }

      // if the conversion factor is missing because the type name was changed
      if (!selectedConversionFactor) {
        if (fuelType.type.includes('Gas')) {
          selectedConversionFactor = conversionFactors['Gas']
        }  else if (fuelType.type.includes('Kerosene')){
          selectedConversionFactor = conversionFactors['Kerosene']
        } else if (fuelType.type.includes('Diesel')){
          selectedConversionFactor = conversionFactors['Diesel (avg biofuel blend)']
        } else if (fuelType.type.includes('Petrol')){
          selectedConversionFactor = conversionFactors['Petrol (avg biofuel blend)']
        } else if (fuelType.type.includes('Gas oil')){
          selectedConversionFactor = conversionFactors['Gas oil (Red diesel)']
        } else if (fuelType.type.includes('LPG')){
          selectedConversionFactor = conversionFactors['LPG']
        } else if(fuelType.type.includes('Propane')) {
          selectedConversionFactor = conversionFactors['Propane']
        } else if (fuelType.type.includes('Butane')){
          selectedConversionFactor = conversionFactors['Butane']
        } else if(fuelType.type.includes('Biogas')){
          selectedConversionFactor = conversionFactors['Biogas']
        } else if(fuelType.type.includes('Biomethane')){
          selectedConversionFactor = conversionFactors['Biomethane (compressed)']
        } else if(fuelType.type.includes('Wood')){
          selectedConversionFactor = conversionFactors['Wood Chips']
        } else if(fuelType.type.includes('Natural Gas')){
          selectedConversionFactor = conversionFactors['Natural Gas off Grid']
        } else if(fuelType.type.includes('Bio Gas')){
          selectedConversionFactor = conversionFactors['Bio Gas Off Grid']
        }else if (fuelType.type.includes('Bio fuels')){
          selectedConversionFactor = conversionFactors['Bio fuels']
        } else if(fuelType.type.includes('Bio Mass')){
          selectedConversionFactor = conversionFactors['Bio Mass']
        }else if(fuelType.type.includes('Coal')){
          selectedConversionFactor = conversionFactors['Coal for Industrial use']
        }else if(fuelType.type.includes('Burning oil ')){
          selectedConversionFactor = conversionFactors['Burning oil (Kerosene)']
        } else {
          selectedConversionFactor = defaultConversionFactor;
        }
      }


      // Calculate CO2e based on the conversion factor
      const calculatedCO2e = (fuelType.consumption * selectedConversionFactor) / 1000;
      fuelType.co2e = Number(calculatedCO2e);
      fuelType.conversionFactor = selectedConversionFactor;

      return fuelType;
    });

    // Update Co2e totals
    this.totalCo2e = this.typeTotals.reduce((acc: any, curr: any) => {
      if (curr.co2e > 0) {
        return acc + curr.co2e;
      }
      return acc;
    }, 0);

    this.typeTotals.sort((a: any, b: any) => b.consumption - a.consumption);
    this.scopeTable.sort((a: any, b: any) => b.co2e - a.co2e);
  };


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





