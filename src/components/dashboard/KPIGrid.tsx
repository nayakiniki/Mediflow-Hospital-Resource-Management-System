import React, { useState } from 'react';
import { 
  Users, 
  Bed, 
  Stethoscope, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  TrendingUp
} from 'lucide-react';
import { HospitalMetrics, MediFlowView } from '../../types';

interface KPIGridProps {
  metrics: HospitalMetrics;
  onNavigate?: (view: MediFlowView) => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({
  metrics,
  onNavigate
}) => {
  const [explainIcu, setExplainIcu] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Patients */}
      <div 
        onClick={() => onNavigate && onNavigate('patients')}
        className="glossy-card rounded-2xl p-5 cursor-pointer transform hover:-translate-y-1 active:translate-y-0 group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium group-hover:text-slate-100 transition-colors">Total Patients</span>
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {metrics.totalPatients}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.patientsTrendToday} today</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">Intake active</span>
          </div>
          {/* Subtle Progress Track with gloss */}
          <div className="w-full h-1.5 bg-[#0B1710] rounded-full mt-3 overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '74%' }} />
          </div>
        </div>
      </div>

      {/* Card 2: Available Beds */}
      <div 
        onClick={() => onNavigate && onNavigate('beds')}
        className="glossy-card rounded-2xl p-5 cursor-pointer transform hover:-translate-y-1 active:translate-y-0 group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium group-hover:text-slate-100 transition-colors">Available Beds</span>
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Bed className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {metrics.availableBeds}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-mono">
              {metrics.icuBedsAvailable} ICU beds free
            </span>
            <span className="text-[10px] font-mono text-slate-400">38 / 246 total</span>
          </div>
          <div className="w-full h-1.5 bg-[#0B1710] rounded-full mt-3 overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '38%' }} />
          </div>
        </div>
      </div>

      {/* Card 3: Doctors On Duty */}
      <div 
        onClick={() => onNavigate && onNavigate('staff')}
        className="glossy-card rounded-2xl p-5 cursor-pointer transform hover:-translate-y-1 active:translate-y-0 group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium group-hover:text-slate-100 transition-colors">Doctors On Duty</span>
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Stethoscope className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-mono font-bold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {metrics.doctorsOnDuty}
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-mono">
              {metrics.staffCoveragePercent}% coverage
            </span>
            <span className="text-[10px] font-mono text-slate-400">5 departments</span>
          </div>
          <div className="w-full h-1.5 bg-[#0B1710] rounded-full mt-3 overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${metrics.staffCoveragePercent}%` }} />
          </div>
        </div>
      </div>

      {/* Card 4: ICU Occupancy */}
      <div 
        className="glossy-card rounded-2xl p-5 relative group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium group-hover:text-slate-100 transition-colors">ICU Occupancy</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExplainIcu(!explainIcu);
            }}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            title="Explain this number"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-mono font-bold text-rose-400 tracking-tight drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">
            {metrics.icuOccupancyPercent}%
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-rose-400 font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8% since yesterday</span>
            </span>
            <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">Critical</span>
          </div>
          <div className="w-full h-1.5 bg-[#0B1710] rounded-full mt-3 overflow-hidden shadow-inner border border-white/5">
            <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" style={{ width: `${metrics.icuOccupancyPercent}%` }} />
          </div>
        </div>

        {explainIcu && (
          <div className="absolute top-12 left-0 right-0 z-30 p-3.5 bg-[#1A3426] border border-[#2C4838] rounded-xl text-xs text-slate-200 shadow-2xl space-y-1.5">
            <p className="font-bold text-white">ICU Occupancy Breakdown</p>
            <p className="text-[11px] text-slate-300">
              40 occupied out of 46 total ICU beds (87%). 12 critical triage admissions within the last 4 hours.
            </p>
            <button 
              onClick={() => setExplainIcu(false)}
              className="text-[10px] text-amber-300 underline font-semibold mt-1"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
