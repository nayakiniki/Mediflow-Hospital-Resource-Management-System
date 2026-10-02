import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Layers, 
  AlertTriangle, 
  X,
  Play
} from 'lucide-react';

interface AIInsightsViewProps {
  onPrepareBeds: () => void;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({ onPrepareBeds }) => {
  // Scenario Planner State (Backlog Item #17)
  const [activeScenario, setActiveScenario] = useState<'admissions' | 'icu-outage' | 'stay-length' | 'custom'>('admissions');
  const [admissionsDelta, setAdmissionsDelta] = useState(15);
  const [bedsUnavailable, setBedsUnavailable] = useState(10);
  const [losDelta, setLosDelta] = useState(1);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [scenarioExecuted, setScenarioExecuted] = useState(false);

  // Dynamic calculated projections based on scenario
  let projectedIcu = 87;
  let projectedBeds = 38;
  let projectedWait = '24 min';
  let riskLevel = 'Moderate';

  if (activeScenario === 'admissions') {
    projectedIcu = 96;
    projectedBeds = 21;
    projectedWait = '39 min';
    riskLevel = 'Critical Surge';
  } else if (activeScenario === 'icu-outage') {
    projectedIcu = 98;
    projectedBeds = 18;
    projectedWait = '45 min';
    riskLevel = 'Severe Bottleneck';
  } else if (activeScenario === 'stay-length') {
    projectedIcu = 93;
    projectedBeds = 26;
    projectedWait = '34 min';
    riskLevel = 'High Pressure';
  } else {
    projectedIcu = Math.min(100, Math.round(87 + admissionsDelta * 0.4 + bedsUnavailable * 0.8 + losDelta * 3));
    projectedBeds = Math.max(0, Math.round(38 - bedsUnavailable - admissionsDelta * 0.6));
    projectedWait = `${Math.round(24 + admissionsDelta * 0.8 + losDelta * 5)} min`;
    riskLevel = projectedIcu > 95 ? 'Critical Surge' : 'High Pressure';
  }

  const handleRunScenario = (sc: 'admissions' | 'icu-outage' | 'stay-length') => {
    setActiveScenario(sc);
    setScenarioExecuted(true);
    setTimeout(() => setScenarioExecuted(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F3729]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Operational Forecasting & Scenario Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Simulate intake surges, bed availability shocks, length-of-stay fluctuations, and mitigation levers
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 text-amber-300 text-xs font-semibold border border-amber-700/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] uppercase">Surge Model Active (v4.2)</span>
        </div>
      </div>

      {/* Primary Telemetry Insight Card */}
      <div className="bg-[#13251B] rounded-2xl p-6 sm:p-8 border border-[#234230] shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1C3326] text-amber-300 flex items-center justify-center shrink-0 border border-[#2C4838]">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#E88F89]">
              Live Forecast Projection
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              ICU demand is projected to reach 94% capacity by 15:45 PM.
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed font-light">
              Based on ED intake velocity, post-operative recovery schedules, and deteriorating severity scores in telemetry step-down units (notably Patients P-1024, P-1098, and P-1045), ICU bed availability will reduce from 6 beds to 1 bed within 6 hours.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#183124] p-5 rounded-xl border border-[#274633]">
            <span className="text-xs text-slate-400 font-mono">Recommended Surge Prep</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">+6 Additional Beds</p>
            <p className="text-xs text-emerald-400 mt-1">Activate StepDown Ward 4B</p>
          </div>

          <div className="bg-[#183124] p-5 rounded-xl border border-[#274633]">
            <span className="text-xs text-slate-400 font-mono">Staffing Reallocation</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">+2 Critical Care RNs</p>
            <p className="text-xs text-emerald-400 mt-1">Float from General Post-Op</p>
          </div>

          <div className="bg-[#183124] p-5 rounded-xl border border-[#274633]">
            <span className="text-xs text-slate-400 font-mono">Model Confidence</span>
            <p className="text-xl font-bold text-white mt-1 font-mono">94.2%</p>
            <p className="text-xs text-slate-400 mt-1">Calibrated on 14,200 Admissions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1E3B2A]">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Operational decision automation ready for clinician sign-off</span>
          </div>
          <button
            onClick={onPrepareBeds}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#E88F89]/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Execute Surge Protocol (+6 Beds)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Occupancy "What-If" Scenario Planner (Backlog Item #17) */}
      <div className="bg-[#13251B] rounded-2xl p-6 sm:p-8 border border-[#234230] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3B2A] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Interactive Simulation
            </span>
            <h3 className="text-xl font-serif font-bold text-white mt-0.5">
              Occupancy "What-If" Scenario Planner
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Test operational resilience before bottlenecks manifest in real ward conditions.
            </p>
          </div>

          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1C3326] hover:bg-[#234230] text-slate-200 border border-[#2F523C] text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Layers className="w-3.5 h-3.5 text-[#E88F89]" />
            <span>Compare Scenarios</span>
          </button>
        </div>

        {/* 3 Quick Scenarios Presets */}
        <div className="space-y-3">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Select a Scenario Question:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Scenario 1 */}
            <div
              onClick={() => handleRunScenario('admissions')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeScenario === 'admissions'
                  ? 'bg-[#183124] border-[#E88F89] shadow-md shadow-[#E88F89]/10'
                  : 'bg-[#183124]/60 border-[#274633] hover:border-[#38644A]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>Surge Influx</span>
                {activeScenario === 'admissions' && <span className="text-[#E88F89]">Active</span>}
              </div>
              <p className="text-xs text-slate-300">
                What happens if admissions increase by <strong>+15%</strong>?
              </p>
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => handleRunScenario('icu-outage')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeScenario === 'icu-outage'
                  ? 'bg-[#183124] border-[#E88F89] shadow-md shadow-[#E88F89]/10'
                  : 'bg-[#183124]/60 border-[#274633] hover:border-[#38644A]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>Bed Shock</span>
                {activeScenario === 'icu-outage' && <span className="text-[#E88F89]">Active</span>}
              </div>
              <p className="text-xs text-slate-300">
                What happens if <strong>10 ICU beds</strong> become unavailable?
              </p>
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => handleRunScenario('stay-length')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeScenario === 'stay-length'
                  ? 'bg-[#183124] border-[#E88F89] shadow-md shadow-[#E88F89]/10'
                  : 'bg-[#183124]/60 border-[#274633] hover:border-[#38644A]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                <span>LOS Extended</span>
                {activeScenario === 'stay-length' && <span className="text-[#E88F89]">Active</span>}
              </div>
              <p className="text-xs text-slate-300">
                What happens if average length of stay increases by <strong>1 day</strong>?
              </p>
            </div>
          </div>
        </div>

        {/* PROJECTED IMPACT DISPLAY (Backlog Item #17) */}
        <div className="p-5 rounded-2xl bg-[#0F1E16] border border-[#234230] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E88F89] flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 fill-current" />
              PROJECTED IMPACT SIMULATION RESULTS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold">
              {riskLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Impact 1: ICU Occupancy */}
            <div className="p-4 rounded-xl bg-[#183124] border border-[#274633]">
              <span className="text-xs text-slate-400 font-mono">ICU Occupancy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg text-slate-400 font-mono">87%</span>
                <span className="text-xs text-rose-400 font-mono">→</span>
                <span className="text-2xl font-bold text-rose-400 font-mono">{projectedIcu}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Exceeds critical alert threshold</p>
            </div>

            {/* Impact 2: Available Beds */}
            <div className="p-4 rounded-xl bg-[#183124] border border-[#274633]">
              <span className="text-xs text-slate-400 font-mono">Available Beds</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg text-slate-400 font-mono">38</span>
                <span className="text-xs text-amber-400 font-mono">→</span>
                <span className="text-2xl font-bold text-amber-300 font-mono">{projectedBeds}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Severe ward depletion buffer</p>
            </div>

            {/* Impact 3: Expected Wait */}
            <div className="p-4 rounded-xl bg-[#183124] border border-[#274633]">
              <span className="text-xs text-slate-400 font-mono">Expected ED Wait</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg text-slate-400 font-mono">24m</span>
                <span className="text-xs text-rose-400 font-mono">→</span>
                <span className="text-2xl font-bold text-rose-400 font-mono">{projectedWait}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Non-compliant with CMS guidelines</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Scenarios Modal (Backlog Item #17) */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-3xl w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
                  Comparative Resilience Analysis
                </span>
                <h3 className="text-lg font-serif font-bold text-white">Compare Operational Scenarios</h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#234230]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#183124] border-b border-[#1E3B2A] text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Baseline (Now)</th>
                    <th className="py-3 px-4 text-rose-300">Admissions +15%</th>
                    <th className="py-3 px-4 text-amber-300">10 ICU Beds Down</th>
                    <th className="py-3 px-4 text-cyan-300">LOS +1 Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A3325] font-mono">
                  <tr>
                    <td className="py-3 px-4 text-slate-300 font-sans font-bold">ICU Occupancy</td>
                    <td className="py-3 px-4 text-slate-300">87%</td>
                    <td className="py-3 px-4 font-bold text-rose-400">96%</td>
                    <td className="py-3 px-4 font-bold text-rose-400">98%</td>
                    <td className="py-3 px-4 font-bold text-amber-400">93%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-300 font-sans font-bold">Available Beds</td>
                    <td className="py-3 px-4 text-slate-300">38</td>
                    <td className="py-3 px-4 font-bold text-rose-400">21</td>
                    <td className="py-3 px-4 font-bold text-rose-400">18</td>
                    <td className="py-3 px-4 font-bold text-amber-400">26</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-300 font-sans font-bold">Expected Wait</td>
                    <td className="py-3 px-4 text-slate-300">24m</td>
                    <td className="py-3 px-4 font-bold text-rose-400">39m</td>
                    <td className="py-3 px-4 font-bold text-rose-400">45m</td>
                    <td className="py-3 px-4 font-bold text-amber-400">34m</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-300 font-sans font-bold">Required Mitigation</td>
                    <td className="py-3 px-4 text-slate-300 font-sans">None</td>
                    <td className="py-3 px-4 text-slate-200 font-sans">Surge Ward 4B</td>
                    <td className="py-3 px-4 text-slate-200 font-sans">Divert Ambulances</td>
                    <td className="py-3 px-4 text-slate-200 font-sans">Expedite Discharges</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1C3326] hover:bg-[#234230] text-slate-300"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
