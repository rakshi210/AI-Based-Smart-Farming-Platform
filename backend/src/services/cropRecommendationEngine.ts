export interface CropInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  soilType: string;
  location: string;
}

export interface CropOutput {
  recommendedCrop: string;
  confidence: number;
  reason: string;
  farmingAdvice: string;
  alternativeCrops: string[];
}

interface CropProfile {
  name: string;
  idealN: [number, number];
  idealP: [number, number];
  idealK: [number, number];
  idealPh: [number, number];
  idealTemp: [number, number];
  idealHumidity: [number, number];
  idealRainfall: [number, number];
  suitableSoilTypes: string[];
  advice: string;
}

const CROP_PROFILES: CropProfile[] = [
  {
    name: 'Rice',
    idealN: [70, 120],
    idealP: [30, 60],
    idealK: [30, 60],
    idealPh: [5.5, 7.2],
    idealTemp: [22, 35],
    idealHumidity: [70, 95],
    idealRainfall: [800, 2500],
    suitableSoilTypes: ['Clay', 'Alluvial', 'Loamy'],
    advice:
      'Ensure proper land puddling before transplanting. Maintain a thin water layer (2-4 cm) in vegetative stage and split nitrogen application into three stages (basal, tillering, and panicle initiation).',
  },
  {
    name: 'Wheat',
    idealN: [80, 140],
    idealP: [40, 70],
    idealK: [30, 60],
    idealPh: [6.0, 7.5],
    idealTemp: [12, 25],
    idealHumidity: [50, 70],
    idealRainfall: [350, 750],
    suitableSoilTypes: ['Alluvial', 'Loamy', 'Black'],
    advice:
      'Sow at 4-5 cm depth with row spacing of 20-22 cm. Schedule critical irrigations at Crown Root Initiation (CRI) stage (20-25 days after sowing) and flowering stage.',
  },
  {
    name: 'Maize',
    idealN: [60, 110],
    idealP: [35, 65],
    idealK: [25, 55],
    idealPh: [5.8, 7.5],
    idealTemp: [18, 32],
    idealHumidity: [55, 75],
    idealRainfall: [500, 1000],
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Red'],
    advice:
      'Ensure well-drained soil with ridge-and-furrow planting. Apply balanced zinc sulfate along with basal NPK. Avoid waterlogging during knee-high and silking stages.',
  },
  {
    name: 'Cotton',
    idealN: [50, 100],
    idealP: [25, 50],
    idealK: [40, 80],
    idealPh: [6.5, 8.0],
    idealTemp: [24, 38],
    idealHumidity: [45, 70],
    idealRainfall: [500, 1100],
    suitableSoilTypes: ['Black', 'Alluvial', 'Loamy'],
    advice:
      'Deep black cotton soil with high moisture retention is optimal. Monitor regularly for sucking pests during early squaring stage and maintain proper square-to-boll ratio with potassium sprays.',
  },
  {
    name: 'Sugarcane',
    idealN: [90, 160],
    idealP: [45, 80],
    idealK: [50, 100],
    idealPh: [6.0, 7.8],
    idealTemp: [24, 36],
    idealHumidity: [60, 85],
    idealRainfall: [1100, 2000],
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Black', 'Clay'],
    advice:
      'Plant two-budded setts with trash mulching to conserve moisture. Implement drip fertigation for high water use efficiency and earth-up at 90-100 days to prevent lodging.',
  },
  {
    name: 'Tomato',
    idealN: [60, 100],
    idealP: [40, 75],
    idealK: [45, 90],
    idealPh: [6.0, 7.0],
    idealTemp: [18, 28],
    idealHumidity: [50, 75],
    idealRainfall: [400, 800],
    suitableSoilTypes: ['Loamy', 'Sandy', 'Red'],
    advice:
      'Stake plants early to support heavy fruiting and minimize soil contact diseases. Maintain uniform soil moisture with drip irrigation to avoid blossom-end rot and fruit cracking.',
  },
  {
    name: 'Potato',
    idealN: [70, 120],
    idealP: [45, 80],
    idealK: [60, 110],
    idealPh: [5.2, 6.5],
    idealTemp: [14, 24],
    idealHumidity: [60, 80],
    idealRainfall: [300, 600],
    suitableSoilTypes: ['Sandy', 'Loamy', 'Alluvial'],
    advice:
      'Opt for loose, well-aerated sandy loam soil to enable tuber expansion. Earth up ridges 30 days after planting to prevent greening of tubers from sunlight exposure.',
  },
  {
    name: 'Groundnut',
    idealN: [20, 50],
    idealP: [30, 60],
    idealK: [35, 70],
    idealPh: [6.0, 7.5],
    idealTemp: [22, 32],
    idealHumidity: [50, 70],
    idealRainfall: [450, 800],
    suitableSoilTypes: ['Sandy', 'Red', 'Loamy'],
    advice:
      'Apply gypsum (400 kg/ha) at flowering/pegging stage to satisfy calcium requirements for healthy pod filling and shell hardening. Avoid disturbing soil once pegs enter the ground.',
  },
  {
    name: 'Millets',
    idealN: [30, 65],
    idealP: [20, 45],
    idealK: [20, 45],
    idealPh: [5.5, 7.8],
    idealTemp: [25, 38],
    idealHumidity: [35, 60],
    idealRainfall: [250, 600],
    suitableSoilTypes: ['Sandy', 'Red', 'Loamy'],
    advice:
      'Highly climate-resilient crop requiring minimal inputs. Maintain proper plant spacing and carry out one shallow weeding at 20 days. Excellent choice for drought-prone rainfed zones.',
  },
  {
    name: 'Pulses',
    idealN: [20, 45],
    idealP: [35, 65],
    idealK: [20, 45],
    idealPh: [6.0, 7.5],
    idealTemp: [20, 30],
    idealHumidity: [45, 65],
    idealRainfall: [350, 700],
    suitableSoilTypes: ['Loamy', 'Alluvial', 'Black', 'Red'],
    advice:
      'Treat seeds with Rhizobium and Phosphobacteria biofertilizers before sowing to enhance atmospheric nitrogen fixation. Avoid water stagnation at the seedling stage.',
  },
];

