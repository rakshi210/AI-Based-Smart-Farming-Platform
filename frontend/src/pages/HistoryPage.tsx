import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HistoryItem } from '../types';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  History,
  Wheat,
  Droplets,
  FlaskConical,
  Filter,
  Calendar,
  Database,
  ArrowUpRight,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [counts, setCounts] = useState({ total: 0, crop: 0, irrigation: 0, fertilizer: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'CROP' | 'IRRIGATION' | 'FERTILIZER'>('ALL');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getRecommendationHistory();
      if (res.success && res.data) {
        setItems(res.data.items || []);
        setCounts({
          total: res.data.total || 0,
          crop: res.data.cropCount || 0,
          irrigation: res.data.irrigationCount || 0,
          fertilizer: res.data.fertilizerCount || 0,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve recommendation history from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.type === activeTab;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CROP':
        return <Wheat className="w-5 h-5 text-emerald-600" />;
      case 'IRRIGATION':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'FERTILIZER':
        return <FlaskConical className="w-5 h-5 text-amber-600" />;
      default:
        return <Database className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'CROP':
        return 'bg-emerald-100 text-emerald-800';
      case 'IRRIGATION':
        return 'bg-blue-100 text-blue-800';
      case 'FERTILIZER':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold mb-2">
          <History className="w-3.5 h-3.5" />
          <span>MongoDB Persistent Archive</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Agronomic Recommendation History
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Complete historical record of all crop selections, irrigation advisories, and fertilizer
          calculations. All entries are permanently saved in MongoDB Atlas and survive browser reloads
          and server restarts.
        </p>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError('')} />

      {/* Tabs Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Recommendations ({counts.total})
          </button>
          <button
            onClick={() => setActiveTab('CROP')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              activeTab === 'CROP'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌾 Crops ({counts.crop})
          </button>
          <button
            onClick={() => setActiveTab('IRRIGATION')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              activeTab === 'IRRIGATION'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            💧 Irrigation ({counts.irrigation})
          </button>
          <button
            onClick={() => setActiveTab('FERTILIZER')}
            className={`px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer ${
              activeTab === 'FERTILIZER'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧪 Fertilizer ({counts.fertilizer})
          </button>
        </div>

        <button
          onClick={fetchHistory}
          className="text-xs font-semibold text-emerald-700 hover:underline px-3 py-1 cursor-pointer"
        >
          Refresh History
        </button>
      </div>

      {/* History Items */}
      {loading ? (
        <div className="p-16 flex justify-center">
          <LoadingSpinner size="lg" message="Loading persistent recommendations from MongoDB..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No History Records Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            You haven't run any recommendations in this category yet. Run a Crop, Irrigation, or
            Fertilizer recommendation to see permanent records stored here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${getTypeBadge(
                          item.type
                        )}`}
                      >
                        {item.type} Advisory
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h3>
                  </div>
                </div>

                {item.confidence && (
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {item.confidence}% Confidence
                    </span>
                  </div>
                )}
              </div>

              {/* Inputs & Outputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Inputs */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-600 block uppercase tracking-wider mb-2">
                    Recorded Input Parameters
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    {Object.entries(item.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between border-b border-slate-200/50 pb-1">
                        <span className="text-slate-500 capitalize">{k}:</span>
                        <span className="font-semibold text-slate-800">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation Outcome */}
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                  <span className="font-bold text-emerald-900 block uppercase tracking-wider mb-2">
                    System Recommendation Outcome
                  </span>
                  {item.result.reason && (
                    <p className="text-slate-700 leading-relaxed">{item.result.reason}</p>
                  )}
                  {item.result.advice && (
                    <p className="text-emerald-950 font-medium leading-relaxed">
                      💡 {item.result.advice}
                    </p>
                  )}
                  {item.result.recommendation && (
                    <p className="text-slate-800 leading-relaxed">{item.result.recommendation}</p>
                  )}
                  {item.result.suggestedLevel && (
                    <p className="font-bold text-blue-900">
                      Application Level: {item.result.suggestedLevel}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

