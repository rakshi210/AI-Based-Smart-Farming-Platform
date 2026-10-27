import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
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
  date: Date;
  relatedMonitoringId?: mongoose.Types.ObjectId;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    crop: {
      type: String,
      default: 'General Crop',
      trim: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
      default: 'Medium',
    },
    riskStatus: {
      type: String,
      enum: ['Risk Detected', 'Low Risk'],
      required: true,
      default: 'Risk Detected',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    immediateAction: {
      type: String,
      required: true,
      trim: true,
    },
    recommendedManagement: {
      type: String,
      required: true,
      trim: true,
    },
    alternativeOption: {
      type: String,
      required: true,
      trim: true,
    },
    monitoringAdvice: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    isRiskIndicator: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    relatedMonitoringId: {
      type: Schema.Types.ObjectId,
      ref: 'MonitoringData',
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
