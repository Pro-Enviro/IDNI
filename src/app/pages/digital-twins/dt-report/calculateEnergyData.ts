interface FuelTypeData {
  type: string;
  customConversionFactor: string;
  rows: Array<Array<{ name: string; value: string; type: string }>>;
}

interface FuelTypeSummary {
  type: string;
  customConversionFactor: string;
  totalValue: number;
  totalCost: number;
  unit: string;
  converted?: boolean
}


export const conversionFactors: any = {
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

export const calculateEnergyData = (matchedCompanies: any) => {
  // Merge all fuel data in matched companies
  const data = matchedCompanies.flatMap((company: any) => company?.fuel_data)
  const fuelTypeSummaries = summariseFuelTypes(data);

  return fuelTypeSummaries;
}


const summariseFuelTypes = (fuelTypes: FuelTypeData[]): FuelTypeSummary[] => {
  return fuelTypes.map(fuelType => {
    try {
      const summary = fuelType.rows.reduce((acc, row) => {
        const getValue = (name: string) => {
          const obj = row.find((cell: any) => cell.name === name);
          return obj && obj.value ? parseFloat(obj.value) : 0;
        }

        acc.totalValue += getValue('Value');
        acc.totalCost += getValue('Total');

        if (!acc.unit) {
          const unitObj = row.find((cell: any) => cell.name === 'Unit');
          acc.unit = unitObj && unitObj.value ? unitObj.value : ''
        }

        return acc;
      }, {
        totalValue: 0, totalCost: 0, unit: '', converted: false
      })

      if (summary.unit !== 'kWh') {
        const convertedToKWH = convertToKwh(fuelType, summary.unit, summary.totalValue)

        if (convertedToKWH) {
          summary.totalValue = convertedToKWH
          summary.converted = true;
        }
      }

      return {
        type: fuelType.type,
        customConversionFactor: fuelType.customConversionFactor,
        totalValue: Number(summary.totalValue.toFixed(0)),
        totalCost: Number(summary.totalCost.toFixed(0)),
        emissions: Number((summary.totalValue * conversionFactors[fuelType.customConversionFactor]).toFixed(0)),
        unit: summary.unit,
        converted: summary.converted ?? true
      };


    } catch (e) {
      console.error(e);
      return {type: fuelType.type, totalValue: 0, totalCost: 0, unit: 'Error', customConversionFactor: ''};
    }
  })
}

const convertToKwh = (fuelType: any, unitFrom: string, consumption: number) => {

  if (!fuelType || !unitFrom || !consumption) return 0;

  const conversionFactor: any = {
    'LPG litres': 1.5571,
    'LPG kWh': 0.2145,
    'Gas oil (Red diesel) litres': 2.7554,
    'Gas oil (Red diesel) kWh': 0.2565,
    'Diesel (avg biofuel blend) litres': 2.5121,
    'Diesel (avg biofuel blend) kWh': 0.2391,
    'Burning oil (Kerosene) litres': 2.5402,
    'Burning oil (Kerosene) kWh': 0.2468,
    'Propane litres': 1.5436,
    'Propane kWh': 0.2326,
    'Petrol (avg biofuel blend) litres': 2.0975,
    'Petrol (avg biofuel blend) kWh': 0.2217,
    'Wood logs tonnes': 43.89327,
    'Wood logs kWh': 0.01074,
    'Wood Chips tonnes': 40.58114,
    'Wood Chips kWh': 0.01074,
    'Wood pellets tonnes': 51.56192,
    'Wood pallets kWh': 0.01074,
    // 'Propane kg': 0.5 // Add correct number
  }


  const litres = `${fuelType.customConversionFactor} ${unitFrom}`
  const kwh = `${fuelType.customConversionFactor} kWh`

  const convertNumber: number = consumption * conversionFactor[litres] / conversionFactor[kwh]


  if (isNaN(convertNumber)) return 0;

  return convertNumber
}
