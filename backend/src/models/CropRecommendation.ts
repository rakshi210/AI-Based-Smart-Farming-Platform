import mongoose, { Document, Schema } from 'mongoose';

export interface ICropRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  soilType: string;
  location: string;
  recommendedCrop: string;
  confidence: number;
  reason: string;
  farmingAdvice: string;
  alternativeCrops: string[];
  createdAt: Date;
  updatedAt: Date;
}

const cropRecommendationSchema = new Schema<ICropRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    nitrogen: {
      type: Number,
      required: [true, 'Nitrogen value is required'],
    },
    phosphorus: {
      type: Number,
      required: [true, 'Phosphorus value is required'],
    },
    potassium: {
      type: Number,
      required: [true, 'Potassium value is required'],
    },
    soilPh: {
      type: Number,
      required: [true, 'Soil pH value is required'],
    },
    temperature: {
      type: Number,
      required: [true, 'Temperature value is required'],
    },
    humidity: {
      type: Number,
      required: [true, 'Humidity value is required'],
    },
    rainfall: {
      type: Number,
      required: [true, 'Rainfall value is required'],
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    recommendedCrop: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    farmingAdvice: {
      type: String,
      required: true,
    },
    alternativeCrops: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const CropRecommendation = mongoose.model<ICropRecommendation>(
  'CropRecommendation',
  cropRecommendationSchema
);

