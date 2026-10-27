import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { MonitoringData } from '../models/MonitoringData.js';
import { Alert } from '../models/Alert.js';
import { evaluatePestAndFieldRisk } from '../services/alertEngine.js';

export const addMonitoringData = async (
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
      fieldName,
      crop,
      temperature,
      humidity,
      soilMoisture,
      rainfall,
      cropHealth,
      notes,
    } = req.body;

    if (
      temperature === undefined ||
      humidity === undefined ||
      soilMoisture === undefined ||
      rainfall === undefined
    ) {
      res.status(400).json({
        success: false,
        message: 'Temperature, humidity, soil moisture, and rainfall are required.',
      });
      return;
    }

    const temp = Number(temperature);
    const hum = Number(humidity);
    const moisture = Number(soilMoisture);
    const rain = Number(rainfall);
    const selectedCrop = crop ? String(crop).trim() : 'Rice';

    if (isNaN(temp) || isNaN(hum) || isNaN(moisture) || isNaN(rain)) {
      res.status(400).json({
        success: false,
        message: 'Temperature, humidity, soil moisture, and rainfall must be valid numbers.',
      });
      return;
    }

    // Save monitoring data into MongoDB
    const monitoringDoc = new MonitoringData({
      userId,
      fieldName: fieldName ? String(fieldName).trim() : 'Main Farm Field',
      crop: selectedCrop,
      temperature: temp,
      humidity: hum,
      soilMoisture: moisture,
      rainfall: rain,
      cropHealth: cropHealth || 'Good',
      notes: notes ? String(notes).trim() : '',
      recordedAt: new Date(),
    });

    await monitoringDoc.save();

    // Evaluate pest and environmental risk
    const riskCandidates = evaluatePestAndFieldRisk({
      crop: selectedCrop,
      temperature: temp,
      humidity: hum,
      soilMoisture: moisture,
      rainfall: rain,
      cropHealth: cropHealth || 'Good',
    });

    const createdAlerts = [];
    for (const candidate of riskCandidates) {
      const alertDoc = new Alert({
        userId,
        crop: candidate.crop,
        riskLevel: candidate.riskLevel,
        riskStatus: candidate.riskStatus,
        title: candidate.title,
        reason: candidate.reason,
        immediateAction: candidate.immediateAction,
        recommendedManagement: candidate.recommendedManagement,
        alternativeOption: candidate.alternativeOption,
        monitoringAdvice: candidate.monitoringAdvice,
        severity: candidate.severity,
        isRiskIndicator: candidate.isRiskIndicator,
        relatedMonitoringId: monitoringDoc._id,
        date: new Date(),
      });
      await alertDoc.save();
      createdAlerts.push(alertDoc);
    }

    // Primary risk evaluation to return to client
    const primaryRisk = riskCandidates[0];

    res.status(201).json({
      success: true,
      message: 'Field monitoring data saved successfully.',
      data: monitoringDoc,
      riskEvaluation: {
        riskLevel: primaryRisk.riskLevel,
        riskStatus: primaryRisk.riskStatus,
        crop: primaryRisk.crop,
        title: primaryRisk.title,
        reason: primaryRisk.reason,
        immediateAction: primaryRisk.immediateAction,
        recommendedManagement: primaryRisk.recommendedManagement,
        alternativeOption: primaryRisk.alternativeOption,
        monitoringAdvice: primaryRisk.monitoringAdvice,
      },
      alertsTriggered: createdAlerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to record monitoring data.',
    });
  }
};

export const getMonitoringData = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const records = await MonitoringData.find({ userId })
      .sort({ recordedAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve monitoring data.',
    });
  }
};
