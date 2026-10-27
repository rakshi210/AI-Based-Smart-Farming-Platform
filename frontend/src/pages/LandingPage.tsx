import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wheat,
  Droplets,
  FlaskConical,
  Activity,
  Bell,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Database,
  CloudSun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Wheat className="w-6 h-6 text-emerald-600" />,
      title: 'Precision Crop Recommendation',
      description:
        'Multi-factor agronomic evaluation analyzing Nitrogen, Phosphorus, Potassium, soil pH, temperature, and rainfall to identify optimal crops with high yield viability.',
    },
    {
      icon: <Droplets className="w-6 h-6 text-emerald-600" />,
      title: 'Smart Irrigation Advisory',
      description:
        'Prevents water deficit and wasteful runoff by comparing crop moisture demands against real-time soil moisture and weather indicators.',
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-emerald-600" />,
      title: 'Soil-Specific Fertilizer Guidance',
      description:
        'Identifies exact macronutrient deficiencies (N-P-K) and recommends tailored basal and top-dressing categories alongside soil pH balancing advice.',
    },
    {
      icon: <Activity className="w-6 h-6 text-emerald-600" />,
      title: 'Live Field Monitoring',
      description:
        'Log and visualize vital microclimatic variables including root-zone moisture, ambient heat, humidity, and vegetative health scores over time.',
    },
    {
      icon: <Bell className="w-6 h-6 text-emerald-600" />,
      title: 'Pest & Environmental Risk Alerts',
      description:
        'Automated risk indicators alerting against critical moisture deficits, heat stress, waterlogging, and high-humidity pest/fungal disease vectors.',
    },
    {
      icon: <Database className="w-6 h-6 text-emerald-600" />,
      title: 'Persistent Cloud Storage',
      description:
        'All field readings, agronomic recommendations, and alerts are securely saved to MongoDB Atlas, ensuring complete session persistence and historical audit trails.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            AI-Based Smart Farming <br className="hidden sm:inline" />
            <span className="text-emerald-400">Recommendation & Field Monitoring</span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            A comprehensive MERN decision-support platform designed to help farmers make intelligent,
            data-backed agronomic decisions. Maximize crop productivity through precision soil matching,
            efficient irrigation scheduling, and real-time field risk monitoring.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold bg-emerald-400 text-emerald-950 hover:bg-emerald-300 transition-all shadow-lg hover:shadow-emerald-500/20"
              >
                <span>Go to Farmer Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold bg-emerald-400 text-emerald-950 hover:bg-emerald-300 transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-600/50 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Quick Architecture Indicators */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left border-t border-emerald-700/60">
            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/40">
              <span className="text-[11px] text-emerald-300 font-semibold uppercase block">Frontend</span>
              <span className="text-sm font-bold text-white">React + TypeScript</span>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/40">
              <span className="text-[11px] text-emerald-300 font-semibold uppercase block">Backend</span>
              <span className="text-sm font-bold text-white">Node.js + Express</span>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/40">
              <span className="text-[11px] text-emerald-300 font-semibold uppercase block">Database</span>
              <span className="text-sm font-bold text-white">MongoDB Atlas</span>
            </div>
            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-700/40">
              <span className="text-[11px] text-emerald-300 font-semibold uppercase block">Security</span>
              <span className="text-sm font-bold text-white">JWT + bcrypt Hashes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated Agricultural Capabilities
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            Every feature connects directly to the REST API and persists permanently to MongoDB Atlas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                <span>Verified with MongoDB Persistence</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Demo Presentation Note Banner */}
        <div className="mt-14 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-base">
                Ready for Live Academic Demonstration
              </h4>
              <p className="text-sm text-emerald-800">
                Register a new farmer account to test the real-time password policy, recommendation
                algorithms, and sensor monitoring workflow.
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="whitespace-nowrap px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            Create Farmer Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-300 font-semibold">
            <Wheat className="w-4 h-4 text-emerald-400" />
            <span>AI-Based Smart Farming Platform • College FSD Project</span>
          </div>
          <div>MERN Stack Architecture • Persistent MongoDB Atlas Database</div>
        </div>
      </footer>
    </div>
  );
};

