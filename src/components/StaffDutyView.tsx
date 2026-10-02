import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Sparkles, 
  Search, 
  UserCheck, 
  X, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { StaffOnDuty, DoctorShift, ScheduleConflict } from '../types';
import { INITIAL_SHIFTS, INITIAL_CONFLICTS, AVAILABLE_DOCTORS } from '../lib/mockHospitalData';

interface StaffDutyViewProps {
  staffList: StaffOnDuty[];
}

export const StaffDutyView: React.FC<StaffDutyViewProps> = ({ staffList }) => {
  const [shifts, setShifts] = useState<DoctorShift[]>(INITIAL_SHIFTS);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>(INITIAL_CONFLICTS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Scheduling Assistant state (Backlog Item #15)
  const [schedDept, setSchedDept] = useState('Emergency Medicine');
  const [schedDate, setSchedDate] = useState('Today (Oct 1)');
  const [schedShift, setSchedShift] = useState('14:00 – 18:00');
  const [minDoctors, setMinDoctors] = useState(4);
  const [currentDoctors, setCurrentDoctors] = useState(3);
  const [coverageFound, setCoverageFound] = useState(false);
  const [availableDocsOpen, setAvailableDocsOpen] = useState(false);

  // Conflict modal state (Backlog Item #16)
  const [selectedConflict, setSelectedConflict] = useState<ScheduleConflict | null>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleFindCoverage = () => {
    setCoverageFound(true);
    setAvailableDocsOpen(true);
  };

  const handleAssignDoctor = (docName: string) => {
    setCurrentDoctors(prev => prev + 1);
    setShifts(prev => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        doctorName: docName,
        department: schedDept,
        date: schedDate,
        shift: schedShift,
        role: 'Float Attending',
        status: 'Active'
      }
    ]);
    // Resolve the under-coverage conflict if resolved
    setConflicts(prev => prev.filter(c => c.conflictType !== 'Under-Coverage'));
    setAvailableDocsOpen(false);
    showToast(`${docName} assigned to ${schedDept} (${schedShift}). Staffing requirement fulfilled!`);
  };

  const handleResolveConflict = (conflictId: string) => {
    // Resolve Dr. Patel's overlapping shift
    setShifts(prev => prev.map(s => {
      if (s.doctorName.includes('Patel')) {
        return {
          ...s,
          status: 'Active',
          shift: '14:00 – 22:00 (ED Swing Only)',
          conflictDescription: undefined
        };
      }
      return s;
    }));
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setResolveModalOpen(false);
    showToast('Schedule conflict resolved. Overlapping shift reassigned to Dr. Brian O’Connor.');
  };

  const handleIgnoreConflict = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
    setResolveModalOpen(false);
    showToast('Conflict noted and acknowledged for shift supervisor records.');
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
            Medical Staffing & Shift Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Department coverage matrix, on-call leads, scheduling assistant, and conflict detection
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-700/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase">86% Overall Coverage</span>
        </div>
      </div>

      {/* Schedule Conflict Detection Alert Panel (Backlog Item #16) */}
      {conflicts.length > 0 && (
        <div className="bg-[#13251B] rounded-2xl p-6 border border-rose-900/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-900/40">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-xs font-mono uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>{conflicts.length} Automated Schedule Conflicts Detected</span>
            </div>
            <span className="text-[11px] text-slate-400">Requires supervisor verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {conflicts.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-[#183124] border border-[#274633] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{c.doctorName}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                    {c.conflictType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-light">{c.recommendation}</p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedConflict(c);
                      setResolveModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all"
                  >
                    View & Resolve
                  </button>
                  <button
                    onClick={() => handleIgnoreConflict(c.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#1C3326] hover:bg-[#234230] text-slate-300 text-xs transition-all"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduling Assistant: Ask Real Questions (Backlog Item #15) */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3B2A]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Staffing Coverage Assistant
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-0.5">
              Doctor Scheduling Coverage Analysis
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Determine real-time physician-to-bed ratios, find available floating doctors, and balance clinical shifts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">DEPARTMENT</label>
            <select
              value={schedDept}
              onChange={(e) => setSchedDept(e.target.value)}
              className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
            >
              <option value="Emergency Medicine">Emergency Medicine</option>
              <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
              <option value="Cardiology & Telemetry">Cardiology & Telemetry</option>
              <option value="General Surgery & Trauma">General Surgery & Trauma</option>
              <option value="Pulmonology & Respiratory">Pulmonology & Respiratory</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">DATE</label>
            <input
              type="text"
              value={schedDate}
              onChange={(e) => setSchedDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">SHIFT WINDOW</label>
            <select
              value={schedShift}
              onChange={(e) => setSchedShift(e.target.value)}
              className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none font-mono"
            >
              <option value="14:00 – 18:00">14:00 – 18:00 (Afternoon Peak)</option>
              <option value="07:00 – 15:00">07:00 – 15:00 (Morning Day)</option>
              <option value="15:00 – 23:00">15:00 – 23:00 (Evening Swing)</option>
              <option value="23:00 – 07:00">23:00 – 07:00 (Overnight Night)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">MINIMUM REQUIRED</label>
            <div className="px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white font-mono font-bold">
              {minDoctors} Doctors
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">CURRENT SCHEDULED</label>
            <div className="px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs font-mono font-bold flex items-center justify-between">
              <span className={currentDoctors < minDoctors ? 'text-rose-400' : 'text-emerald-400'}>
                {currentDoctors} Doctors
              </span>
              {currentDoctors < minDoctors && (
                <span className="text-[10px] text-rose-400">(-1 Deficit)</span>
              )}
            </div>
          </div>
        </div>

        {/* Coverage Alert Banner */}
        {currentDoctors < minDoctors ? (
          <div className="p-4 rounded-xl bg-[#183124] border border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-300">
                Coverage Deficit Flagged
              </p>
              <p className="text-xs text-slate-300 font-light">
                {schedDept} coverage is below configured staffing requirements from {schedShift}. 1 additional physician required to maintain patient safety ratios.
              </p>
            </div>
            <button
              onClick={handleFindCoverage}
              className="px-4 py-2 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#E88F89]/20 shrink-0"
            >
              Find Available Doctors
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Staffing requirements fully satisfied for {schedDept} ({schedShift}).</span>
          </div>
        )}

        {/* Available Doctors List Popup */}
        {availableDocsOpen && (
          <div className="p-4 rounded-xl bg-[#183124] border border-[#2F523C] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-white border-b border-[#234230] pb-2">
              <span>Available On-Call & Standby Physicians:</span>
              <button onClick={() => setAvailableDocsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {AVAILABLE_DOCTORS.map((doc, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#13251B] border border-[#234230] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{doc.department} · {doc.status}</p>
                  </div>
                  <button
                    onClick={() => handleAssignDoctor(doc.name)}
                    className="px-2.5 py-1 rounded-lg bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 text-xs font-bold transition-all"
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Staffing Matrix Table */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
          <h3 className="text-base font-serif font-bold text-white">Department Staffing & On-Call Leads</h3>
          <span className="text-xs text-slate-400 font-mono">Live Roster</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#234230]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1E3B2A] bg-[#183124] text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Physicians</th>
                <th className="py-3.5 px-4">Nursing Staff</th>
                <th className="py-3.5 px-4">Coverage</th>
                <th className="py-3.5 px-4">Lead Intensivist / On Call</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A3325]">
              {staffList.map((st) => (
                <tr key={st.department} className="hover:bg-[#183124] transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{st.department}</td>
                  <td className="py-4 px-4 font-mono text-slate-200">{st.doctors} MDs</td>
                  <td className="py-4 px-4 font-mono text-slate-200">{st.nurses} RNs</td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {st.coveragePercent}%
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300 font-medium flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{st.leadOnCall}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolve Conflict Modal (Backlog Item #16) */}
      {resolveModalOpen && selectedConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
                  Schedule Conflict Resolution
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  {selectedConflict.conflictType}
                </h3>
              </div>
              <button
                onClick={() => setResolveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#183124] border border-[#274633] space-y-1">
                <p className="text-slate-400 font-mono text-[10px]">DOCTOR & SHIFTS</p>
                <p className="font-bold text-white text-sm">{selectedConflict.doctorName}</p>
                <p className="text-slate-300">{selectedConflict.shifts.join(' and ')}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#183124] border border-amber-900/60 space-y-1">
                <p className="text-amber-300 font-mono text-[10px]">RECOMMENDED RESOLUTION</p>
                <p className="text-slate-200">{selectedConflict.recommendation}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => handleIgnoreConflict(selectedConflict.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Ignore
              </button>
              <button
                onClick={() => handleResolveConflict(selectedConflict.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 transition-all shadow-md shadow-[#E88F89]/20"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
