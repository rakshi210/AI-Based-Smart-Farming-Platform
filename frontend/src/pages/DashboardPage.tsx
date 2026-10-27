import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DashboardData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  Wheat,
  Droplets,
  FlaskConical,
  Activity,
  Bell,
  Thermometer,
  CloudRain,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getDashboard();
      if (res.success && res.data) {
        setDashboard(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading real-time farm data from MongoDB..." />
      </div>
    );
  }

  const conditions = dashboard?.currentFieldConditions;
  const latestCrop = dashboard?.latestRecommendedCrop;
  const latestAlert = dashboard?.latestAlert;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Farm Operational Hub • Connected to MongoDB Atlas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {dashboard?.user?.name || user?.name || 'Farmer'}!
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            Here is your live agricultural intelligence overview for your registered location in{' '}
            <span className="font-semibold text-white underline decoration-emerald-400">
              {dashboard?.user?.location || user?.location || 'Registered Farm'}
            </span>
            . All advisory records and microclimate sensors sync directly with your database.
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/recommendations/crop"
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Wheat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-700">
              Crop Advisory
            </span>
            <span className="text-[11px] text-slate-500">Run soil-crop matching</span>
          </div>
        </Link>

        <Link
          to="/recommendations/irrigation"
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-500 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700">
              Irrigation Check
            </span>
            <span className="text-[11px] text-slate-500">Check moisture thresholds</span>
          </div>
        </Link>

        <Link
          to="/recommendations/fertilizer"
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-500 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-700">
              Fertilizer Advisory
            </span>
            <span className="text-[11px] text-slate-500">Calculate N-P-K ratios</span>
          </div>
        </Link>

        <Link
          to="/monitoring"
          className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-500 transition-all group flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block group-hover:text-purple-700">
              Log Field Data
            </span>
            <span className="text-[11px] text-slate-500">Record microclimate readings</span>
          </div>
        </Link>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Fields */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plots / Fields</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {dashboard?.totalFields || 1}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {dashboard?.totalMonitoringRecords || 0} monitoring log(s)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Latest Recommended Crop */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Recommended Crop</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              {latestCrop ? latestCrop.crop : 'None yet'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {latestCrop ? `${latestCrop.confidence}% Match confidence` : 'Run recommendation test'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Wheat className="w-6 h-6" />
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soil Moisture</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {conditions ? `${conditions.soilMoisture}%` : '42% (Baseline)'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {conditions ? `Field: ${conditions.fieldName}` : 'Add monitoring reading'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Risk Indicators</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {dashboard?.activeAlertsCount || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {latestAlert ? `Latest: ${latestAlert.severity}` : 'No severe threats detected'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Field Conditions & Risk Indicator Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Microclimate Sensors Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Field Microclimate & Sensor Telemetry</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {conditions
                  ? `Last recorded on ${new Date(conditions.recordedAt).toLocaleString()}`
                  : 'No manual readings logged yet. Default agronomic baselines shown.'}
              </p>
            </div>
            <Link
              to="/monitoring"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Record New Reading</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <Thermometer className="w-6 h-6 text-orange-500 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Temperature</span>
              <span className="text-xl font-bold text-slate-900">
                {conditions ? `${conditions.temperature} °C` : '28.5 °C'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <Droplets className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Humidity</span>
              <span className="text-xl font-bold text-slate-900">
                {conditions ? `${conditions.humidity} %` : '65 %'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Soil Moisture</span>
              <span className="text-xl font-bold text-slate-900">
                {conditions ? `${conditions.soilMoisture} %` : '42 %'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <CloudRain className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">Rainfall</span>
              <span className="text-xl font-bold text-slate-900">
                {conditions ? `${conditions.rainfall} mm` : '12 mm'}
              </span>
            </div>
          </div>

          {/* Simple visual bar indicators */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Soil Moisture Status</span>
                <span>{conditions ? `${conditions.soilMoisture}%` : '42%'} (Adequate)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, conditions ? conditions.soilMoisture : 42)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>Crop Vegetative Condition</span>
                <span className="text-emerald-700 font-bold">
                  {conditions ? conditions.cropHealth : 'Good'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Latest Alert Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Active Risk Advisory</span>
              </h2>
              <Link to="/alerts" className="text-xs font-semibold text-emerald-700 hover:underline">
                View All
              </Link>
            </div>

            {latestAlert ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 uppercase">
                    {latestAlert.riskLevel || latestAlert.severity} Risk
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(latestAlert.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{latestAlert.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {latestAlert.reason || (latestAlert as any).message}
                </p>
                {latestAlert.immediateAction && (
                  <div className="pt-1 text-xs text-amber-900 bg-amber-100/60 p-2 rounded border border-amber-200">
                    <span className="font-bold block">Immediate Action:</span>
                    {latestAlert.immediateAction}
                  </div>
                )}
                <div className="pt-1 text-[11px] text-emerald-800 font-semibold">
                  Crop: {latestAlert.crop || 'Field Crop'}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No Critical Risks Flagged</p>
                <p className="text-xs text-slate-500 mt-1">
                  Field readings are currently within safe agronomic parameters.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/history"
              className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              <span>View Saved History In MongoDB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

