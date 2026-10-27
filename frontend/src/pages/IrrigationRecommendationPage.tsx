import React, { useState } from 'react';
import { api } from '../services/api';
import { IrrigationRecommendationData } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Droplets, AlertCircle, CheckCircle2, Sparkles, Info } from 'lucide-react';

export const IrrigationRecommendationPage: React.FC = () => {
  const [crop, setCrop] = useState('Rice');
  const [soilMoisture, setSoilMoisture] = useState<number | ''>(24);
  const [temperature, setTemperature] = useState<number | ''>(33);
  const [humidity, setHumidity] = useState<number | ''>(42);
  const [rainfall, setRainfall] = useState<number | ''>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<IrrigationRecommendationData | null>(null);

  const applyPreset = (preset: 'dry' | 'wet') => {
    if (preset === 'dry') {
      setCrop('Rice');
      setSoilMoisture(22);
      setTemperature(35);
      setHumidity(38);
      setRainfall(0);
    } else {
      setCrop('Wheat');
      setSoilMoisture(68);
      setTemperature(20);
      setHumidity(75);
      setRainfall(35);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !crop.trim() ||
      soilMoisture === '' ||
      temperature === '' ||
      humidity === '' ||
      rainfall === ''
    ) {
      setError('Please provide valid values for all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.recommendIrrigation({
        crop: crop.trim(),
        soilMoisture: Number(soilMoisture),
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: Number(rainfall),
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError('Failed to compute irrigation advisory.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <Droplets className="w-3.5 h-3.5" />
          <span>Hydrological Water Management</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Irrigation Recommendation
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Optimize crop water usage and eliminate over/under-watering. Recommendations compare root-zone
          soil moisture and atmospheric evapotranspiration against crop-specific hydration needs.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Demo Presets */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Quick Test Scenarios:</span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => applyPreset('dry')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            ☀️ Dry Soil Deficit (Requires YES)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('wet')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🌧️ Adequate / Rain Saturated (Requires NO)
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Rice">Rice (High Water Demand)</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane (High Water Demand)</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Millets">Millets (Low Water Demand)</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Current Soil Moisture (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={soilMoisture}
                onChange={(e) =>
                  setSoilMoisture(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Ambient Temperature (°C)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={temperature}
                onChange={(e) =>
                  setTemperature(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Humidity (%)
              </label>
              <input
                type="number"
                min="10"
                max="100"
                required
                value={humidity}
                onChange={(e) => setHumidity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Recent / Forecast Rainfall (mm)
              </label>
              <input
                type="number"
                min="0"
                max="500"
                required
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" message="Analyzing moisture balance & saving to MongoDB..." />
            ) : (
              <>
                <Droplets className="w-5 h-5" />
                <span>Compute Irrigation Advisory</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`bg-white rounded-2xl border-2 p-6 sm:p-8 shadow-xl space-y-6 ${
            result.irrigationRequired === 'YES' ? 'border-amber-500' : 'border-emerald-500'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Crop Water Decision
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-2xl font-black px-4 py-1 rounded-xl text-white ${
                    result.irrigationRequired === 'YES' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}
                >
                  IRRIGATION REQUIRED: {result.irrigationRequired}
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Suggested Application Level</span>
              <span className="text-base font-bold text-slate-900">{result.suggestedLevel}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Hydrological Analysis</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">{result.reason}</p>
          </div>

          <div className="flex items-center text-xs text-slate-500 border-t border-slate-100 pt-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            <span>Persisted permanently to MongoDB Atlas under Irrigation Recommendations collection.</span>
          </div>
        </div>
      )}
    </div>
  );
};

