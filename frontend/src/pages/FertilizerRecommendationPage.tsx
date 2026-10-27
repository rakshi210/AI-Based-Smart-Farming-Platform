import React, { useState } from 'react';
import { api } from '../services/api';
import { FertilizerRecommendationData } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FlaskConical, AlertTriangle, CheckCircle, Sparkles, HelpCircle } from 'lucide-react';

export const FertilizerRecommendationPage: React.FC = () => {
  const [crop, setCrop] = useState('Wheat');
  const [nitrogen, setNitrogen] = useState<number | ''>(45);
  const [phosphorus, setPhosphorus] = useState<number | ''>(20);
  const [potassium, setPotassium] = useState<number | ''>(55);
  const [soilPh, setSoilPh] = useState<number | ''>(5.6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<FertilizerRecommendationData | null>(null);

  const applyPreset = (preset: 'lowN' | 'balanced' | 'acidic') => {
    if (preset === 'lowN') {
      setCrop('Wheat');
      setNitrogen(30);
      setPhosphorus(50);
      setPotassium(45);
      setSoilPh(6.8);
    } else if (preset === 'acidic') {
      setCrop('Rice');
      setNitrogen(85);
      setPhosphorus(22);
      setPotassium(40);
      setSoilPh(5.1);
    } else {
      setCrop('Maize');
      setNitrogen(90);
      setPhosphorus(55);
      setPotassium(45);
      setSoilPh(6.6);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !crop.trim() ||
      nitrogen === '' ||
      phosphorus === '' ||
      potassium === '' ||
      soilPh === ''
    ) {
      setError('Please provide valid values for all soil parameters.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.recommendFertilizer({
        crop: crop.trim(),
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        soilPh: Number(soilPh),
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError('Failed to compute fertilizer recommendation.');
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
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Soil Nutrient Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Fertilizer & Soil Amendment Advisory
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Diagnose soil macronutrient deficits (Nitrogen, Phosphorus, Potassium) and pH imbalances
          to receive targeted fertilizer categories and organic amendment guidelines.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Demo Presets */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Quick Test Scenarios:</span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => applyPreset('lowN')}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🧪 Severe Nitrogen Deficit
          </button>
          <button
            type="button"
            onClick={() => applyPreset('acidic')}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            📉 Acidic Soil + Low Phosphorus
          </button>
          <button
            type="button"
            onClick={() => applyPreset('balanced')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            🌿 Balanced Healthy Soil
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Millets">Millets</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>

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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

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
                onChange={(e) =>
                  setPhosphorus(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

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
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl text-base font-bold text-white bg-amber-700 hover:bg-amber-800 transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <LoadingSpinner size="sm" message="Analyzing nutrient gaps & saving to MongoDB..." />
            ) : (
              <>
                <FlaskConical className="w-5 h-5" />
                <span>Calculate Fertilizer Recommendation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-amber-500 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Recommended Fertilizer Category
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {result.suggestedCategory}
              </h2>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase">
                Deficient Nutrients
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {result.deficientNutrients.map((nut, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-md"
                  >
                    {nut}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendation Note */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Nutrient Balancing Plan</span>
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {result.recommendation}
            </p>
          </div>

          {/* Warning Banner required by prompt */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Agricultural Advisory Disclaimer:</span>
              {result.advisoryWarning}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

