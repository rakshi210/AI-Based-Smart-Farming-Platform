import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { CropRecommendation } from '../models/CropRecommendation.js';
import { MonitoringData } from '../models/MonitoringData.js';
import { Alert } from '../models/Alert.js';

export const getDashboardSummary = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [user, latestCrop, latestMonitoring, latestAlert, monitoringCount, alertCount] =
      await Promise.all([
        User.findById(userId).select('name email location createdAt').lean(),
        CropRecommendation.findOne({ userId }).sort({ createdAt: -1 }).lean(),
        MonitoringData.findOne({ userId }).sort({ recordedAt: -1 }).lean(),
        Alert.findOne({ userId, isResolved: false }).sort({ date: -1 }).lean(),
        MonitoringData.countDocuments({ userId }),
        Alert.countDocuments({ userId, isResolved: false }),
      ]);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Determine field count: unique fieldNames or at least 1 if monitoring data exists
    const uniqueFields = await MonitoringData.distinct('fieldName', { userId });
    const totalFields = uniqueFields.length > 0 ? uniqueFields.length : 1;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          location: user.location,
        },
        totalFields,
        totalMonitoringRecords: monitoringCount,
        activeAlertsCount: alertCount,
        latestRecommendedCrop: latestCrop
          ? {
              crop: latestCrop.recommendedCrop,
              confidence: latestCrop.confidence,
              date: latestCrop.createdAt,
            }
          : null,
        currentFieldConditions: latestMonitoring
          ? {
              fieldName: latestMonitoring.fieldName,
              crop: (latestMonitoring as any).crop || 'General Crop',
              temperature: latestMonitoring.temperature,
              humidity: latestMonitoring.humidity,
              soilMoisture: latestMonitoring.soilMoisture,
              rainfall: latestMonitoring.rainfall,
              cropHealth: latestMonitoring.cropHealth,
              recordedAt: latestMonitoring.recordedAt,
            }
          : null,
        latestAlert: latestAlert
          ? {
              id: latestAlert._id,
              title: latestAlert.title,
              reason: latestAlert.reason,
              immediateAction: (latestAlert as any).immediateAction,
              recommendedManagement: (latestAlert as any).recommendedManagement,
              alternativeOption: (latestAlert as any).alternativeOption,
              monitoringAdvice: (latestAlert as any).monitoringAdvice,
              riskLevel: (latestAlert as any).riskLevel || latestAlert.severity,
              riskStatus: (latestAlert as any).riskStatus || 'Risk Detected',
              severity: latestAlert.severity,
              crop: (latestAlert as any).crop || 'General Crop',
              date: latestAlert.date,
            }
          : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to compile dashboard summary.',
    });
  }
};
