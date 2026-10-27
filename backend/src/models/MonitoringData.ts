import mongoose, { Document, Schema } from 'mongoose';

export interface IMonitoringData extends Document {
  userId: mongoose.Types.ObjectId;
  fieldName: string;
  crop: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rainfall: number;
  cropHealth: string;
  notes?: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const monitoringDataSchema = new Schema<IMonitoringData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fieldName: {
      type: String,
      default: 'Main Farm Field',
      trim: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop is required'],
      default: 'Rice',
      trim: true,
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity is required'],
    },
    soilMoisture: {
      type: Number,
      required: [true, 'Soil moisture is required'],
    },
    rainfall: {
      type: Number,
      required: [true, 'Rainfall is required'],
    },
    cropHealth: {
      type: String,
      required: [true, 'Crop health status is required'],
      enum: ['Excellent', 'Good', 'Moderate', 'Stressed', 'Poor'],
      default: 'Good',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const MonitoringData = mongoose.model<IMonitoringData>(
  'MonitoringData',
  monitoringDataSchema
);
