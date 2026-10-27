import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { IrrigationRecommendation } from '../models/IrrigationRecommendation.js';
import { FertilizerRecommendation } from '../models/FertilizerRecommendation.js';
import { recommendCrop } from '../services/cropRecommendationEngine.js';
import { recommendIrrigation } from '../services/irrigationEngine.js';
import { recommendFertilizer } from '../services/fertilizerEngine.js';

export const handleCropRecommendation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      nitrogen,
      phosphorus,
      potassium,
      soilPh,
      temperature,
      humidity,
      rainfall,
      soilType,
      location,
    } = req.body;

    if (
      nitrogen === undefined ||
      phosphorus === undefined ||
      potassium === undefined ||
      soilPh === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      rainfall === undefined ||
      !soilType ||
      !location
    ) {
      res.status(400).json({
        success: false,
        message: 'All fields (N, P, K, pH, temp, humidity, rainfall, soilType, location) are required.',
      });
      return;
    }

    const n = Number(nitrogen);
    const p = Number(phosphorus);
    const k = Number(potassium);
    const ph = Number(soilPh);
    const temp = Number(temperature);
    const hum = Number(humidity);
    const rain = Number(rainfall);

    if (
      isNaN(n) ||
      isNaN(p) ||
      isNaN(k) ||
      isNaN(ph) ||
      isNaN(temp) ||
      isNaN(hum) ||
      isNaN(rain)
    ) {
      res.status(400).json({
        success: false,
        message: 'Numerical values required for soil and environmental parameters.',
      });
      return;
    }

    const engineResult = recommendCrop({
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      soilPh: ph,
      temperature: temp,
      humidity: hum,
      rainfall: rain,
      soilType: String(soilType).trim(),
      location: String(location).trim(),
    });

    // Save to real MongoDB
    const record = new CropRecommendation({
      userId,
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      soilPh: ph,
      temperature: temp,
      humidity: hum,
      rainfall: rain,
      soilType: String(soilType).trim(),
      location: String(location).trim(),
      recommendedCrop: engineResult.recommendedCrop,
      confidence: engineResult.confidence,
      reason: engineResult.reason,
      farmingAdvice: engineResult.farmingAdvice,
      alternativeCrops: engineResult.alternativeCrops,
    });

    await record.save();

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process crop recommendation.',
    });
  }
};

export const handleIrrigationRecommendation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { crop, soilMoisture, temperature, humidity, rainfall } = req.body;

    if (
      !crop ||
      soilMoisture === undefined ||
      temperature === undefined ||
      humidity === undefined ||
      rainfall === undefined
    ) {
      res.status(400).json({
        success: false,
        message: 'All fields (crop, soilMoisture, temperature, humidity, rainfall) are required.',
      });
      return;
    }

    const moisture = Number(soilMoisture);
    const temp = Number(temperature);
    const hum = Number(humidity);
    const rain = Number(rainfall);

    if (isNaN(moisture) || isNaN(temp) || isNaN(hum) || isNaN(rain)) {
      res.status(400).json({
        success: false,
        message: 'Numerical values required for soil moisture, temperature, humidity, and rainfall.',
      });
      return;
    }

    const result = recommendIrrigation({
      crop: String(crop).trim(),
      soilMoisture: moisture,
      temperature: temp,
      humidity: hum,
      rainfall: rain,
    });

    // Save to MongoDB
    const record = new IrrigationRecommendation({
      userId,
      crop: String(crop).trim(),
      soilMoisture: moisture,
      temperature: temp,
      humidity: hum,
      rainfall: rain,
      irrigationRequired: result.irrigationRequired,
      suggestedLevel: result.suggestedLevel,
      reason: result.reason,
    });

    await record.save();

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process irrigation recommendation.',
    });
  }
};

