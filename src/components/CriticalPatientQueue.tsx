import React, { useState } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Download, 
  Search, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Eye,
  Bookmark,
  Sparkles,
  X,
  FileSpreadsheet,
  Flame,
  Activity
} from 'lucide-react';
import { Patient } from '../types';

interface CriticalPatientQueueProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const CriticalPatientQueue: React.FC<CriticalPatientQueueProps> = ({
  patients,
  onSelectPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Critical' | 'High' | 'Stable'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [minRiskFilter, setMinRiskFilter] = useState<number>(0);
  const [waitThresholdFilter, setWaitThresholdFilter] = useState<boolean>(false);
  const [sortDescending, setSortDescending] = useState(true);
  const [savedView, setSavedView] = useState<'all' | 'critical-icu' | 'ed-wait-30' | 'sepsis'>('all');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Saved view handler (Backlog Item #12)
  const applySavedView = (view: 'all' | 'critical-icu' | 'ed-wait-30' | 'sepsis') => {
    setSavedView(view);
    if (view === 'all') {
      setStatusFilter('All');
      setDepartmentFilter('All');
      setMinRiskFilter(0);
      setWaitThresholdFilter(false);
    } else if (view === 'critical-icu') {
      setStatusFilter('Critical');
      setDepartmentFilter('Critical Care / Trauma');
      setMinRiskFilter(85);
      setWaitThresholdFilter(false);
      showToast('Loaded saved view: My Critical ICU Patients');
    } else if (view === 'ed-wait-30') {
      setStatusFilter('All');
      setDepartmentFilter('Emergency');
      setMinRiskFilter(0);
      setWaitThresholdFilter(true);
      showToast('Loaded saved view: Emergency Patients Waiting >30 min');
    } else if (view === 'sepsis') {
      setStatusFilter('All');
      setDepartmentFilter('All');
      setMinRiskFilter(75);
      setWaitThresholdFilter(false);
      showToast('Loaded saved view: High Sepsis Deterioration Risk');
    }
  };

  // Filter and sort patients (Backlog Item #11)
  const filteredPatients = patients
    .filter((p) => {
      const matchesSearch = 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesDept = departmentFilter === 'All' || p.department.toLowerCase().includes(departmentFilter.toLowerCase());
      const matchesRisk = p.risk >= minRiskFilter;
      const waitMinutes = parseInt(p.waitTime) || 0;
      const matchesWait = !waitThresholdFilter || waitMinutes >= 30;

      return matchesSearch && matchesStatus && matchesDept && matchesRisk && matchesWait;
    })
    .sort((a, b) => {
      return sortDescending ? b.risk - a.risk : a.risk - b.risk;
    });

  const handleExportQueueCSV = () => {
    const headers = ['Patient ID', 'Name', 'Age', 'Department', 'Bed', 'Severity', 'Risk', 'Wait Time', 'Status'];
    const rows = filteredPatients.map(p => [
      `"${p.id}"`,
      `"${p.name}"`,
      p.age,
      `"${p.department}"`,
      `"${p.bed || 'Triage'}"`,
      p.severity,
      `${p.risk}%`,
      `"${p.waitTime}"`,
      `"${p.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `mediflow-patient-queue-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Triage queue CSV downloaded successfully.');
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-900 border border-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1F3729]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Critical Patient Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Algorithmic priority queue weighted by clinical severity, oxygen saturation, and waiting duration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportQueueCSV}
            className="px-3.5 py-1.5 rounded-xl bg-[#1C3326] hover:bg-[#234230] text-slate-200 border border-[#2F523C] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#E88F89]" />
            <span>Export CSV</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase">Live Triage</span>
          </div>
        </div>
      </div>

      {/* Saved Views Pills (Backlog Item #12) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
          <Bookmark className="w-3 h-3 text-[#E88F89]" />
          Saved Views:
        </span>
        <button
          onClick={() => applySavedView('all')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            savedView === 'all'
              ? 'bg-[#E88F89] text-slate-950 border-[#E88F89] shadow-sm'
              : 'bg-[#13251B] text-slate-300 border-[#234230] hover:bg-[#183124]'
          }`}
        >
          All Active Patients ({patients.length})
        </button>
        <button
          onClick={() => applySavedView('critical-icu')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            savedView === 'critical-icu'
              ? 'bg-[#E88F89] text-slate-950 border-[#E88F89] shadow-sm'
              : 'bg-[#13251B] text-slate-300 border-[#234230] hover:bg-[#183124]'
          }`}
        >
          My Critical ICU Patients
        </button>
        <button
          onClick={() => applySavedView('ed-wait-30')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            savedView === 'ed-wait-30'
              ? 'bg-[#E88F89] text-slate-950 border-[#E88F89] shadow-sm'
              : 'bg-[#13251B] text-slate-300 border-[#234230] hover:bg-[#183124]'
          }`}
        >
          Emergency Waiting {'>'} 30m
        </button>
        <button
          onClick={() => applySavedView('sepsis')}
          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
            savedView === 'sepsis'
              ? 'bg-[#E88F89] text-slate-950 border-[#E88F89] shadow-sm'
              : 'bg-[#13251B] text-slate-300 border-[#234230] hover:bg-[#183124]'
          }`}
        >
          Sepsis Risk {'>'} 75%
        </button>
      </div>

      {/* Filter and Search Bar (Backlog Item #11) */}
      <div className="bg-[#13251B] rounded-2xl p-4 border border-[#234230] shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by ID (P-1024), name, complaint, or department..."
              className="w-full pl-9 pr-4 py-2 bg-[#183124] rounded-xl border border-[#274633] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Critical Care">Critical Care / ICU</option>
              <option value="Emergency">Emergency Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="Internal Medicine">Internal Medicine</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Stable">Stable</option>
            </select>

            <button
              onClick={() => setSortDescending(!sortDescending)}
              className="px-3 py-2 rounded-xl bg-[#183124] border border-[#274633] text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Risk: {sortDescending ? 'Highest' : 'Lowest'}</span>
            </button>

            {(statusFilter !== 'All' || departmentFilter !== 'All' || searchTerm || minRiskFilter > 0 || waitThresholdFilter) && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setDepartmentFilter('All');
                  setSearchTerm('');
                  setMinRiskFilter(0);
                  setWaitThresholdFilter(false);
                  setSavedView('all');
                }}
                className="px-2.5 py-2 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs hover:bg-rose-900 transition-colors"
                title="Clear all filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-[#13251B] rounded-2xl border border-[#234230] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E3B2A] bg-[#183124]/90 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Patient / ID</th>
                <th className="py-3.5 px-4">Department / Bed</th>
                <th className="py-3.5 px-4">Severity Score</th>
                <th className="py-3.5 px-4">Risk Probability</th>
                <th className="py-3.5 px-4">Wait Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3325]">
              {filteredPatients.map((patient) => {
                const waitMins = parseInt(patient.waitTime) || 0;
                const isOverdue = waitMins >= 30;

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className="hover:bg-[#183124] transition-colors cursor-pointer group"
                  >
                    {/* Patient ID and Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          patient.status === 'Critical' ? 'bg-rose-500 animate-pulse' :
                          patient.status === 'High' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white group-hover:text-[#E88F89] transition-colors">
                              {patient.id}
                            </span>
                            {patient.flaggedForReview && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-rose-950 border border-rose-800 text-rose-300">
                                FLAGGED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                            {patient.name} <span className="text-slate-500 font-normal">({patient.age}y, {patient.gender[0]})</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Bed */}
                    <td className="py-4 px-4">
                      <p className="text-slate-200 font-medium">{patient.department}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Bed: {patient.bed || 'Triage Bay'}</p>
                    </td>

                    {/* Severity Score with Progress Bar */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 max-w-[140px]">
                        <span className="font-mono font-bold text-white text-sm w-7">{patient.severity}</span>
                        <div className="flex-1 h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full ${
                              patient.severity >= 85 ? 'bg-rose-500' :
                              patient.severity >= 70 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${patient.severity}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Risk Probability */}
                    <td className="py-4 px-4 font-mono">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        patient.risk >= 90 ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                        patient.risk >= 70 ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      }`}>
                        {patient.risk}%
                      </span>
                    </td>

                    {/* Wait Time with Overdue Warning */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`} />
                        <span className={isOverdue ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                          {patient.waitTime}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        patient.status === 'Critical' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                        patient.status === 'High' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                        'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPatient(patient);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#1C3326] hover:bg-[#234230] text-slate-200 group-hover:text-white border border-[#2F523C] text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ChevronRight className="w-3 h-3 text-[#E88F89]" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-semibold">No patients match the specified filter criteria.</p>
            <p className="text-xs text-slate-500">Adjust your severity filters, department selection, or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
