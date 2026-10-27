export interface FertilizerInput {
  crop: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
}

export interface FertilizerOutput {
  deficientNutrients: string[];
  suggestedCategory: string;
  recommendation: string;
  advisoryWarning: string;
}

interface Benchmark {
  minN: number;
  minP: number;
  minK: number;
  idealPh: [number, number];
}

const CROP_BENCHMARKS: Record<string, Benchmark> = {
  rice: { minN: 80, minP: 35, minK: 35, idealPh: [5.5, 7.0] },
  wheat: { minN: 90, minP: 45, minK: 35, idealPh: [6.0, 7.5] },
  maize: { minN: 75, minP: 40, minK: 30, idealPh: [5.8, 7.2] },
  cotton: { minN: 65, minP: 30, minK: 50, idealPh: [6.5, 8.0] },
  sugarcane: { minN: 110, minP: 50, minK: 60, idealPh: [6.0, 7.8] },
  tomato: { minN: 70, minP: 45, minK: 55, idealPh: [6.0, 7.0] },
  potato: { minN: 80, minP: 50, minK: 70, idealPh: [5.2, 6.5] },
  groundnut: { minN: 25, minP: 35, minK: 40, idealPh: [6.0, 7.5] },
  millets: { minN: 35, minP: 25, minK: 25, idealPh: [5.5, 7.8] },
  pulses: { minN: 25, minP: 40, minK: 25, idealPh: [6.0, 7.5] },
};

export function recommendFertilizer(input: FertilizerInput): FertilizerOutput {
  const { crop, nitrogen, phosphorus, potassium, soilPh } = input;
  const cropKey = (crop || '').toLowerCase().trim();

  // Find matching benchmark or default
  let benchmark: Benchmark = { minN: 60, minP: 35, minK: 35, idealPh: [6.0, 7.2] };
  for (const [key, val] of Object.entries(CROP_BENCHMARKS)) {
    if (cropKey.includes(key)) {
      benchmark = val;
      break;
    }
  }

  const deficient: string[] = [];
  if (nitrogen < benchmark.minN) deficient.push('Nitrogen (N)');
  if (phosphorus < benchmark.minP) deficient.push('Phosphorus (P)');
  if (potassium < benchmark.minK) deficient.push('Potassium (K)');

  let phStatus = 'Optimal';
  let phAdvice = '';
  if (soilPh < benchmark.idealPh[0]) {
    phStatus = 'Acidic';
    phAdvice = ` Soil pH (${soilPh}) is below optimum (${benchmark.idealPh[0]}-${benchmark.idealPh[1]}); consider agricultural lime (calcium carbonate) or dolomite to alleviate acidity and unlock phosphorus absorption.`;
  } else if (soilPh > benchmark.idealPh[1]) {
    phStatus = 'Alkaline';
    phAdvice = ` Soil pH (${soilPh}) is above optimum (${benchmark.idealPh[0]}-${benchmark.idealPh[1]}); apply organic compost, gypsum, or elemental sulfur to moderate alkalinity and enhance micronutrient availability.`;
  }

  let suggestedCategory = 'Balanced Maintenance NPK';
  let recommendation = '';

  if (deficient.length === 3) {
    suggestedCategory = 'Complete NPK Complex (e.g. 19:19:19 or 20:20:20)';
    recommendation = `The soil demonstrates broad macronutrient deficits across Nitrogen, Phosphorus, and Potassium for ${crop}. Apply a well-balanced basal NPK compound fertilizer combined with well-rotted farmyard manure (FYM).${phAdvice}`;
  } else if (deficient.includes('Nitrogen (N)') && deficient.includes('Phosphorus (P)')) {
    suggestedCategory = 'Nitrogen-Phosphorus Formulation (e.g. DAP 18:46:0)';
    recommendation = `Soil exhibits joint deficiency in Nitrogen and Phosphorus. Diammonium Phosphate (DAP) or Urea + Single Super Phosphate (SSP) is recommended during land preparation.${phAdvice}`;
  } else if (deficient.includes('Nitrogen (N)')) {
    suggestedCategory = 'Nitrogen-Rich Fertilizer (e.g. Urea 46% N or Ammonium Sulphate)';
    recommendation = `Nitrogen level (${nitrogen} kg/ha) is deficient for ${crop}. Top-dress with Urea in split applications during vegetative growth to support vigorous tillering and leaf canopy.${phAdvice}`;
  } else if (deficient.includes('Phosphorus (P)')) {
    suggestedCategory = 'Phosphorus Fertilizer (e.g. Single Super Phosphate 16% P2O5)';
    recommendation = `Phosphorus level (${phosphorus} kg/ha) is deficient. Single Super Phosphate (SSP) applied at basal ploughing will stimulate early root development and seedling vigor.${phAdvice}`;
  } else if (deficient.includes('Potassium (K)')) {
    suggestedCategory = 'Potash Fertilizer (e.g. Muriate of Potash / MOP 60% K2O)';
    recommendation = `Potassium level (${potassium} kg/ha) is beneath optimal threshold. Muriate of Potash (MOP) application will fortify disease resistance, stem strength, and fruit/grain filling.${phAdvice}`;
  } else {
    suggestedCategory = 'Soil Maintenance & Organic Bio-Fertilizers';
    recommendation = `Current soil macronutrients (N: ${nitrogen}, P: ${phosphorus}, K: ${potassium} kg/ha) are within the healthy target range for ${crop}. Maintain soil microbiology using organic vermicompost, neem cake, and bio-fertilizers.${phAdvice}`;
  }

  const advisoryWarning =
    'Warning: This recommendation is a computational agronomic advisory based on standard baseline ranges. Always consult certified local agricultural extension officers or certified agronomists before physical field application to account for local soil textures and environmental regulations.';

  return {
    deficientNutrients: deficient.length > 0 ? deficient : ['None (Nutrients Adequate)'],
    suggestedCategory,
    recommendation,
    advisoryWarning,
  };
}
