export type UnitsUom = 'Select' | 'litres' | 'kg' | 'kWh' | 'tonnes' | 'cubic metres' | 'km' | 'miles' | 'million litres'
export type RegionsOfOrigin = 'UK' | 'EU' | 'US' | 'Asia'
export type UnitsOfCost = 'Cost/unit' | 'Total Cost' | 'Select'
export type ModeOfTransport = 'Select' | 'Van <3.5t' | 'Refrigerated Van <3.5t' | 'Van >3.5t < 7.5t' | 'Refrigerated Van > 3.5t < 7.5t' | 'HGV' | 'Refrigerated HGV'
export type FuelTypes = 'Select' | 'Diesel' | 'Petrol' | 'LPG' | 'EV' | 'Hydrogen'
export type OtherModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air'
export type CompanyModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air' | 'Company Car' | 'Public Transport'
export type Routes = 'Select' | 'NI to UK' | 'NI to EU' | 'NI to USA' | 'NI to RoW'
export type StaffCommuteModes = 'Select' | 'On foot' | 'Cycle' | 'Public Transport' | 'Car' | 'Motorbike'
export type MaterialTypes = 'Steel' | 'Other Metals' | 'Plastics' | 'Other Materials' | string
export type SteelMaterials = 'Mild Steel' | 'Carbon Steel' | 'Tool Steel D2' | 'Tool Steel H13' | 'Tool Steel M2' | 'Tool Steel S275' | 'Tool Steel S325' | 'Alloy Steel 4340' | 'Alloy Steel 4140' | 'Alloy Steel 4150' | 'Alloy Steel 9310' | 'Alloy Steel 52100' | 'Stainless Steel 304' | 'Stainless Steel 316' | 'Duplex Steel' | 'Hardox series 400' | 'Hardox series 500' | 'Hardox series 600' | 'Inconel series 600' | 'Inconel series 700' | string
export type OtherMetals = 'Aluminium 1000'| 'Aluminium 2000'| 'Aluminium 6000'| 'Aluminium 7000'| 'Duralumin'| 'Aluminium Lithium'| 'Copper'| 'Bronze'| 'Titanium'| 'Lithium'| 'Magnesium' | string
export type Plastics = 'ABS'| 'PA'| 'PET'| 'PP'| 'PU'| 'POM'| 'PEEK'| 'PE'| 'PVC'| 'PPS'| 'Elastomers'| 'Composites'| 'Textiles'| string
export type OtherMaterials = 'Composites' | 'Textiles' | 'Cement' | 'Aggregate' | 'Sand' | 'Glass' | 'Chemicals' | 'Hardwood' | 'Softwood' | string
export type MaterialFormats = 'Sheet' |  'Profile' |  'Filament/Fibre' |  'Ingot/Billet' |  'Natural State' |  'Powder' |  'Granule' |  'Liquid' |  'Gas' |  'Recyclate'

export interface PetToolData {
  id?:number
  defaultData?: {}[],
  company_id: number
  number_of_employees: number
  export_percent: number
  mark_end: number | undefined
  mark_start: number | undefined
  productivity_comparison: string
  productivity_score: number
  sic_letter: string
  sic_code: string
  training_percent: number
  turnover: number,
  innovation_percent: number
  year: string
  total_external_costs: number | undefined

  cost_of_energy: string
  cost_of_raw_materials: string
  cost_of_bought_in_goods: string
  water_usage: string
  waste: string
  road_freight: string
  other_freight: string
  company_travel: string
  staff_commute: string
  other_external_costs: string
}

export const energyNames: string[] = ['Electricity', 'Natural Gas (Grid)', 'Natural Gas off Grid', 'Bio Gas Off Grid', 'LPG', 'Oil', 'Kerosene', 'Bio Fuels', 'Bio Mass', 'Coal for Industrial use', 'Other']
export const years: string[] = ['2024','2023','2022']
