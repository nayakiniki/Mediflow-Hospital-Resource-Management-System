import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle2, ShieldAlert, Filter, Check, Clock } from 'lucide-react';
import { OperationalAlert } from '../types';

interface AlertsManagerViewProps {
  alerts: OperationalAlert[];
  onResolveAlert: (id: string) => void;
}

export const AlertsManagerView: React.FC<AlertsManagerViewProps> = ({
  alerts,
  onResolveAlert
}) => {
  const [filter, setFilter] = useState<'All' | 'Critical' | 'Warning' | 'Unresolved'>('Unresolved');

  const filtered = alerts.filter(a => {
    if (filter === 'Unresolved') return !a.resolved;
    if (filter === 'Critical') return a.severity === 'Critical';
    if (filter === 'Warning') return a.severity === 'Warning';
    return true;
  });

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F3729]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Hospital Operational & Clinical Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Real-time threshold breaches, capacity warnings, and required command center mitigations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['Unresolved', 'Critical', 'Warning', 'All'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filter === tab
                  ? 'bg-[#E88F89] text-slate-950 border-[#E88F89] shadow-xs'
                  : 'bg-[#13251B] text-slate-300 border-[#234230] hover:bg-[#183124]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all ${
              alert.resolved
                ? 'bg-[#112017]/50 border-[#1B3224] opacity-60'
                : alert.severity === 'Critical'
                ? 'bg-[#18261E] border-rose-900/80 shadow-md'
                : 'bg-[#182A20] border-amber-900/80 shadow-md'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <span className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                  alert.resolved
                    ? 'bg-slate-500'
                    : alert.severity === 'Critical'
                    ? 'bg-rose-500 animate-ping'
                    : 'bg-amber-400'
                }`} />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-white font-serif">{alert.title}</h3>
                    <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                      alert.resolved
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : alert.severity === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {alert.resolved ? 'Resolved' : alert.severity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1C3326] text-slate-300 border border-[#2C4838]">
                      {alert.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5">
                    Required Action: <strong className="text-white font-medium">{alert.actionRequired}</strong>
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1 font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Logged at {alert.timestamp} ({alert.timeAgo})</span>
                  </p>
                </div>
              </div>

              {!alert.resolved && (
                <button
                  onClick={() => onResolveAlert(alert.id)}
                  className="px-4 py-2 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#E88F89]/20 shrink-0 self-start sm:self-auto active:scale-95"
                >
                  Mark Acknowledged & Resolved
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-[#13251B] rounded-2xl border border-[#234230]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">All alerts in this category are resolved.</p>
            <p className="text-xs text-slate-400 mt-1">Hospital systems operating within standard baseline tolerances.</p>
          </div>
        )}
      </div>
    </div>
  );
};
