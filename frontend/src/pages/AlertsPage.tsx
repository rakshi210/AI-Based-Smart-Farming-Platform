import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AlertRecord } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Info,
  Filter,
  Check,
  Clock,
  Calendar,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getAlerts();
      if (res.success && res.data) {
        setAlerts(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve alerts from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleResolve = async (id: string) => {
    try {
      const res = await api.resolveAlert(id);
      if (res.success && res.data) {
        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isResolved: res.data.isResolved } : a))
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to toggle alert status.');
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    const level = (a.riskLevel || a.severity || '').toUpperCase();
    return level === severityFilter.toUpperCase();
  });

  const getRiskBadge = (level?: string) => {
    const l = (level || 'Medium').toLowerCase();
    switch (l) {
      case 'high':
      case 'critical':
        return 'bg-red-600 text-white';
      case 'medium':
      case 'moderate':
        return 'bg-amber-600 text-white';
      case 'low':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold mb-2">
          <Bell className="w-3.5 h-3.5" />
          <span>Real-Time Environmental & Pest Risk Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Field Risk Alerts & Pest Decision Support
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Actionable risk indicators generated from sensor monitoring readings. Shows why risks were
          flagged, immediate actions, recommended management, alternative options, and monitoring schedules.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold block text-sm mb-0.5">Agricultural Advisory Notice:</span>
          Alerts represent AI-based risk indicators computed from your monitored field and
          microclimatic data to support timely decision-making. Always consider appropriate Integrated
          Pest Management (IPM) practices and consult local agricultural guidance or certified extension
          officers before chemical treatment.
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filter by Risk Level:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="p-16 flex justify-center">
          <LoadingSpinner size="lg" message="Loading alerts from MongoDB Atlas..." />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No Risk Alerts Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {severityFilter === 'ALL'
              ? 'Your monitored fields currently have no flagged environmental or microclimatic stress conditions.'
              : `No alerts with risk level "${severityFilter}" found in your MongoDB database.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all space-y-4 ${
                alert.isResolved ? 'border-slate-200 opacity-60 bg-slate-50/70' : 'border-amber-300'
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${getRiskBadge(
                      alert.riskLevel || alert.severity
                    )}`}
                  >
                    PEST RISK: {(alert.riskLevel || alert.severity || 'Medium').toUpperCase()} RISK
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Status: {alert.riskStatus || 'Risk Detected'}
                  </span>
                  {alert.crop && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Crop: {alert.crop}
                    </span>
                  )}
                  {alert.isResolved && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Resolved
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(alert.date).toLocaleString()}
                  </span>
                  <button
                    onClick={() => toggleResolve(alert._id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                      alert.isResolved
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>{alert.isResolved ? 'Reopen' : 'Acknowledge'}</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900">{alert.title}</h3>

              {/* Section 19: Why? */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-extrabold text-slate-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Why?</span>
                </span>
                <p className="text-slate-700 leading-relaxed">{alert.reason}</p>
              </div>

              {/* Section 19: What Should I Do Now? */}
              {alert.immediateAction && (
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs">
                  <span className="font-extrabold text-amber-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>What Should I Do Now?</span>
                  </span>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {alert.immediateAction}
                  </p>
                </div>
              )}

              {/* Section 20: Recommended Management */}
              {alert.recommendedManagement && (
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-extrabold text-emerald-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>What should I use now? (Recommended Management)</span>
                  </span>
                  <p className="text-emerald-950 leading-relaxed font-medium">
                    {alert.recommendedManagement}
                  </p>
                </div>
              )}

              {/* Section 21: Alternative / Safer Option */}
              {alert.alternativeOption && (
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs">
                  <span className="font-extrabold text-blue-900 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-blue-700" />
                    <span>Alternative / Safer Option</span>
                  </span>
                  <p className="text-blue-950 leading-relaxed">{alert.alternativeOption}</p>
                </div>
              )}

              {/* Monitor Again */}
              {alert.monitoringAdvice && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-2 text-xs">
                  <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-0.5">Monitor Again:</span>
                    <span className="text-slate-700">{alert.monitoringAdvice}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