export const handleFertilizerRecommendation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { crop, nitrogen, phosphorus, potassium, soilPh } = req.body;

    if (
      !crop ||
      nitrogen === undefined ||
      phosphorus === undefined ||
      potassium === undefined ||
      soilPh === undefined
    ) {
      res.status(400).json({
        success: false,
        message: 'All fields (crop, nitrogen, phosphorus, potassium, soilPh) are required.',
      });
      return;
    }

    const n = Number(nitrogen);
    const p = Number(phosphorus);
    const k = Number(potassium);
    const ph = Number(soilPh);

    if (isNaN(n) || isNaN(p) || isNaN(k) || isNaN(ph)) {
      res.status(400).json({
        success: false,
        message: 'Numerical values required for N, P, K, and soil pH.',
      });
      return;
    }

    const result = recommendFertilizer({
      crop: String(crop).trim(),
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      soilPh: ph,
    });

    // Save to MongoDB
    const record = new FertilizerRecommendation({
      userId,
      crop: String(crop).trim(),
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      soilPh: ph,
      deficientNutrients: result.deficientNutrients,
      suggestedCategory: result.suggestedCategory,
      recommendation: result.recommendation,
      advisoryWarning: result.advisoryWarning,
    });

    await record.save();

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process fertilizer recommendation.',
    });
  }
};

export const getRecommendationHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [cropHistory, irrigationHistory, fertilizerHistory] = await Promise.all([
      CropRecommendation.find({ userId }).sort({ createdAt: -1 }).lean(),
      IrrigationRecommendation.find({ userId }).sort({ createdAt: -1 }).lean(),
      FertilizerRecommendation.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    // Format all items into unified history records
    const unifiedHistory = [
      ...cropHistory.map((item) => ({
        id: item._id,
        type: 'CROP',
        title: `Crop: ${item.recommendedCrop}`,
        recommendedCrop: item.recommendedCrop,
        confidence: item.confidence,
        date: item.createdAt,
        inputs: {
          nitrogen: item.nitrogen,
          phosphorus: item.phosphorus,
          potassium: item.potassium,
          soilPh: item.soilPh,
          temperature: item.temperature,
          humidity: item.humidity,
          rainfall: item.rainfall,
          soilType: item.soilType,
          location: item.location,
        },
        result: {
          recommendedCrop: item.recommendedCrop,
          confidence: item.confidence,
          reason: item.reason,
          advice: item.farmingAdvice,
          alternatives: item.alternativeCrops,
        },
      })),
      ...irrigationHistory.map((item) => ({
        id: item._id,
        type: 'IRRIGATION',
        title: `Irrigation: ${item.crop} (${item.irrigationRequired})`,
        recommendedCrop: item.crop,
        date: item.createdAt,
        inputs: {
          crop: item.crop,
          soilMoisture: item.soilMoisture,
          temperature: item.temperature,
          humidity: item.humidity,
          rainfall: item.rainfall,
        },
        result: {
          irrigationRequired: item.irrigationRequired,
          suggestedLevel: item.suggestedLevel,
          reason: item.reason,
        },
      })),
      ...fertilizerHistory.map((item) => ({
        id: item._id,
        type: 'FERTILIZER',
        title: `Fertilizer: ${item.crop}`,
        recommendedCrop: item.crop,
        date: item.createdAt,
        inputs: {
          crop: item.crop,
          nitrogen: item.nitrogen,
          phosphorus: item.phosphorus,
          potassium: item.potassium,
          soilPh: item.soilPh,
        },
        result: {
          deficientNutrients: item.deficientNutrients,
          suggestedCategory: item.suggestedCategory,
          recommendation: item.recommendation,
          warning: item.advisoryWarning,
        },
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.status(200).json({
      success: true,
      data: {
        total: unifiedHistory.length,
        items: unifiedHistory,
        cropCount: cropHistory.length,
        irrigationCount: irrigationHistory.length,
        fertilizerCount: fertilizerHistory.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch recommendation history.',
    });
  }
};