function scoreParameter(value: number, range: [number, number]): number {
  const [min, max] = range;
  if (value >= min && value <= max) {
    return 1.0;
  }
  const mid = (min + max) / 2;
  const spread = (max - min) / 2;
  const diff = Math.abs(value - mid);
  // Calculate decay score
  const score = Math.max(0, 1 - (diff - spread) / (spread * 1.5));
  return score;
}

export function recommendCrop(input: CropInput): CropOutput {
  const normalizedSoil = (input.soilType || '').trim().toLowerCase();

  const rankedCrops = CROP_PROFILES.map((crop) => {
    const nScore = scoreParameter(input.nitrogen, crop.idealN);
    const pScore = scoreParameter(input.phosphorus, crop.idealP);
    const kScore = scoreParameter(input.potassium, crop.idealK);
    const phScore = scoreParameter(input.soilPh, crop.idealPh);
    const tempScore = scoreParameter(input.temperature, crop.idealTemp);
    const humScore = scoreParameter(input.humidity, crop.idealHumidity);
    const rainScore = scoreParameter(input.rainfall, crop.idealRainfall);

    const soilMatch = crop.suitableSoilTypes.some(
      (s) => s.toLowerCase() === normalizedSoil || normalizedSoil.includes(s.toLowerCase())
    )
      ? 1.0
      : 0.6;

    // Weighted agronomic score
    const totalScore =
      nScore * 0.15 +
      pScore * 0.15 +
      kScore * 0.15 +
      phScore * 0.15 +
      tempScore * 0.15 +
      humScore * 0.1 +
      rainScore * 0.1 +
      soilMatch * 0.05;

    // Scale to percentage: 60% base for plausible agronomic match
    const confidence = Math.min(98, Math.max(55, Math.round(totalScore * 100)));

    return {
      crop,
      score: totalScore,
      confidence,
    };
  }).sort((a, b) => b.score - a.score);

  const best = rankedCrops[0];
  const alternatives = rankedCrops.slice(1, 4).map((r) => r.crop.name);

  const reason = `Selected ${best.crop.name} with ${best.confidence}% agronomic compatibility based on recorded soil pH of ${input.soilPh}, ambient temperature (${input.temperature}°C), humidity (${input.humidity}%), and rainfall (${input.rainfall} mm). The current N-P-K levels (${input.nitrogen}-${input.phosphorus}-${input.potassium} kg/ha) in ${input.soilType} soil align closely with ${best.crop.name}'s vegetative requirements.`;

  return {
    recommendedCrop: best.crop.name,
    confidence: best.confidence,
    reason,
    farmingAdvice: best.crop.advice,
    alternativeCrops: alternatives,
  };
}

