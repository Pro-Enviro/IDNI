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
import {formatCurrency} from "@angular/common";
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
  tmp: any = [];
  template: any;
  docxInHtml: any;
  modelVisible: boolean = false;
  recommendations: any[] = []
  chartData: any[] = []
  changeOptions: any[] = ['Behavioural', 'Upgrades', 'Changes to existing technology', 'Improvements to building fabric', 'Resource efficiency', 'Other']
  percentOptions: any[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
  isConsultant: boolean = false;


  constructor(
    private global: GlobalService,
    private msg: MessageService,
    private track: EnvirotrackService,
    private db: DbService,
  ) {}

  getTotal = (propertyToTotal: string) => {
    return this.recommendations.map((rec: any) => !isNaN(rec[propertyToTotal]) ? parseFloat(rec[propertyToTotal]) : 0)
      .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0)
  }
  addNewRecommendation = (assessment?: any, answerField?: any) => {
    let recommendation = new Recommendations()
    recommendation.recommendationId = this.recommendations.length >= 1 ? this.recommendations.length + 1 : 1;

    if (assessment) {
      recommendation.recommendation = assessment.question
      recommendation.recommendationDetail = assessment.recommendation
      recommendation.recommendationTitle = assessment.recommendation_title
    } else {
      recommendation.recommendation = `New Recommendation`
      recommendation.recommendationTitle = 'New Recommendation'
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
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getReportValues(this.selectedCompany)
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


  createReportObject = (save?: string) => {this.recommendations.map((rec: Recommendations) => {
      rec.steps.map((step: any) => {
        step.startDateFormatted = moment(step.startDate).format('MMM-YYYY')
        step.completionDateFormatted = moment(step.completionDate).format('MMM-YYYY')
      })
    })


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

  // getCols = (cols: any) => {
  //   return cols.map((col: any) => {
  //     return [
  //       { field: 'number', header: 'No'},
  //       { field: 'recommendation', header: 'recommendation' },
  //       { field: 'type_of_change', header: 'Type of Change' },
  //       { field: 'estimated_annual_energy_saving', header: 'Estimated Annual Energy Saving' },
  //       { field: 'estimated_annual_saving', header: 'Estimated Annual saving' },
  //       { field: 'estimated_cost_to_implement', header: 'Estimated cost to implement' },
  //       { field: 'payback_period', header: 'Payback Period' },
  //       {field: 'estimated_annual_carbon_saving ', header: 'Estimated Annual carbon saving'},
  //       {field: 'margin_of_error', header: 'Margin Of Error'}
  //
  //     ]
  //   })
  // }

  recommendationCols = [
    { field: 'number', header: 'No'},
    { field: 'recommendation', header: 'recommendation' },
    { field: 'type_of_change', header: 'Type of Change' },
    { field: 'estimated_annual_energy_saving', header: 'Estimated Annual Energy Saving' },
    { field: 'estimated_annual_saving', header: 'Estimated Annual saving' },
    { field: 'estimated_cost_to_implement', header: 'Estimated cost to implement' },
    { field: 'payback_period', header: 'Payback Period' },
    {field: 'estimated_annual_carbon_saving ', header: 'Estimated Annual carbon saving'},
    {field: 'margin_of_error', header: 'Margin Of Error'}
  ]

  exportCSV = () => {
    const exportRow = this.recommendationCols.map((col:any) => {

    })

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(exportRow);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });

      this.saveAsExcelFile(excelBuffer, `${this.selectedCompany.name} - ${moment(new Date()).format('DD-MM-YYYY')}.xlsx`);
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

  ngOnInit(): void {
    this.getCompanies();
  }
}





