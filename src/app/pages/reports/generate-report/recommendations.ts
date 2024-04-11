export class Recommendations {
  recommendationId: number = 1
  recommendation: string = ''
  recommendationTitle: string = ''
  recommendationDetail: string = ''
  recommendationDetailOriginalTemplate:string =  ''
  estimatedEnergySaving: number | string = 0
  estimatedSaving: number | string = 0
  estimatedCost: number | string = 0
  paybackPeriod: number = 0
  estimatedCarbonSaving: number | string = 0
  fuelTypeSaved: string = 'Electricity'
  changeType: string[] = []
  changeTypeDetails: string = ''
  responsibility: string = 'Owner'
  marginOfErrorSavings: number = 0
  marginOfErrorCost: number = 0
  nonFinancialBenefits: string = 'e.g., improved workforce conditions, product quality, staff productivity and wellbeing, customer experience, maintenance and fault identification, reduced noise from production lines.'
  projectTimings: string = 'e.g.,Suggested start date and duration or note on whether the recommendation is short/medium/long-term.'
  constraints: string = 'e.g., lease terms, site access, prerequisite steps.'
  riskAndMitigations: string = 'e.g., rebound effects, disruptions.'
  bestPracticeGuidance: string = 'e.g., manufacturer or product recommendations, principles to consider, questions to ask suppliers.'
  sourcesOfSupport: string = 'e.g., government grants, financing options, sources of independent advice.'
  steps: Steps[] = stepsText.map((text:any) => {
    const step = new Steps()
    step.step = text;
    return step
  })
}

const stepsText = [
'e.g.\n Step 1: Tender and Obtain 3 Comparable Quotes',
'Step 2: Compare and Analyse Quotes',
'Step 3: Apply for Grant (if applicable)',
'Step 4: Obtaining RAMs, Insurance document and timelines from the supplier. Preinstall meetings and inductions.,',
'Step 5: Installation'
]


export class Steps {
  step: string = ''
  ownerOfRecommendation: string = 'e.g., Company Contact'
  startDate: Date = new Date()
  completionDate: Date = new Date()
  startDateFormatted?: string = ''
  completionDateFormatted?: string = ''
}


export class AssessmentType {
  id?: number
  answer: string = ''
  answer_field: string = ''
  bad_text: string = ''
  good_text: string = ''
  selected_text: string = 'Good'
  date_created: Date = new Date()
  question: string = ''
  recommendation: string = ''
  recommendation_title: string = ''
  section: string = ''
  type: string = 'editor'
  checked: boolean =  false
}
