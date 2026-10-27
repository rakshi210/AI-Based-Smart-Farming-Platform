import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  LayoutDashboard,
  Wheat,
  Droplets,
  FlaskConical,
  Activity,
  Bell,
  History,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-700 text-white shadow-sm'
        : 'text-emerald-50 hover:bg-emerald-800/80 hover:text-white'
    }`;

  const mobileItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
      isActive ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-emerald-900 border-b border-emerald-950/40 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                AgriSmart <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] text-emerald-300 font-medium tracking-wide uppercase block">
                Smart Farming Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/recommendations/crop" className={navItemClass}>
                <Wheat className="w-4 h-4" />
                <span>Crop Advisory</span>
              </NavLink>
              <NavLink to="/recommendations/irrigation" className={navItemClass}>
                <Droplets className="w-4 h-4" />
                <span>Irrigation</span>
              </NavLink>
              <NavLink to="/recommendations/fertilizer" className={navItemClass}>
                <FlaskConical className="w-4 h-4" />
                <span>Fertilizer</span>
              </NavLink>
              <NavLink to="/monitoring" className={navItemClass}>
                <Activity className="w-4 h-4" />
                <span>Monitoring</span>
              </NavLink>
              <NavLink to="/alerts" className={navItemClass}>
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
              </NavLink>
              <NavLink to="/history" className={navItemClass}>
                <History className="w-4 h-4" />
                <span>History</span>
              </NavLink>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="text-emerald-100 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Overview
              </Link>
            </div>
          )}

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1.5 rounded-lg text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-emerald-200">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-white block">{user.name}</span>
                    <span className="text-[11px] text-emerald-300 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {user.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-emerald-800/60 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 text-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-xl">
          {isAuthenticated && user && (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900">{user.name}</p>
                <p className="text-xs text-emerald-700 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {user.location} ({user.email})
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" /> Logout
              </button>
            </div>
          )}

          {isAuthenticated ? (
            <div className="space-y-1" onClick={() => setMobileMenuOpen(false)}>
              <NavLink to="/dashboard" className={mobileItemClass}>
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/recommendations/crop" className={mobileItemClass}>
                <Wheat className="w-4 h-4 text-emerald-600" />
                <span>Crop Recommendation</span>
              </NavLink>
              <NavLink to="/recommendations/irrigation" className={mobileItemClass}>
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Irrigation Advisory</span>
              </NavLink>
              <NavLink to="/recommendations/fertilizer" className={mobileItemClass}>
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Fertilizer Advisory</span>
              </NavLink>
              <NavLink to="/monitoring" className={mobileItemClass}>
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Field Monitoring</span>
              </NavLink>
              <NavLink to="/alerts" className={mobileItemClass}>
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Risk Alerts</span>
              </NavLink>
              <NavLink to="/history" className={mobileItemClass}>
                <History className="w-4 h-4 text-emerald-600" />
                <span>Advisory History</span>
              </NavLink>
            </div>
          ) : (
            <div className="space-y-2 pt-2" onClick={() => setMobileMenuOpen(false)}>
              <Link
                to="/login"
                className="block w-full text-center py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-2.5 rounded-lg bg-emerald-600 font-semibold text-white shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

