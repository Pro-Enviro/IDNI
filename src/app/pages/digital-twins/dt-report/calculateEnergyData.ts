
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
          const obj = row.find((cell: any)=>cell.name ===name);
          return obj && obj.value ? parseFloat(obj.value) : 0;
        }

        acc.totalValue += getValue('Value');
        acc.totalCost += getValue('Total');

        if (!acc.unit) {
          const unitObj = row.find((cell: any) => cell.name === 'Unit');
          acc.unit = unitObj && unitObj.value ? unitObj.value : ''
        }

        return acc;
      }, {totalValue: 0, totalCost: 0, unit: ''})


      return {
        type: fuelType.type,
        customConversionFactor: fuelType.customConversionFactor,
        totalValue: Number(summary.totalValue.toFixed(0)),
        totalCost: Number(summary.totalCost.toFixed(0)),
        emissions: Number((summary.totalValue * conversionFactors[fuelType.customConversionFactor]).toFixed(0)),
        unit: summary.unit
      };


    } catch(e) {
      console.error(e);
      return { type: fuelType.type, totalValue: 0, totalCost: 0, unit: 'Error', customConversionFactor: '' };
    }
  })
}


