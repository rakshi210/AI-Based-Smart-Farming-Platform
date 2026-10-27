import {
  AuthResponse,
  CropRecommendationData,
  IrrigationRecommendationData,
  FertilizerRecommendationData,
  MonitoringDataRecord,
  AlertRecord,
  DashboardData,
  HistoryItem,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('agri_smart_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('agri_smart_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('agri_smart_token');
  localStorage.removeItem('agri_smart_user');
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: `Network response was not valid JSON (${response.status} ${response.statusText})`,
  }));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as any;
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  register: (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    location: string;
  }): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProfile: (): Promise<{ success: boolean; user: any }> =>
    apiRequest<{ success: boolean; user: any }>('/auth/me'),

  // Dashboard
  getDashboard: (): Promise<{ success: boolean; data: DashboardData }> =>
    apiRequest<{ success: boolean; data: DashboardData }>('/dashboard'),

  // Recommendations
  recommendCrop: (payload: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilPh: number;
    temperature: number;
    humidity: number;
    rainfall: number;
    soilType: string;
    location: string;
  }): Promise<{ success: boolean; data: CropRecommendationData }> =>
    apiRequest<{ success: boolean; data: CropRecommendationData }>('/recommendations/crop', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  recommendIrrigation: (payload: {
    crop: string;
    soilMoisture: number;
    temperature: number;
    humidity: number;
    rainfall: number;
  }): Promise<{ success: boolean; data: IrrigationRecommendationData }> =>
    apiRequest<{ success: boolean; data: IrrigationRecommendationData }>('/recommendations/irrigation', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  recommendFertilizer: (payload: {
    crop: string;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    soilPh: number;
  }): Promise<{ success: boolean; data: FertilizerRecommendationData }> =>
    apiRequest<{ success: boolean; data: FertilizerRecommendationData }>('/recommendations/fertilizer', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getRecommendationHistory: (): Promise<{
    success: boolean;
    data: {
      total: number;
      items: HistoryItem[];
      cropCount: number;
      irrigationCount: number;
      fertilizerCount: number;
    };
  }> =>
    apiRequest<{
      success: boolean;
      data: {
        total: number;
        items: HistoryItem[];
        cropCount: number;
        irrigationCount: number;
        fertilizerCount: number;
      };
    }>('/recommendations/history'),

  // Monitoring
  saveMonitoringData: (payload: {
    fieldName?: string;
    crop?: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    rainfall: number;
    cropHealth: string;
    notes?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: MonitoringDataRecord;
    riskEvaluation?: {
      riskLevel: 'Low' | 'Medium' | 'High';
      riskStatus: string;
      crop: string;
      title: string;
      reason: string;
      immediateAction: string;
      recommendedManagement: string;
      alternativeOption: string;
      monitoringAdvice: string;
    };
    alertsTriggered: AlertRecord[];
  }> =>
    apiRequest<{
      success: boolean;
      message: string;
      data: MonitoringDataRecord;
      alertsTriggered: AlertRecord[];
    }>('/monitoring', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMonitoringData: (): Promise<{
    success: boolean;
    count: number;
    data: MonitoringDataRecord[];
  }> =>
    apiRequest<{
      success: boolean;
      count: number;
      data: MonitoringDataRecord[];
    }>('/monitoring'),

  // Alerts
  getAlerts: (): Promise<{
    success: boolean;
    count: number;
    data: AlertRecord[];
  }> =>
    apiRequest<{
      success: boolean;
      count: number;
      data: AlertRecord[];
    }>('/alerts'),

  resolveAlert: (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
    data: AlertRecord;
  }> =>
    apiRequest<{
      success: boolean;
      message: string;
      data: AlertRecord;
    }>(`/alerts/${id}/resolve`, {
      method: 'PATCH',
    }),

  // Health
  checkHealth: (): Promise<{
    status: string;
    service: string;
    database: { status: string; host?: string; name?: string };
  }> =>
    apiRequest<{
      status: string;
      service: string;
      database: { status: string; host?: string; name?: string };
    }>('/health'),
};

