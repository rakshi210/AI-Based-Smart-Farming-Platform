export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  errors?: string[];
}

export interface CropRecommendationData {
  _id?: string;
  userId?: string;
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
  createdAt?: string;
}

export interface IrrigationRecommendationData {
  _id?: string;
  userId?: string;
  crop: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  irrigationRequired: 'YES' | 'NO';
  suggestedLevel: string;
  reason: string;
  createdAt?: string;
}

export interface FertilizerRecommendationData {
  _id?: string;
  userId?: string;
  crop: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPh: number;
  deficientNutrients: string[];
  suggestedCategory: string;
  recommendation: string;
  advisoryWarning: string;
  createdAt?: string;
}

export interface MonitoringDataRecord {
  _id: string;
  userId: string;
  fieldName: string;
  crop: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  rainfall: number;
  cropHealth: 'Excellent' | 'Good' | 'Moderate' | 'Stressed' | 'Poor';
  notes?: string;
  recordedAt: string;
  createdAt?: string;
}

export interface AlertRecord {
  _id: string;
  userId: string;
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
  date: string;
  isResolved: boolean;
  relatedMonitoringId?: any;
}

export interface DashboardData {
  user: User;
  totalFields: number;
  totalMonitoringRecords: number;
  activeAlertsCount: number;
  latestRecommendedCrop: {
    crop: string;
    confidence: number;
    date: string;
  } | null;
  currentFieldConditions: {
    fieldName: string;
    crop?: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    rainfall: number;
    cropHealth: string;
    recordedAt: string;
  } | null;
  latestAlert: {
    id: string;
    title: string;
    crop?: string;
    riskLevel?: string;
    riskStatus?: string;
    reason?: string;
    immediateAction?: string;
    recommendedManagement?: string;
    alternativeOption?: string;
    monitoringAdvice?: string;
    severity: string;
    date: string;
  } | null;
}

export interface HistoryItem {
  id: string;
  type: 'CROP' | 'IRRIGATION' | 'FERTILIZER';
  title: string;
  recommendedCrop: string;
  confidence?: number;
  date: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
}
