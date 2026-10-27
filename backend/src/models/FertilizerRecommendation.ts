import mongoose, { Document, Schema } from 'mongoose';

export interface IFertilizerRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  crop: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
  deficientNutrients: string[];
  suggestedCategory: string;
  recommendation: string;
  advisoryWarning: string;
  createdAt: Date;
  updatedAt: Date;
}

const fertilizerRecommendationSchema = new Schema<IFertilizerRecommendation>(
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
    nitrogen: {
      type: Number,
      required: [true, 'Nitrogen level is required'],
    },
    phosphorus: {
      type: Number,
      required: [true, 'Phosphorus level is required'],
    },
    potassium: {
      type: Number,
      required: [true, 'Potassium level is required'],
    },
    soilPh: {
      type: Number,
      required: [true, 'Soil pH level is required'],
    },
    deficientNutrients: {
      type: [String],
      default: [],
    },
    suggestedCategory: {
      type: String,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    advisoryWarning: {
      type: String,
      default:
        'Warning: Agricultural advisory only. Consult local soil testing and agricultural extension experts before physical fertilizer application.',
    },
  },
  {
    timestamps: true,
  }
);

export const FertilizerRecommendation = mongoose.model<IFertilizerRecommendation>(
  'FertilizerRecommendation',
  fertilizerRecommendationSchema
);

