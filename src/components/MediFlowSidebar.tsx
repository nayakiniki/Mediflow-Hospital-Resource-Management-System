import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Stethoscope, 
  Bell, 
  Sparkles, 
  ShieldAlert, 
  UserCircle,
  Home,
  LogOut,
  LogIn,
  CheckCircle2,
  Briefcase,
  ChevronDown,
  Building,
  UserCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { MediFlowView, HospitalUserRole } from '../types';

interface MediFlowSidebarProps {
  currentView: MediFlowView;
  onNavigate: (view: MediFlowView) => void;
  unresolvedAlertsCount: number;
  activeRole: HospitalUserRole;
  onSelectRole: (role: HospitalUserRole) => void;
  user: {
    displayName?: string | null;
    email?: string | null;
    role?: string;
    department?: string;
    licenseId?: string;
  } | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const MediFlowSidebar: React.FC<MediFlowSidebarProps> = ({
  currentView,
  onNavigate,
  unresolvedAlertsCount,
  activeRole,
  onSelectRole,
  user,
  onSignIn,
  onSignOut
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const roles: { id: HospitalUserRole; title: string; subtitle: string; icon: string }[] = [
    { id: 'administrator', title: 'Hospital Administrator', subtitle: 'What is going wrong in my hospital today?', icon: '🏢' },
    { id: 'doctor', title: 'Doctor / Clinical Staff', subtitle: 'Which patients need attention first?', icon: '🩺' },
    { id: 'operations_manager', title: 'Operations & Bed Manager', subtitle: 'Where can I put the next patient?', icon: '🛏️' },
    { id: 'nursing_staff', title: 'Nursing Staff', subtitle: 'What needs to happen next?', icon: '📋' },
    { id: 'management', title: 'Executive Management', subtitle: 'How is the hospital performing?', icon: '📊' }
  ];

  const currentRoleInfo = roles.find((r) => r.id === activeRole) || roles[0];

  const navItems = [
    { id: 'dashboard' as MediFlowView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as MediFlowView, label: 'Patients', icon: Users },
    { id: 'beds' as MediFlowView, label: 'Beds', icon: Bed },
    { id: 'staff' as MediFlowView, label: 'Staff', icon: Stethoscope },
    { 
      id: 'alerts' as MediFlowView, 
      label: 'Alerts', 
      icon: Bell, 
      badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : undefined 
    },
    { id: 'insights' as MediFlowView, label: 'AI Insights', icon: Sparkles }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#14281E] via-[#0F1E16] to-[#0A1610] border-r border-white/10 flex flex-col justify-between shrink-0 select-none text-slate-300 shadow-[4px_0_30px_rgba(0,0,0,0.55),inset_-1px_0_0_rgba(255,255,255,0.08)]">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer group"
          >
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#E88F89] group-hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(232,143,137,0.3)]">
              MEDIFLOW
            </h2>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Command Center
            </p>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/15"
            title="Overview & Hero Page"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Role Selector (Backlog Section 2) */}
        <div className="p-3 border-b border-white/10">
          <button
            onClick={() => setRoleModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/15 text-left transition-all flex items-center justify-between group shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <div className="truncate pr-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Workspace Role
              </span>
              <span className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5 mt-0.5">
                <span>{currentRoleInfo.icon}</span>
                <span className="truncate">{currentRoleInfo.title}</span>
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 shrink-0" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'patients' && currentView === 'patient-detail');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#244633] to-[#1C3829] text-white border-t border-white/25 border-b border-black/50 shadow-[0_6px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E88F89]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Command Center / Admin View */}
      <div className="p-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 flex items-center justify-between mb-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-100 leading-tight">Command Center</p>
              <p className="text-[10px] text-emerald-400 font-mono">Operations Active</p>
            </div>
          </div>
        </div>

        {/* Firebase Staff Auth Status */}
        {user ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-[11px] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="truncate mr-2">
              <p className="font-semibold text-slate-100 truncate">
                {user.displayName && !user.displayName.toLowerCase().includes('nikita') && !user.displayName.toLowerCase().includes('nayak')
                  ? user.displayName
                  : 'Hospital Command Staff'}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono">Authorized Session</p>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#E88F89] text-slate-950 hover:bg-[#eb9d97] transition-all cursor-pointer glossy-button"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Staff Sign In / Register</span>
          </button>
        )}
      </div>

      {/* Role Switcher Modal (Backlog Section 2) */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 text-slate-800">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Welcome to MediFlow</span>
              <h3 className="text-lg font-bold text-slate-900">Select your workspace role</h3>
              <p className="text-xs text-slate-500 mt-0.5">Customizes workflows, primary focus metrics, and daily priorities.</p>
            </div>

            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRole(r.id);
                    setRoleModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    activeRole === r.id
                      ? 'border-[#1C3326] bg-[#EBF1E8] shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{r.title}</p>
                      {activeRole === r.id && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 italic mt-0.5">"{r.subtitle}"</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
