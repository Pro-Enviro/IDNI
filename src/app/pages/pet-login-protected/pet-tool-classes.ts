import {
  CompanyModesOfTransport,
  FuelTypes,
  MaterialFormats,
  MaterialTypes, ModeOfTransport,
  OtherMaterials,
  OtherMetals, OtherModesOfTransport,
  Plastics, RegionsOfOrigin, Routes, StaffCommuteModes,
  SteelMaterials, UnitsOfCost,
  UnitsUom
} from "./pet-tool-types";

export class SubTable {
  cost: number = 0
  secondColumn: number = 0
  parent: { name: string, addRows: boolean, totalCost: number, secondColumn: number } = {
    name: '',
    totalCost: 0,
    secondColumn: 0,
    addRows: true
  }
}

export class MaterialRow extends SubTable {
  name: string = 'Material Type'
  type: MaterialTypes = 'Steel'
  subtype: SteelMaterials | OtherMetals | Plastics | OtherMaterials | undefined
  format: MaterialFormats | undefined
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  regionOfOrigin: RegionsOfOrigin = 'UK'
  scrappageAndWaste?: number = 0
}

export class BoughtInParts extends SubTable {
  name: string = 'Description of Part'
  noOfParts: number = 0
  unitOfCost: UnitsOfCost = 'Select'
  regionOfOrigin: RegionsOfOrigin = 'UK'
}

export class WaterUsage extends SubTable {
  name: string = 'Water Usage description '
  totalUnits: number = 0
  unitsUom: UnitsUom = 'Select'
}

export class Waste extends SubTable {
  name: string = 'Description of Waste stream'
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
}

export class RoadFreight extends SubTable {
  name: string = 'Road Freight description'
  mode: ModeOfTransport = 'Select'
  fuelType: FuelTypes = 'Select'
  approxMileage: number = 0
}

export class OtherFreightTransportation extends SubTable {
  name: string = 'Other Freight description'
  otherModes: OtherModesOfTransport = 'Select'
  route: Routes = 'Select'
  approxMileage = 0
}

export class CompanyTravel extends SubTable {
  name: string = 'Company Travel description'
  companyModeOfTransport: CompanyModesOfTransport = 'Select'
  approxMileage: number = 0;
}

export class StaffCommute {
  name: string = 'Staff Commute description'
  staffCommute: StaffCommuteModes = 'Select'
  percentStaff: number = 0
  distance: number = 0
  secondColumn: number = 0
  parent: { name: string, addRows: boolean, totalCost: number, secondColumn: number } = {
    name: '',
    totalCost: 0,
    secondColumn: 0,
    addRows: true
  }
}

// Generic export classes
export class TableRow {
  name: string = ''
  unitsUom: UnitsUom = 'Select'
  totalUnits: number = 0
  cost: number = 0
  unitOfCost: UnitsOfCost = 'Select'
  regionOfOrigin: RegionsOfOrigin = 'UK'
  parent?: { name: string, secondColumn: number, totalCost: number } = {
    name: '',
    secondColumn: 0,
    totalCost: 0
  }
}

export class GroupItem {
  name: string = ''
  value: number = 0;
  secondColumn = 0
  parent: { name: string, secondColumn: number } = {
    name: '',
    secondColumn: 0
  }
}

export class OtherExternalCosts extends SubTable {
  name: string = ''
}
