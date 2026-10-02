import React from 'react';
import { Loader2, FileSearch, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ProcessingStateProps {
  stage: number; // 0: Reading document..., 1: Extracting clinical data..., 2: Generating report...
  progressPercent: number;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ stage, progressPercent }) => {
  const stages = [
    {
      label: 'Reading document…',
      detail: 'Parsing textual structures, EHR format, and clinical entities',
      icon: FileSearch
    },
    {
      label: 'Extracting clinical data…',
      detail: 'Mapping patient demographics, vitals, diagnoses, and pharmacology',
      icon: Sparkles
    },
    {
      label: 'Generating report…',
      detail: 'Auditing allergy cross-reactivities, missing labs, and physician review flags',
      icon: ShieldAlert
    }
  ];

  const currentStageInfo = stages[stage] || stages[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
      {/* Center Card Swapped in the Same Shell */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
        {/* Animated Clinical Pulse & Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-teal-100/60 animate-ping opacity-75" />
          <div className="relative w-16 h-16 rounded-full bg-teal-50 border-2 border-teal-600 flex items-center justify-center text-teal-700 shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin text-teal-700" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight transition-all duration-300">
          {currentStageInfo.label}
        </h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto min-h-[40px] transition-all duration-300">
          {currentStageInfo.detail}
        </p>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-2">
            <span>Clinical Pipeline Progress</span>
            <span className="text-teal-700 font-mono">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-teal-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${Math.max(5, Math.min(100, progressPercent))}%` }}
            />
          </div>
        </div>

        {/* 3 Sub-States Step Indicator to ensure it doesn't feel stuck */}
        <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-3 gap-2 text-left">
          {stages.map((st, idx) => {
            const isDone = idx < stage;
            const isCurrent = idx === stage;
            const isPending = idx > stage;

            return (
              <div
                key={st.label}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-teal-400 bg-teal-50/60 shadow-2xs'
                    : isDone
                    ? 'border-slate-200 bg-slate-50/80 text-slate-700'
                    : 'border-slate-100 bg-transparent opacity-40'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-teal-700 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isCurrent ? 'text-teal-900' : isDone ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    Step {idx + 1}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                  {st.label.replace('…', '')}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] text-slate-400 font-mono">
          System validating adherence to standard clinical vocabularies & conflict matrices.
        </p>
      </div>
    </div>
  );
};
