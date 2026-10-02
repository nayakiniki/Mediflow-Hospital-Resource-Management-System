import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { MediFlowView } from '../../types';

interface AttentionPanelProps {
  onNavigate: (view: MediFlowView) => void;
}

export const AttentionPanel: React.FC<AttentionPanelProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#1E3B2A]">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>WHAT NEEDS ATTENTION?</span>
        </span>
        <span className="text-xs text-slate-400 font-light">Prioritized operational bottlenecks requiring intervention</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Item 1 */}
        <div 
          onClick={() => onNavigate('patients')}
          className="p-4 rounded-xl bg-[#183124] border border-rose-900/60 hover:border-rose-500/80 transition-all cursor-pointer group hover:bg-[#1E3B2A] relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            <span>3 critical patients waiting</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Waiting times &gt; 30 min in triage ED</p>
          <div className="mt-3 text-[11px] font-semibold text-rose-300 group-hover:text-rose-200 flex items-center gap-1">
            <span>Review patient queue</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Item 2 */}
        <div 
          onClick={() => onNavigate('beds')}
          className="p-4 rounded-xl bg-[#183124] border border-amber-900/60 hover:border-amber-500/80 transition-all cursor-pointer group hover:bg-[#1E3B2A]"
        >
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>ICU capacity near threshold</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">87% occupied (6 beds free across units)</p>
          <div className="mt-3 text-[11px] font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1">
            <span>View bed allocator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Item 3 */}
        <div 
          onClick={() => onNavigate('staff')}
          className="p-4 rounded-xl bg-[#183124] border border-amber-900/60 hover:border-amber-500/80 transition-all cursor-pointer group hover:bg-[#1E3B2A]"
        >
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>2 doctor schedule conflicts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Dr. Patel overlapping shifts in ED</p>
          <div className="mt-3 text-[11px] font-semibold text-amber-300 group-hover:text-amber-200 flex items-center gap-1">
            <span>Resolve conflicts</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Item 4 */}
        <div 
          onClick={() => onNavigate('alerts')}
          className="p-4 rounded-xl bg-[#183124] border border-yellow-900/60 hover:border-yellow-500/80 transition-all cursor-pointer group hover:bg-[#1E3B2A]"
        >
          <div className="flex items-center gap-2 text-yellow-300 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
            <span>Oxygen inventory limit</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Approaching 4-day reserve threshold</p>
          <div className="mt-3 text-[11px] font-semibold text-yellow-300 group-hover:text-yellow-200 flex items-center gap-1">
            <span>View resources</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
