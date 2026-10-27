import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MonitoringDataRecord } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Activity,
  PlusCircle,
  Thermometer,
  Droplets,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  ShieldCheck,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export const MonitoringPage: React.FC = () => {
  const [records, setRecords] = useState<MonitoringDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form inputs
  const [fieldName, setFieldName] = useState('North Paddy Plot A');
  const [crop, setCrop] = useState('Rice');
  const [temperature, setTemperature] = useState<number | ''>(28.5);
  const [humidity, setHumidity] = useState<number | ''>(82);
  const [soilMoisture, setSoilMoisture] = useState<number | ''>(26);
  const [rainfall, setRainfall] = useState<number | ''>(5);
  const [cropHealth, setCropHealth] = useState<'Excellent' | 'Good' | 'Moderate' | 'Stressed' | 'Poor'>('Good');
  const [notes, setNotes] = useState('Routine morning canopy check');

  // Decision-support result from latest evaluation
  const [latestRisk, setLatestRisk] = useState<{
    riskLevel: 'Low' | 'Medium' | 'High';
    riskStatus: string;
    crop: string;
    title: string;
    reason: string;
    immediateAction: string;
    recommendedManagement: string;
    alternativeOption: string;
    monitoringAdvice: string;
  } | null>(null);

  const fetchMonitoringData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMonitoringData();
      if (res.success && res.data) {
        setRecords(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monitoring telemetry from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (
      temperature === '' ||
      humidity === '' ||
      soilMoisture === '' ||
      rainfall === ''
    ) {
      setError('Please provide all sensor telemetry readings.');
      return;
    }

    setSaving(true);

    try {
      const res = await api.saveMonitoringData({
        fieldName: fieldName.trim() || 'Main Farm Field',
        crop: crop.trim() || 'Rice',
        temperature: Number(temperature),
        humidity: Number(humidity),
        soilMoisture: Number(soilMoisture),
        rainfall: Number(rainfall),
        cropHealth,
        notes: notes.trim(),
      });

      if (res.success && res.data) {
        setSuccessMessage('Field monitoring data saved successfully to MongoDB Atlas.');
        if (res.riskEvaluation) {
          setLatestRisk(res.riskEvaluation);
        }
        await fetchMonitoringData();
      } else {
        setError(res.message || 'Failed to save monitoring data.');
      }
    } catch (err: any) {
      setError(err.message || 'Error saving to MongoDB.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-Time Sensor & Field Monitoring</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Field Monitoring & Pest Risk Decision Support
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Log microclimate sensor metrics, monitor moisture trends, and receive actionable
          pest/disease risk decision-support guidance. Saved permanently in MongoDB Atlas.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: Form and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form to Log New Data */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <PlusCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Add Field Reading</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Plot / Field Name
              </label>
              <input
                type="text"
                required
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g. North Plot A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Target Crop
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Cotton">Cotton</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Millets">Millets</option>
                <option value="Pulses">Pulses</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={humidity}
                  onChange={(e) =>
                    setHumidity(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Moisture (%)
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Rain (mm)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={rainfall}
                  onChange={(e) =>
                    setRainfall(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Crop Health Condition
              </label>
              <select
                value={cropHealth}
                onChange={(e) => setCropHealth(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Excellent">Excellent (Thriving)</option>
                <option value="Good">Good (Healthy)</option>
                <option value="Moderate">Moderate (Average)</option>
                <option value="Stressed">Stressed (Moisture/Heat deficit)</option>
                <option value="Poor">Poor (Visible wilting/damage)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Observation Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Visual crop inspection notes"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              {saving ? (
                <LoadingSpinner size="sm" message="Saving to MongoDB Atlas..." />
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Save Monitoring Log</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Actionable Pest Risk Decision Card (Sections 17-23) */}
        <div className="lg:col-span-2 space-y-6">
          {latestRisk ? (
            <div
              className={`bg-white rounded-2xl border-2 p-6 shadow-md space-y-4 transition-all ${
                latestRisk.riskLevel === 'High'
                  ? 'border-red-400'
                  : latestRisk.riskLevel === 'Medium'
                  ? 'border-amber-400'
                  : 'border-emerald-400'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide text-white ${
                      latestRisk.riskLevel === 'High'
                        ? 'bg-red-600'
                        : latestRisk.riskLevel === 'Medium'
                        ? 'bg-amber-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    PEST RISK: {latestRisk.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Status: {latestRisk.riskStatus}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Target Crop: <span className="font-bold text-slate-800">{latestRisk.crop}</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-900">{latestRisk.title}</h3>

              {/* Section 19: Why? */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Why?</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{latestRisk.reason}</p>
              </div>

              {/* Section 19: What Should I Do Now? */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>What Should I Do Now?</span>
                </span>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {latestRisk.immediateAction}
                </p>
              </div>

              {/* Section 20: Recommended Management / What Should I Use Now? */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>What should I use now? (Recommended Management)</span>
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {latestRisk.recommendedManagement}
                </p>
              </div>

              {/* Section 21: Alternative / Safer Option */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                  <span>Alternative / Safer Option</span>
                </span>
                <p className="text-xs text-blue-950 leading-relaxed">
                  {latestRisk.alternativeOption}
                </p>
              </div>

              {/* Monitor Again */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-2">
                <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">Monitor Again:</span>
                  {latestRisk.monitoringAdvice}
                </div>
              </div>

              {/* Academic Disclaimer Notice */}
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-100">
                AI-based risk indicator for agricultural decision-support. Consult local agricultural
                guidance or certified extension officers before any chemical treatment.
              </p>
            </div>
          ) : (
            /* Low-Risk / Default State before logging */
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-slate-900">
                  Pest & Disease Decision Support
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your field readings and click <strong>Save Monitoring Log</strong>. The
                decision-support engine evaluates microclimatic conditions against known fungal and
                insect pest vectors to provide practical, non-chemical, and IPM-guided recommendations.
              </p>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                <span className="font-bold block mb-1">Low Risk Baseline:</span>
                Continue regular monitoring. Inspect leaves and stems regularly. Maintain proper
                irrigation and field hygiene.
              </div>
            </div>
          )}

          {/* Visual Trend Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Recent Telemetry Logs</span>
                </h3>
                <p className="text-xs text-slate-500">Timeline of recorded field conditions</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                {records.length} Telemetry Records
              </span>
            </div>

            {records.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Activity className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs font-semibold">No monitoring logs recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {records.slice(0, 4).map((r, i) => (
                  <div key={r._id || i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-900">
                        {r.fieldName} ({r.crop || 'Crop'})
                      </span>
                      <span className="text-slate-500">
                        {new Date(r.recordedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-slate-600">
                      <span className="bg-white p-1 rounded border border-slate-200">
                        🌡️ {r.temperature} °C
                      </span>
                      <span className="bg-white p-1 rounded border border-slate-200">
                        💧 {r.humidity}%
                      </span>
                      <span className="bg-white p-1 rounded border border-slate-200 font-bold text-blue-700">
                        🌱 {r.soilMoisture}%
                      </span>
                      <span className="bg-white p-1 rounded border border-slate-200">
                        🌧️ {r.rainfall} mm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historical Data Table from MongoDB */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Saved Field Monitoring Records in MongoDB Atlas
          </h3>
          <button
            onClick={fetchMonitoringData}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="p-10 flex justify-center">
            <LoadingSpinner size="md" message="Loading records from MongoDB Atlas..." />
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No monitoring records found in MongoDB. Add a reading above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Field / Plot</th>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Humidity</th>
                  <th className="py-3 px-4">Soil Moisture</th>
                  <th className="py-3 px-4">Rainfall</th>
                  <th className="py-3 px-4">Crop Health</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(record.recordedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{record.fieldName}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {record.crop || 'Rice'}
                    </td>
                    <td className="py-3 px-4 text-slate-800">{record.temperature} °C</td>
                    <td className="py-3 px-4 text-slate-800">{record.humidity} %</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          record.soilMoisture < 25
                            ? 'bg-red-100 text-red-800'
                            : record.soilMoisture < 35
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {record.soilMoisture} %
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800">{record.rainfall} mm</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          record.cropHealth === 'Excellent' || record.cropHealth === 'Good'
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.cropHealth === 'Moderate'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.cropHealth}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {record.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
