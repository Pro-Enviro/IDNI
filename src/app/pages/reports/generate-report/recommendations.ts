export class Recommendations {
  recommendationId: number = 1
  recommendation: string = ''
  estimatedEnergySaving: number | string = 0
  estimatedSaving: number | string = 0
  estimatedCost: number | string = 0
  paybackPeriod: number = 0
  estimatedCarbonSaving: number | string = 0
}


export class AssessmentType {
  id?: number
  question: string = ''
  recommendation: string = ''
  section: string = ''
  type: string = 'editor'
  checked: boolean =  false
}
