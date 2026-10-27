import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Alert } from '../models/Alert.js';

export const getAlerts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const alerts = await Alert.find({ userId })
      .sort({ date: -1 })
      .populate('relatedMonitoringId')
      .lean();

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve alerts.',
    });
  }
};

export const resolveAlert = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const alert = await Alert.findOne({ _id: id, userId });
    if (!alert) {
      res.status(404).json({ success: false, message: 'Alert not found.' });
      return;
    }

    alert.isResolved = !alert.isResolved;
    await alert.save();

    res.status(200).json({
      success: true,
      message: `Alert marked as ${alert.isResolved ? 'resolved' : 'unresolved'}.`,
      data: alert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update alert status.',
    });
  }
};

