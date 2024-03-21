import {Component, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from "../../../_services/global.service";
import {Recommendations, Steps, AssessmentType} from "./recommendations";
import {MessageService} from "primeng/api";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
// import PizZip from "pizzip";
// import PizZipUtils from "pizzip/utils";
// import mammoth from "mammoth";
// import {HttpClient} from "@angular/common/http";
// import Docxtemplater from "docxtemplater";
// import DocxtemplaterHtmlModule from 'docxtemplater-html-module';
// import ImageModule from 'docxtemplater-image-module'
import _ from 'lodash';

// const expressions = require('docxtemplater/expressions-ie11');
import {saveAs} from "file-saver";
import moment from "moment";
import {CheckboxChangeEvent} from "primeng/checkbox";
import {DropdownChangeEvent} from "primeng/dropdown";
import {interval, Subscription, timer} from "rxjs";
import {standardText} from "./standard-text";
import {SharedComponents} from "../../envirotrack/shared-components";
import {SharedModules} from "../../../shared-module";
import {HttpClient} from "@angular/common/http";
import {DialogModule} from "primeng/dialog";
import {EnvirotrackService} from "../../envirotrack/envirotrack.service";
import {DbService} from "../../../_services/db.service";
import {InputTextareaModule} from "primeng/inputtextarea";


// Image handling functions for DocXTemplater
const base64Regex =
  /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
const validBase64 =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

function base64Parser(dataURL: any) {
  if (
    typeof dataURL !== "string" ||
    !base64Regex.test(dataURL)
  ) {
    return false;
  }

  const stringBase64 = dataURL.replace(base64Regex, "");

  ///////
  // NOTE: Caused issues with downloading Demand Chart. Uncomment if causing issues elsewhere.
  // if (!validBase64.test(stringBase64)) {
  //   throw new Error(
  //     "Error parsing base64 data, your data contains invalid characters"
  //   );
  // }
  ///////

  // For browsers, return a string (of binary content) :
  const binaryString = window.atob(stringBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }

  return bytes.buffer;
}


interface TemplateDetails {
  [index: string]: any

  assessmentReportId: number,
  assessorsName: string,
  assessorsEmail: string,
  dateOfIssue: Date,
  dateOfAssessment: Date,
  dateOfIssueFormatted?: string,
  dateOfAssessmentFormatted?: string,
  businessName: string,
  businessAddress: string,
  telephoneNumber: number,
  mobileNumber: number,
  emailAddress: string,
  website: string,
  established: Date,
  numberOfEmployees: number,
  turnover: number,
  companiesHouseRef: number,
  companyFunction: string,
  siteFunction: string,
  uprn: string,
  meterPointAccessNumber?: any[],
  meterPointReferenceNumber?: number[],
  smartMeter?: 'Yes' | 'No',
  electricitySupplierName?: string
  electricitySupplierContact?: string,
  gasSupplierName?: string,
  gasSupplierContact?: string,
  otherSupplierName?: string,
  otherSupplierContact?: string,
  loaObtained: 'Yes' | 'No',
  weeklyOperationalHours?: string,
  companysObjectives?: string,
  assessorComments?: string,
  actionPlan?: string
  siteAssessmentLighting?: string,
  siteAssessmentHeating?: string,
  siteAssessmentHeatLoss?: string,
  siteAssessmentCompressedAir?: string,
  siteAssessmentProductionEquipment?: string,
}


export type TemplateTypes = 'BEAS' | 'SPF'

interface ReportGeneration {
  template: TemplateTypes
  companyAndUser: TemplateDetails
  recommendations: Recommendations[]
  chartData: any,
  fuelTypeTotals: any[]
  recoTotals: {
    totalEnergySaving: any,
    totalAnnualSaving: any,
    totalCost: any,
    totalCarbonSaving: any
  }
  fuelTypeTotalsTable: {
    cost: number,
    consumption: number
    emissions: number,
  },
  siteAssessment: any
}

const stripHTML = (content: any) => {
  if (!content) return;
  return content.replace(/<br>(?=(?:\s*<[^>]*>)*$)|(<br>)|<[^>]*>/gi, (x: string, y: string) => y ? ' & ' : '')
}

// function loadFile(url: any, callback: any) {
//   PizZipUtils.getBinaryContent(url, callback)
// }


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
  visible: boolean = false;
  tmp: any = [];
  template: any;
  docxInHtml: any;
  modelVisible: boolean = false;
  reportValues!: TemplateDetails;
  recommendations: any[] = []
  filteredDropdown: any[] = []
  currentUser!: any;
  allQuestions!: any[];
  questions!: any[]
  weekObject: any;
  templateOptions: string[] = ['Aston', 'Staffordshire', 'Energy Intensive', 'Net Zero Worcestershire', 'Marches Energy Grant']
  selectedTemplate: string = 'Aston'
  sharedRecommendations: any = {
    siteAssessmentLighting: '',
    siteAssessmentHeating: '',
    siteAssessmentCompressedAir: '',
    siteAssessmentHeatLoss: '',
    siteAssessmentProduction: '',
  }
  chartData: any[] = []
  siteAssessmentOptions: any[] = []
  siteAssessmentReport: AssessmentType[] = []

  //timer
  timerText = 'Start';
  time = 0;
  autosaveTimer?: Subscription;
  changeOptions: any[] = ['Behavioural', 'Upgrades', 'Changes to existing technology', 'Improvements to building fabric', 'Resource efficiency', 'Other']
  percentOptions: any[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]

  constructor(
    private global: GlobalService,
    private msg: MessageService,
    private http: HttpClient,
    private track: EnvirotrackService,
    private db: DbService
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
  addNewAssessment = () => {
    let assessment = new AssessmentType()
    assessment.id = this.siteAssessmentReport.length;
    this.siteAssessmentReport.push(assessment)
  }
  selectAssessment = (index: number, event: any) => {
    this.siteAssessmentReport[index].selected_text = 'Good'
    this.siteAssessmentReport[index].question = event.value.question
    this.siteAssessmentReport[index].good_text = event.value.good_text
    this.siteAssessmentReport[index].bad_text = event.value.bad_text
    this.siteAssessmentReport[index].answer_field = event.value.good_text
    this.siteAssessmentReport[index].recommendation = event.value.recommendation
    this.siteAssessmentReport[index].recommendation_title = event.value.recommendation_title
  }
  handleRecommendationChecked = (index: number, event: CheckboxChangeEvent, report: AssessmentType) => {
    if (event.checked) {
      this.addNewRecommendation(report)
    } else {
      const findReco = this.recommendations.find((rec: Recommendations) => rec.recommendation === report.question)
      this.deleteRecommendation(findReco)
    }
    report.checked = event.checked
  }
  sortRecommendations = () => {
    this.recommendations = this.recommendations.sort((a: any, b: any) => a.paybackPeriod - b.paybackPeriod)

    // Recommendation 1, 2, 3 etc reordered
    this.recommendations.map((reco: any, index: number) => {
      reco.recommendationId = index + 1;
      return reco;
    })
  }
  selectGoodOrBad = (index: number, event: any) => {
    this.siteAssessmentReport[index].selected_text = event.value;
    this.siteAssessmentReport[index].answer_field = this.siteAssessmentReport[index][event.value === 'Good' ? 'good_text' : 'bad_text']
  }
  deleteRecommendation = (deletedRec: Recommendations) => {
    this.recommendations = this.recommendations.filter((rec: any) => rec.recommendationId !== deletedRec.recommendationId)
  }
  deleteAssessment = (report: AssessmentType) => {
    this.siteAssessmentReport = this.siteAssessmentReport.filter((r: AssessmentType) => r.question !== report.question)
    return this.msg.add({
      severity: 'warn',
      detail: 'This assessment has been deleted'
    })
  }
  addNewStep = (index: number) => {
    this.recommendations[index].steps.push(new Steps())
  }
  deleteStep = (recommendationIndex: number, stepIndex: number) => {
    this.recommendations[recommendationIndex].steps.splice(stepIndex, 1)
  }
  getCompanies = () => {
    this.track.getCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data;
        this.selectedCompany = res.data[0].id
        this.onSelectCompany()
      }
    })
  }
  onSelectCompany = () => {
    this.track.updateSelectedCompany(this.selectedCompany)
    this.getReportValues(this.selectedCompany)
  }
  getReportValues = (id: number) => {

    this.db.getRecommendations(this.selectedCompany).subscribe({
      next: (res: any) => {
        if (res?.recommendations) {

          const parsed = JSON.parse(res.recommendations);

          this.recommendations = parsed

          // parsed.recommendations.forEach((rec: any) => {
          //   rec.steps.map((step: any) => {
          //     step.completionDate = new Date(step.completionDate)
          //     step.startDate = new Date(step.startDate)
          //   })
          // })
        }
      },
      error: (error: any) => console.log(error),

    })
    // this.admin.fnGetCompanyDetails(id, ['*']).subscribe({
    //   next: (res: any) => {
    //     // Check if report has been previously saved
    //     if (res?.report_fields) {
    //
    //       const parsed = JSON.parse(res.report_fields);
    //
    //       parsed.recommendations.forEach((rec: any) => {
    //         rec.steps.map((step: any) => {
    //           step.completionDate = new Date(step.completionDate)
    //           step.startDate = new Date(step.startDate)
    //         })
    //       })
    //
    //       if (parsed.template) {
    //         this.selectedTemplate = parsed.template
    //       }
    //       this.recommendations = parsed.recommendations
    //       return;
    //
    //     } else {
    //
    //       // String to display in input box for Weekly Operating Hours
    //       const week = `Mon: ${res?.operating_day_monday ? res?.monday_start_time + '-' + res?.monday_end_time : 'Closed'}\
    //                         \nTue: ${res?.operating_day_tuesday ? res?.tuesday_start_time + '-' + res?.tuesday_end_time : 'Closed'}\
    //                         \nWed: ${res?.operating_day_wednesday ? res?.wednesday_start_time + '-' + res?.wednesday_end_time : 'Closed'}\
    //                         \nThu: ${res?.operating_day_thursday ? res?.thursday_start_time + '-' + res?.thursday_end_time : 'Closed'}\
    //                         \nFri: ${res?.operating_day_friday ? res?.friday_start_time + '-' + res?.friday_end_time : 'Closed'}\
    //                         \nSat: ${res?.operating_day_saturday ? res?.saturday_start_time + '-' + res?.saturday_end_time : 'Closed'}\
    //                         \nSun: ${res?.operating_day_sunday ? res?.sunday_start_time + '-' + res?.sunday_end_time : 'Closed'}`
    //
    //       // Extract company details
    //       this.reportValues = {
    //         assessmentReportId: 0,
    //         dateOfIssue: new Date(),
    //         assessorsName: `${this.currentUser.data.first_name} ${this.currentUser.data.last_name}`,
    //         assessorsEmail: this.currentUser.data.email,
    //         dateOfAssessment: new Date(),
    //         businessName: res.name,
    //         businessAddress: res.address ? res.address : res.manualAddressEntry,
    //         telephoneNumber: res.contact_number,
    //         mobileNumber: res.mobile_number,
    //         emailAddress: res.contact_email,
    //         website: res.website_url,
    //         established: new Date(res.reg_date),
    //         numberOfEmployees: res.number_employees,
    //         turnover: res.turnover,
    //         companiesHouseRef: res.house_reference,
    //         companyFunction: stripHTML(res.organisation_description),
    //         siteFunction: '',
    //         uprn: res.uprn,
    //         meterPointAccessNumber: [],
    //         meterPointReferenceNumber: [],
    //         smartMeter: res.smart_meter ? 'Yes' : 'No',
    //         electricitySupplierName: '',
    //         electricitySupplierContact: '',
    //         gasSupplierName: '',
    //         gasSupplierContact: '',
    //         otherSupplierName: '',
    //         otherSupplierContact: '',
    //         loaObtained: 'No',
    //         weeklyOperationalHours: week,
    //         companysObjectives: 'Company Objectives',
    //         assessorComments: 'Assessor Comments',
    //         actionPlan: 'Action Plan',
    //         siteAssessmentLighting: '',
    //         siteAssessmentHeating: '',
    //         siteAssessmentHeatLoss: '',
    //         siteAssessmentCompressedAir: '',
    //         siteAssessmentProductionEquipment: '',
    //       }
    //
    //       this.weekObject = {
    //         'Mon': res?.operating_day_monday ? `${res?.monday_start_time}-${res?.monday_end_time}` : 'Closed',
    //         'Tue': res?.operating_day_tuesday ? `${res?.tuesday_start_time}-${res?.tuesday_end_time}` : 'Closed',
    //         'Wed': res?.operating_day_wednesday ? `${res?.wednesday_start_time}-${res?.wednesday_end_time}` : 'Closed',
    //         'Thu': res?.operating_day_thursday ? `${res?.thursday_start_time}-${res?.thursday_end_time}` : 'Closed',
    //         'Fri': res?.operating_day_friday ? `${res?.friday_start_time}-${res?.friday_end_time}` : 'Closed',
    //         'Sat': res?.operating_day_saturday ? `${res?.saturday_start_time}-${res?.saturday_end_time}` : 'Closed',
    //         'Sun': res?.operating_day_sunday ? `${res?.sunday_start_time}-${res?.sunday_end_time}` : 'Closed',
    //       }
    //
    //       this.chartData = []
    //       this.recommendations = []
    //       this.siteAssessmentReport = []
    //     }
    //   },
    //   error: (err: any) => console.log(err),
    //   complete: () => {
    // this.getQuestions()
    // }
    // })
  }

  // getQuestions() {
  //   this.admin.fnGet(`items/project_templates`).subscribe({
  //     next: (res: any) => {
  //
  //       this.allQuestions = res.data;
  //       for (let i = 0; i < this.allQuestions.length; i++) {
  //         this.allQuestions[i].answer = this.allQuestions[i].answer_field
  //
  //         if (this.allQuestions[i].section === 'site_assessment') {
  //           this.reportValues[this.allQuestions[i].answer_field] = this.allQuestions[i].default_text
  //         }
  //       }
  //
  //       this.siteAssessmentOptions = this.allQuestions.filter((question: any) => question.section === 'site_assessment')
  //       this.siteAssessmentOptions.unshift({question: 'None'})
  //
  //       this.filterQuestions()
  //
  //
  //     },
  //     error: (err: any) => this.msg.add({
  //       severity: 'error',
  //       summary: 'Questions not found!',
  //       detail: err.error.errors[0].message
  //     })
  //   })
  // }

  filterQuestions = () => {
    this.questions = this.allQuestions.filter((question: any) => question.template.includes(this.selectedTemplate))
    this.getTemplate()
  }
  filter = (event: AutoCompleteCompleteEvent) => {
    let filtered: any[] = [];
    let query = event.query;


    for (let i = 0; i < (this.siteAssessmentOptions as any[]).length; i++) {
      let reco = (this.siteAssessmentOptions as any[])[i];

      if (reco.question.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reco);
      }
    }


    this.filteredDropdown = filtered;

  }
  selectedRecommendation = (event: any, index: number) => {
    // Prefill from selected recommendation from DB
    this.recommendations[index].recommendation = event.heading
    this.recommendations[index].changeType = event.sub_category
    this.recommendations[index].recommendationDetailOriginalTemplate = event.content;
    this.recommendations[index].recommendationDetail = event.recommendation
    this.recommendations[index].recommendationTitle = event.recommendation_title
  }

  addAssessmentText = (event: DropdownChangeEvent, rec: Recommendations) => {
    if (!event.value) {
      return;
    } else {
      rec.recommendationDetailOriginalTemplate = rec.recommendationDetail
      const answer_field = event.value.answer_field
      rec.recommendationDetail = answer_field + rec.recommendationDetail
    }

  }
  // Needed for custom Recommendations
  onBlur = (event: Event, index: number) => {
    let tokenInput = event.target as any;
    if (tokenInput.value) this.recommendations[index].recommendation = tokenInput.value;
  }

  getUser() {
    // this.admin.fnGet('/users/me').subscribe({
    //   next: (res: any) => {
    //     this.currentUser = res;
    //   },
    //   error: (err: any) => console.log(err)
    // })
  }

  updateChartData = (valueEmitted: any) => {
    this.chartData = valueEmitted
  }
  getTemplate = () => {
    // Change content id to match correct selected template
    let id = 14;
    // switch (this.selectedTemplate) {
    //   case 'Aston':
    //     id = 13;
    //     break;
    //   case 'Staffordshire':
    //     id = 12;
    //     break;
    //   case 'Energy Intensive':
    //     id = 15;
    //     break;
    //   case 'Net Zero Worcestershire':
    //     id = 16
    //     break;
    //   case 'Marches Energy Grant':
    //     id = 17
    //     break;
    //   default:
    //     id = 13;
    // }


    // this.admin.fnGet(`/items/content/${id}`).subscribe({
    // next: (res: any) => {
    //   this.template = `${environment.api}/assets/${res.data.file}?token=${this.storage.get('access_token')}`
    //   this.http.get(this.template, {
    //     responseType: 'arraybuffer'
    //   }).subscribe({
    //     next: (buffer: ArrayBuffer) => {
    //       mammoth.convertToHtml({
    //         arrayBuffer: buffer
    //       }).then((result: any) => {
    //         this.docxInHtml = result.value;
    //       }).catch((error: any) => console.error(error))
    //     }
    //   })
    // }
    // })
  }

