export type UnitsUom = 'Select' | 'litres' | 'kg' | 'kWh' | 'tonnes' | 'cubic metres' | 'km' | 'miles' | 'million litres'
export type RegionsOfOrigin = 'UK' | 'EU' | 'US' | 'Asia'
export type UnitsOfCost = 'Cost/unit' | 'Total Cost' | 'Select'
export type ModeOfTransport =
  'Select'
  | 'Van <3.5t'
  | 'Refrigerated Van <3.5t'
  | 'Van >3.5t < 7.5t'
  | 'Refrigerated Van > 3.5t < 7.5t'
  | 'HGV'
  | 'Refrigerated HGV'
export type FuelTypes = 'Select' | 'Diesel' | 'Petrol' | 'LPG' | 'EV' | 'Hydrogen'
export type OtherModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air'
export type CompanyModesOfTransport = 'Select' | 'Rail' | 'Sea' | 'Air' | 'Company Car' | 'Public Transport'
export type Routes = 'Select' | 'NI to UK' | 'NI to EU' | 'NI to USA' | 'NI to RoW'
export type StaffCommuteModes = 'Select' | 'On foot' | 'Cycle' | 'Public Transport' | 'Car' | 'Motorbike'
export type MaterialTypes = 'Steel' | 'Other Metals' | 'Plastics' | 'Other Materials'
export type SteelMaterials = 'Mild Steel' | 'Carbon Steel' | 'Tool Steel D2' | 'Tool Steel H13' | 'Tool Steel M2' | 'Tool Steel S275' | 'Tool Steel S325' | 'Alloy Steel 4340' | 'Alloy Steel 4140' | 'Alloy Steel 4150' | 'Alloy Steel 9310' | 'Alloy Steel 52100' | 'Stainless Steel 304' | 'Stainless Steel 316' | 'Duplex Steel'
export type OtherMetals = 'Aluminium 1000'| 'Aluminium 2000'| 'Aluminium 6000'| 'Aluminium 7000'| 'Duralumin'| 'Aluminium Lithium'| 'Copper'| 'Bronze'| 'Titanium'| 'Lithium'| 'Magnesium'
export type Plastics = 'ABS'| 'PA'| 'PET'| 'PP'| 'PU'| 'POM'| 'PEEK'| 'PE'| 'PVC'| 'PPS'| 'Elastomers'| 'Composites'| 'Textiles'
export type OtherMaterials = 'Composites' | 'Textiles' | 'Cement' | 'Aggregate' | 'Sand' | 'Glass' | 'Chemicals' | 'Hardwood' | 'Softwood'
export type MaterialFormats = 'Sheet' |  'Profile' |  'Filament/Fibre' |  'Ingot/Billet' |  'Natural State' |  'Powder' |  'Granule' |  'Liquid' |  'Gas' |  'Recyclate'

export interface PetToolData {
  defaultData: {}[]
  employees: number
  exportPercent: number
  markEnd: number | undefined
  markStart: number | undefined
  productivityPercentile: string
  productivityScore: number
  sicLetter: string
  sicNumber: string
  staffTrainingPercent: number
  turnover: number,
  innovationPercent: number
}

export const energyNames: string[] = ['Electricity', 'Natural Gas (Grid)', 'Natural Gas off Grid', 'Bio Gas Off Grid', 'LPG', 'Oil', 'Kerosene', 'Bio Fuels', 'Bio Mass', 'Coal for Industrial use', 'Other']
