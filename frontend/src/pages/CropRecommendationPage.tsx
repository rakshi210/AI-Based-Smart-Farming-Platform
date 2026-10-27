import React, { useState } from 'react';
import { api } from '../services/api';
import { CropRecommendationData } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Wheat,
  CheckCircle,
  Sparkles,
  Info,
  MapPin,
  Compass,
  FileCheck2,
} from 'lucide-react';

export const CropRecommendationPage: React.FC = () => {
  const [nitrogen, setNitrogen] = useState<number | ''>(85);
  const [phosphorus, setPhosphorus] = useState<number | ''>(45);
  const [potassium, setPotassium] = useState<number | ''>(40);
  const [soilPh, setSoilPh] = useState<number | ''>(6.5);
  const [temperature, setTemperature] = useState<number | ''>(26);
  const [humidity, setHumidity] = useState<number | ''>(80);
  const [rainfall, setRainfall] = useState<number | ''>(1200);
  const [soilType, setSoilType] = useState('Alluvial');
  const [location, setLocation] = useState('Main Farm Sector A');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CropRecommendationData | null>(null);

  // Quick Demo Presets
  const applyPreset = (preset: 'rice' | 'wheat' | 'cotton' | 'tomato') => {
    if (preset === 'rice') {
      setNitrogen(90);
      setPhosphorus(45);
      setPotassium(40);
      setSoilPh(6.4);
      setTemperature(28);
      setHumidity(85);
      setRainfall(1350);
      setSoilType('Clay');
      setLocation('Paddy Wetland Basin');
    } else if (preset === 'wheat') {
      setNitrogen(110);
      setPhosphorus(55);
      setPotassium(45);
      setSoilPh(6.8);
      setTemperature(18);
      setHumidity(60);
      setRainfall(480);
      setSoilType('Alluvial');
      setLocation('Northern Field Plot 2');
    } else if (preset === 'cotton') {
      setNitrogen(75);
      setPhosphorus(40);
      setPotassium(65);
      setSoilPh(7.2);
      setTemperature(31);
      setHumidity(55);
      setRainfall(700);
      setSoilType('Black');
      setLocation('Deccan Black Soil Sector');
    } else if (preset === 'tomato') {
      setNitrogen(80);
      setPhosphorus(60);
      setPotassium(70);
      setSoilPh(6.2);
      setTemperature(23);
      setHumidity(65);
      setRainfall(550);
      setSoilType('Loamy');
      setLocation('Horticulture Greenbed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      nitrogen === '' ||
      phosphorus === '' ||
      potassium === '' ||
      soilPh === '' ||
      temperature === '' ||
      humidity === '' ||
      rainfall === '' ||
      !soilType ||
      !location.trim()
    ) {
      setError('Please provide valid values for all soil and environmental parameters.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.recommendCrop({
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        soilPh: Number(soilPh),
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: Number(rainfall),
        soilType,
        location: location.trim(),
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError('Failed to compute crop recommendation.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with backend recommendation engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Wheat className="w-3.5 h-3.5" />
          <span>Precision Agronomy Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Crop Recommendation
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Enter your soil chemical composition, climate parameters, and plot location. The
          rule-based recommendation engine calculates the best matched crop and saves the result to
          MongoDB Atlas.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Demo Preset Buttons for Quick Presentation Testing */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Quick Demo Test Presets:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPreset('rice')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🌾 Rice (High Rain/Clay)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('wheat')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🌿 Wheat (Cool/Alluvial)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('cotton')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🌱 Cotton (Black Soil)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('tomato')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🍅 Tomato (Loamy/Veg)
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Nitrogen */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nitrogen (N) (kg/ha)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                required
                value={nitrogen}
                onChange={(e) => setNitrogen(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Phosphorus (P) (kg/ha)
              </label>
              <input
                type="number"
                min="0"
                max="200"
                required
                value={phosphorus}
                onChange={(e) => setPhosphorus(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Potassium */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Potassium (K) (kg/ha)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                required
                value={potassium}
                onChange={(e) => setPotassium(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {/* Soil pH */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Soil pH (0 - 14)
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="10.0"
                required
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={temperature}
                onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Humidity */}
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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Rainfall */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Rainfall (mm)
              </label>
              <input
                type="number"
                min="0"
                max="4000"
                required
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Black">Black (Regur) Soil</option>
                <option value="Red">Red / Yellow Soil</option>
                <option value="Clay">Clay / Heavy Soil</option>
                <option value="Loamy">Loamy Soil</option>
                <option value="Sandy">Sandy Loam</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Field Location / Plot Name
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. North Plot #4"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" message="Computing agronomic match & saving to MongoDB..." />
            ) : (
              <>
                <Wheat className="w-5 h-5" />
                <span>Get Crop Recommendation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display Card */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Recommended Crop Match
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 flex items-center gap-3">
                <span>{result.recommendedCrop}</span>
                <span className="text-sm font-bold bg-emerald-700 text-white px-3 py-1 rounded-lg">
                  {result.confidence}% Match
                </span>
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 block">Saved to Database</span>
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 sm:justify-end">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ID: {result._id?.substring(0, 10)}...</span>
              </span>
            </div>
          </div>

          {/* Compatibility Bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>Agronomic Suitability Score</span>
              <span>{result.confidence}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {/* Reason */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Scientific Agronomic Rationale</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">{result.reason}</p>
          </div>

          {/* Farming Advice */}
          <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Recommended Farming Practices</span>
            </h4>
            <p className="text-sm text-emerald-950 leading-relaxed font-medium">
              {result.farmingAdvice}
            </p>
          </div>

          {/* Alternative Crops */}
          {result.alternativeCrops && result.alternativeCrops.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Viable Alternative Crops for this Soil</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.alternativeCrops.map((altCrop, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200"
                  >
                    {altCrop}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

