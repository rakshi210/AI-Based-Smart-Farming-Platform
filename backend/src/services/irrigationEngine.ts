export interface IrrigationInput {
  crop: string;
  soilMoisture: number; // percentage (0 - 100)
  temperature: number; // Celsius
  humidity: number; // percentage (0 - 100)
  rainfall: number; // mm
}

export interface IrrigationOutput {
  irrigationRequired: 'YES' | 'NO';
  suggestedLevel: string;
  reason: string;
}

export function recommendIrrigation(input: IrrigationInput): IrrigationOutput {
  const { crop, soilMoisture, temperature, humidity, rainfall } = input;
  const cropLower = (crop || '').toLowerCase();

  // Water need factor
  let moistureThreshold = 35; // Default threshold
  if (cropLower.includes('rice') || cropLower.includes('sugarcane')) {
    moistureThreshold = 55;
  } else if (cropLower.includes('tomato') || cropLower.includes('potato') || cropLower.includes('maize')) {
    moistureThreshold = 40;
  } else if (cropLower.includes('millet') || cropLower.includes('pulses') || cropLower.includes('groundnut')) {
    moistureThreshold = 28;
  }

  // Evapotranspiration stress indicator
  const highEvaporation = temperature > 32 && humidity < 50;
  const recentHeavyRain = rainfall >= 25;
  const saturatedSoil = soilMoisture >= 70;

  if (saturatedSoil || (recentHeavyRain && soilMoisture >= moistureThreshold)) {
    return {
      irrigationRequired: 'NO',
      suggestedLevel: 'None / Skip Irrigation',
      reason: `Soil moisture (${soilMoisture}%) is adequate or near saturation with recent/forecast rainfall of ${rainfall} mm. Applying additional water now risks root hypoxia and fungal rot for ${crop}.`,
    };
  }

  if (soilMoisture < moistureThreshold) {
    let level = 'Moderate Irrigation (25-35 mm)';
    if (soilMoisture < 20 || highEvaporation) {
      level = 'Immediate High Irrigation (40-50 mm)';
    }

    const stressNote = highEvaporation
      ? ` Combined with high temperature (${temperature}°C) and low humidity (${humidity}%), atmospheric water deficit is accelerating moisture depletion.`
      : '';

    return {
      irrigationRequired: 'YES',
      suggestedLevel: level,
      reason: `Current soil moisture (${soilMoisture}%) is beneath the optimal threshold (${moistureThreshold}%) for ${crop}.${stressNote} Irrigation is required to maintain cell turgidity and prevent wilting.`,
    };
  }

  // Borderline check
  if (soilMoisture < moistureThreshold + 8 && highEvaporation && rainfall < 5) {
    return {
      irrigationRequired: 'YES',
      suggestedLevel: 'Light Supplemental Irrigation (15-20 mm)',
      reason: `Soil moisture (${soilMoisture}%) is borderline adequate for ${crop}, but elevated ambient heat (${temperature}°C) with minimal rain (${rainfall} mm) will rapidly deplete root-zone water within 24-48 hours.`,
    };
  }

  return {
    irrigationRequired: 'NO',
    suggestedLevel: 'Adequate Moisture (Monitor Daily)',
    reason: `Soil moisture (${soilMoisture}%) remains within the comfortable root-zone range for ${crop}. Rainfall of ${rainfall} mm and atmospheric humidity (${humidity}%) are supporting steady transpiration.`,
  };
}