//////////////////////////
//   REPORT GENERATION  //
//////////////////////////

  // updateTemplate = (values: any, docname: string) => {
  //   loadFile(this.template, (error: Error | null, content: string) => {
  //       if (error) {
  //         throw error;
  //       }
  //
  //       const imageOptions: any = {
  //         getImage(tag: any) {
  //           return base64Parser(tag)
  //         },
  //         getSize(img: any) {
  //           return [600, 500];
  //         },
  //       };
  //
  //       function nullGetter() {
  //         return "";
  //       }
  //
  //       const zip = new PizZip(content);
  //       const doc = new Docxtemplater(zip, {
  //         parser: expressions,
  //         paragraphLoop: true,
  //         linebreaks: true,
  //         nullGetter,
  //         modules: [
  //           new DocxtemplaterHtmlModule({
  //             ignoreUnknownTags: true,
  //             ignoreCssErrors: true,
  //             warnFn(errors: any) {
  //               console.log("My errors :");
  //               errors.forEach(function (error: any) {
  //                 console.log(error.message);
  //               });
  //             },
  //             img: {
  //               Module: ImageModule,
  //             }
  //           }),
  //           new ImageModule(imageOptions)
  //         ]
  //       });
  //
  //       try {
  //         doc.render(values);
  //       } catch (error: any) {
  //         console.log('error', error)
  //
  //         function replaceErrors(key: any, value: any) {
  //           if (value instanceof Error) {
  //             return Object.getOwnPropertyNames(value).reduce(
  //               function (error: any, key:any) {
  //                 // @ts-ignore
  //                 error[key] = value[key];
  //                 return error;
  //               },
  //               {}
  //             );
  //           }
  //           return value;
  //         }
  //
  //         console.log(JSON.stringify({error: error}, replaceErrors));
  //
  //         if (error.properties && error.properties.errors instanceof Array) {
  //           const errorMessages = error.properties.errors
  //             .map(function (error: any) {
  //               return error.properties.explanation;
  //             })
  //             .join('\n');
  //           console.log('errorMessages', errorMessages);
  //         }
  //         throw error;
  //       }
  //       const out = doc.getZip().generate({
  //         type: 'blob',
  //         mimeType:
  //           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       });
  //       // Output the document using Data-URI
  //       //this.onUpload(new File([out],docname), supplier)
  //       saveAs(out, `${docname}.docx`);
  //     }
  //   );
  // }
  createReportObject = (save?: string) => {

    // const dataCharts = {
    //   chartsSelected: this.chartData
    // }

    // Update dates to be readable
    // this.reportValues.dateOfAssessmentFormatted = moment(this.reportValues.dateOfAssessment).format('DD/MM/YYYY')
    // this.reportValues.dateOfIssueFormatted = moment(this.reportValues.dateOfIssue).format('DD/MM/YYYY')

    this.recommendations.map((rec: Recommendations) => {
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
    let commaForTypeTotals;
    // let chartsSelectedCopy: any = _.cloneDeep(dataCharts);
    // let fuelTypeTotalsWithComma = {
    //   cost: this.dataAnalysis.totalCost,
    //   consumption: this.dataAnalysis.totalConsumption,
    //   emissions: this.dataAnalysis.totalEmissions
    // }

    // This is to format the text for the report, without replacing the object on the page (Causes issues when saving)
    const recoTotalsCopy = _.cloneDeep(recoTotals)
    // const dataAnalysisCopy = _.cloneDeep(this.dataAnalysis)

    // If the users wants to extrapolate data for 365 days, take that data instead.
    // if (dataAnalysisCopy.useExtrapolatedData) {
    //   dataAnalysisCopy.typeTotals[0].details = dataAnalysisCopy.extrapolatedTable
    //   dataAnalysisCopy.typeTotals[0].totalCost = dataAnalysisCopy.extrapolatedTotalCost
    // }

    // Generating the Word Report
    if (!save) {

      commaOnLargeNumbers = {
        totalEnergySaving: recoTotalsCopy.totalEnergySaving ? recoTotalsCopy.totalEnergySaving.toLocaleString('en-US', strOptions) : 0,
        totalSaving: recoTotalsCopy.totalSaving.toLocaleString('en-US', strOptions),
        totalCost: recoTotalsCopy.totalCost.toLocaleString('en-US', strOptions),
        totalCarbon: recoTotalsCopy.totalCarbon.toLocaleString('en-US', strOptions)
      }

      // commaForTypeTotals = dataAnalysisCopy.typeTotals.map((fuelType: any) => {
      //   fuelType.type = fuelType.type === 'Electricity' || fuelType.type === 'Electricity HH' ? 'Electricity (including transmission and distribution)' : `${fuelType.type} (gross CV)`
      //
      //   // Effective rate
      //   fuelType.effectiveRate = (fuelType.cost / fuelType.consumption).toFixed(2)
      //
      //   fuelType.consumption = fuelType.consumption.toLocaleString('en-US', strOptions)
      //   fuelType.cost = fuelType.cost.toLocaleString('en-US', strOptions)
      //   fuelType.totalCost = fuelType.totalCost.toLocaleString('en-US', strOptions)
      //   fuelType.emissions = (fuelType.emissions / 1000).toLocaleString('en-US', strOptions)
      //   fuelType.details = fuelType.details.map((row: any) => {
      //     if (row.units) {
      //       row.units = row.units.toLocaleString('en-US', strOptions);
      //     }
      //     row.cost = row.cost ? row.cost.toLocaleString('en-US', strOptions) : 0
      //     return row;
      //   })
      //   return fuelType;
      // })
      //
      // fuelTypeTotalsWithComma = {
      //   cost: dataAnalysisCopy.totalCost.toLocaleString('en-US', strOptions),
      //   consumption: dataAnalysisCopy.totalConsumption.toLocaleString('en-US', strOptions),
      //   emissions: dataAnalysisCopy.totalEmissions.toLocaleString('en-US', strOptions),
      // }

      // const chartNames: any = {
      //   'heat': 'Half-Hourly Consumption Data Analysis',
      //   'scatter': 'Daily Consumption',
      //   'pie': '  ',
      //   'lowest': 'Base Load Consumption',
      //   'avg': 'Average Daily Consumption',
      //   'demand': 'Authorised Supply Capacity',
      //   'bar': '  ',
      // }

      // Rename Charts for Report and add standard text
      // chartsSelectedCopy = chartsSelectedCopy.chartsSelected.map((chart: any) => {
      //   const chartName = chart.name
      //   chart.standardText = standardText[chartName]
      //   chart.name = chartNames[chartName] === '  ' ? chartName : chartNames[chartName]
      //   return chart;
      // })


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
      // template: this.selectedTemplate as TemplateTypes,
      // companyAndUser: this.reportValues,
      // siteAssessment: this.siteAssessmentReport,
      // chartData: save ? dataCharts.chartsSelected : chartsSelectedCopy,
      recommendations: filteredRecommendations.sort((a: any, b: any) => a.paybackPeriod - b.paybackPeriod),
      totals: !save ? recoTotals : commaOnLargeNumbers,
      // fuelTypeTotals: save ? this.dataAnalysis.typeTotals : commaForTypeTotals,
      // fuelTypeTotalsTable: fuelTypeTotalsWithComma
    }

    return report;
  }
  generateReport = () => {
    const report = this.createReportObject()
    // console.log(report)
    // this.updateTemplate(report, `recommendations_${moment(new Date).format('DD-MM-YYYY')}`)
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

  runAutoSave = () => {
    this.autosaveTimer = interval(120000).subscribe(() => {
      this.saveForm()
    })
  }

  checkAutoSave = (event: CheckboxChangeEvent) => {
    event.checked ? this.runAutoSave() : this.autosaveTimer?.unsubscribe()
  }

  ngOnInit(): void {
    this.getUser()
    this.getCompanies();
    this.getTemplate()

    this.time = 0;
    // Last saved timer
    timer(0, 1000).subscribe(ellapsedCycles => {
      this.time++
      this.timerText = moment.utc(this.time * 1000).format('m');
    })


  }

  protected readonly Recommendations = Recommendations;
}





