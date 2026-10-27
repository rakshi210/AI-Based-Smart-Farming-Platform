import mongoose, { Document, Schema } from 'mongoose';

export interface IIrrigationRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  crop: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  irrigationRequired: 'YES' | 'NO';
  suggestedLevel: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

const irrigationRecommendationSchema = new Schema<IIrrigationRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    soilMoisture: {
      type: Number,
      required: [true, 'Soil moisture percentage is required'],
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature is required'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity is required'],
    },
    rainfall: {
      type: Number,
      required: [true, 'Rainfall value is required'],
    },
    irrigationRequired: {
      type: String,
      enum: ['YES', 'NO'],
      required: true,
    },
    suggestedLevel: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const IrrigationRecommendation = mongoose.model<IIrrigationRecommendation>(
  'IrrigationRecommendation',
  irrigationRecommendationSchema
);

