export interface StructuredPestRisk {
  crop: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskStatus: 'Risk Detected' | 'Low Risk';
  title: string;
  reason: string;
  immediateAction: string;
  recommendedManagement: string;
  alternativeOption: string;
  monitoringAdvice: string;
  severity: 'Low' | 'Medium' | 'High';
  isRiskIndicator: boolean;
}

export interface MonitoringAlertInput {
  crop?: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rainfall: number;
  cropHealth?: string;
}

export function evaluatePestAndFieldRisk(data: MonitoringAlertInput): StructuredPestRisk[] {
  const { temperature, humidity, soilMoisture, rainfall, cropHealth } = data;
  const crop = (data.crop || 'General Crop').trim();
  const cropLower = crop.toLowerCase();

  const results: StructuredPestRisk[] = [];

  // 1. High Humidity + Warm Temperature: Conducive to Fungal Pathogens & Sucking Pests
  if (humidity >= 78 && temperature >= 22 && temperature <= 34) {
    let specificPathogen = 'foliar fungal pathogens and sucking insect vectors';
    let specificAlt = 'Sticky traps, neem-based botanical spray, and pruning dense lower canopy';

    if (cropLower.includes('rice')) {
      specificPathogen = 'blast, sheath blight, and brown planthopper (BPH) proliferation';
      specificAlt = 'Alternate wetting and drying (AWD) irrigation and light-traps for planthoppers';
    } else if (cropLower.includes('tomato') || cropLower.includes('potato')) {
      specificPathogen = 'early/late blight, powdery mildew, and whitefly vectors';
      specificAlt = 'Removal of lower senescent leaves, copper-based organic protectants, and yellow sticky cards';
    } else if (cropLower.includes('cotton')) {
      specificPathogen = 'boll rot, anthracnose, and whitefly / jassid proliferation';
      specificAlt = 'Pheromone traps for bollworms and reflective mulches to deter sucking pests';
    } else if (cropLower.includes('wheat')) {
      specificPathogen = 'foliar rust, powdery mildew, and aphid colonies';
      specificAlt = 'Conserving ladybird beetle predators and avoiding excess nitrogenous top-dressing';
    }

    const isHigh = humidity > 85 || cropHealth === 'Stressed' || cropHealth === 'Poor';

    results.push({
      crop,
      riskLevel: isHigh ? 'High' : 'Medium',
      riskStatus: 'Risk Detected',
      title: `Pest & Fungal Disease Risk Indicator (${crop})`,
      reason: `High relative humidity (${humidity}%) paired with warm ambient temperature (${temperature}°C) creates favorable microclimatic conditions for ${specificPathogen}.`,
      immediateAction:
        'Inspect the undersides of leaves, stems, and lower canopy immediately for lesion spots, fungal webbing, or insect clusters. Manually prune and safely dispose of visibly damaged foliage.',
      recommendedManagement:
        'Implement Integrated Pest Management (IPM). Improve canopy aeration and drainage. If intervention becomes necessary, use only a crop- and pest-approved product according to the product label and local agricultural guidance. Consult local agricultural advisory officers before chemical application.',
      alternativeOption: specificAlt,
      monitoringAdvice:
        'Re-inspect vulnerable leaf margins and canopy humidity every 24 to 48 hours, especially during early morning hours after heavy dew condensation.',
      severity: isHigh ? 'High' : 'Medium',
      isRiskIndicator: true,
    });
  }

  // 2. Severe Soil Moisture Deficit / Drought Stress
  if (soilMoisture < 28) {
    const isCritical = soilMoisture < 20;
    results.push({
      crop,
      riskLevel: isCritical ? 'High' : 'Medium',
      riskStatus: 'Risk Detected',
      title: `Soil Moisture Deficit & Wilt Risk (${crop})`,
      reason: `Current root-zone soil moisture has fallen to ${soilMoisture}%. Low moisture combined with ambient heat (${temperature}°C) restricts nutrient uptake and induces cellular turgor loss.`,
      immediateAction:
        'Check soil depth at 10-15 cm around root zones immediately. Initiate scheduled irrigation before permanent wilting point is reached.',
      recommendedManagement:
        'Apply targeted drip or furrow irrigation to restore field capacity. Apply organic crop residue or straw mulch over exposed soil to suppress further evapotranspiration losses.',
      alternativeOption:
        'Irrigate during evening or early morning hours to minimize evaporative losses; introduce organic farmyard manure in future cycles to boost soil water retention.',
      monitoringAdvice:
        'Monitor soil moisture daily and watch for leaf curling or wilting during peak sunlight hours until moisture stabilizes above 40%.',
      severity: isCritical ? 'High' : 'Medium',
      isRiskIndicator: true,
    });
  }

  // 3. Excessive Rainfall / Waterlogging Stress
  if (rainfall >= 55 || soilMoisture >= 80) {
    results.push({
      crop,
      riskLevel: rainfall >= 75 ? 'High' : 'Medium',
      riskStatus: 'Risk Detected',
      title: `Waterlogging & Root Hypoxia Alert (${crop})`,
      reason: `Elevated precipitation (${rainfall} mm) and high moisture saturation (${soilMoisture}%) saturate pore spaces, depriving root zones of oxygen and predisposing seedlings to root rot.`,
      immediateAction:
        'Inspect field drainage furrows and clear out standing water channels immediately to prevent prolonged water ponding around stem collars.',
      recommendedManagement:
        'Ensure gentle surface drainage gradients. Avoid moving heavy machinery across the saturated plot to prevent destructive soil compaction.',
      alternativeOption:
        'Construct raised planting beds or broad bed-and-furrow (BBF) systems in upcoming seasons for naturally superior drainage.',
      monitoringAdvice:
        'Inspect stem bases for waterlogging-induced softening or chlorosis over the next 48 to 72 hours as drainage completes.',
      severity: rainfall >= 75 ? 'High' : 'Medium',
      isRiskIndicator: true,
    });
  }

  // 4. Heat Stress / Dry Sucking Pest Risk
  if (temperature >= 37) {
    results.push({
      crop,
      riskLevel: temperature >= 40 ? 'High' : 'Medium',
      riskStatus: 'Risk Detected',
      title: `Extreme Heat Stress & Sucking Pest Alert (${crop})`,
      reason: `Ambient temperature reached ${temperature}°C. Extreme thermal conditions accelerate blossom drop, reduce pollination efficacy, and favor thrip and spider mite infestations.`,
      immediateAction:
        'Inspect flowering nodes and young terminal shoots for heat scorching, flower drop, or fine webbing on leaf undersides.',
      recommendedManagement:
        'Provide light, frequent supplemental irrigations to cool the root microclimate. Implement temporary shade cloth or windbreak protections where practicable.',
      alternativeOption:
        'Apply light micro-sprinkler misting during midday peak heat and preserve inter-row living mulches to moderate soil surface temperature.',
      monitoringAdvice:
        'Check flower retention and blossom drop rates daily between 12:00 PM and 3:00 PM until temperature subsides below 35°C.',
      severity: temperature >= 40 ? 'High' : 'Medium',
      isRiskIndicator: true,
    });
  }

  // 5. If crop health is flagged as stressed/poor and no alert added yet
  if ((cropHealth === 'Stressed' || cropHealth === 'Poor') && results.length === 0) {
    results.push({
      crop,
      riskLevel: cropHealth === 'Poor' ? 'High' : 'Medium',
      riskStatus: 'Risk Detected',
      title: `Vegetative Health Decline Flagged (${crop})`,
      reason: `Field monitoring flagged crop condition as "${cropHealth}" under ambient temperature of ${temperature}°C and soil moisture of ${soilMoisture}%.`,
      immediateAction:
        'Conduct a thorough cross-examination of leaf coloration, stem integrity, and soil moisture to isolate nutritional vs. moisture deficits.',
      recommendedManagement:
        'Review recent fertilization and irrigation logs. Consider applying a balanced micronutrient or seaweed extract spray to support plant recovery under expert guidance.',
      alternativeOption:
        'Test root health for nematode or fungal root lesions before applying any chemical fertilizers.',
      monitoringAdvice:
        'Re-evaluate plant vigour and leaf coloration daily over the next 4 days.',
      severity: cropHealth === 'Poor' ? 'High' : 'Medium',
      isRiskIndicator: true,
    });
  }

  // 6. LOW RISK SCENARIO (Section 23 requirement)
  // When there is no significant risk detected, return a clear Low Risk recommendation
  if (results.length === 0) {
    results.push({
      crop,
      riskLevel: 'Low',
      riskStatus: 'Low Risk',
      title: `Stable Microclimate & Low Pest Risk (${crop})`,
      reason: `Monitored parameters (Temperature: ${temperature}°C, Humidity: ${humidity}%, Soil Moisture: ${soilMoisture}%, Rainfall: ${rainfall} mm) are comfortably within safe physiological ranges for ${crop}.`,
      immediateAction:
        'Continue regular monitoring. No immediate intervention is indicated based on the current parameters.',
      recommendedManagement:
        'Maintain regular field hygiene, balanced crop nutrition, and regular scouting routines. Inspect leaves and stems regularly.',
      alternativeOption:
        'Promote beneficial predatory insect habitat around field borders and maintain crop rotation plans.',
      monitoringAdvice:
        'Conduct standard visual crop inspections twice weekly during cool morning hours.',
      severity: 'Low',
      isRiskIndicator: false,
    });
  }

  return results;
}
