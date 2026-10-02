import React, { useState } from 'react';
import { 
  FileText, 
  History, 
  Plus, 
  Activity, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Cloud, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppView, ClinicianProfile } from '../types';

interface NavProps {
  currentView: AppView;
  historyCount: number;
  user: User | null;
  profile: ClinicianProfile | null;
  authLoading: boolean;
  onNavigate: (view: AppView) => void;
  onNew: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Nav: React.FC<NavProps> = ({
  currentView,
  historyCount,
  user,
  profile,
  authLoading,
  onNavigate,
  onNew,
  onSignIn,
  onSignOut
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo / App Name */}
        <div 
          onClick={onNew}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
            <Activity className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 tracking-tight text-lg">
                CliniDoc AI
              </span>
              <span className="text-[11px] font-medium bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200/60 hidden sm:inline-block">
                Clinical Core
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Clinical Documentation & Extraction Engine
            </p>
          </div>
        </div>

        {/* Action Controls & Clinician Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Firestore Sync Badge for authenticated clinician */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firestore Synced</span>
            </div>
          )}

          {/* History CTA */}
          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === 'history'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-2xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
            }`}
            title="View Analyzed Reports History"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-slate-200 text-slate-800">
                {historyCount}
              </span>
            )}
          </button>

          {/* New + CTA */}
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold bg-teal-700 text-white hover:bg-teal-800 active:scale-98 transition-all shadow-xs"
            title="Create New Clinical Analysis"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New +</span>
          </button>

          {/* Authentication & Profile Section */}
          <div className="relative pl-1 border-l border-slate-200 ml-1">
            {authLoading ? (
              <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Clinician'}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                      {(user.displayName || user.email || 'Dr')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-slate-900 leading-tight">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-teal-700 font-medium">
                      {profile?.role || 'Clinician'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50 text-xs"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{user.displayName || 'Clinician'}</p>
                      <p className="text-slate-500 truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-medium text-[11px] border border-teal-200">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        <span>Role: {profile?.role || 'Clinician'}</span>
                      </div>
                    </div>

                    <div className="px-4 py-2 text-[11px] text-slate-500">
                      Document reports automatically persist to your Firestore profile.
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={onSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-2xs"
                title="Sign in with Clinician Account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Clinician Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
