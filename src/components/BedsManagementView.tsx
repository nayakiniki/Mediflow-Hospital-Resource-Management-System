import React, { useState } from 'react';
import { 
  Bed, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Sparkles, 
  Filter, 
  Wind, 
  ShieldAlert, 
  Activity, 
  Clock, 
  Wrench, 
  RefreshCw, 
  Check, 
  X,
  UserCheck
} from 'lucide-react';
import { BedAllocation, BedItem, BedLifecycleStatus } from '../types';
import { INITIAL_BED_ITEMS } from '../lib/mockHospitalData';
import { BedMap3D } from './3d/BedMap3D';

interface BedsManagementViewProps {
  beds: BedAllocation[];
  onAllocateBed: (ward: string) => void;
}

export const BedsManagementView: React.FC<BedsManagementViewProps> = ({
  beds,
  onAllocateBed
}) => {
  const [bedItems, setBedItems] = useState<BedItem[]>(INITIAL_BED_ITEMS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // "Find a suitable bed" assistant form state (Backlog Item #13)
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [searchDept, setSearchDept] = useState<string>('All');
  const [searchType, setSearchType] = useState<string>('All');
  const [requireIsolation, setRequireIsolation] = useState(false);
  const [requireVentilator, setRequireVentilator] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'Any' | 'Male' | 'Female'>('Any');

  // Allocation modal
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedItem | null>(null);
  const [patientAssignName, setPatientAssignName] = useState('P-1024 (Robert Hastings)');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Lifecycle status actions (Backlog Item #14)
  const updateBedStatus = (bedId: string, newStatus: BedLifecycleStatus, note?: string) => {
    setBedItems(prev => prev.map(b => {
      if (b.id === bedId) {
        return {
          ...b,
          status: newStatus,
          lastCleaned: newStatus === 'Available' ? 'Just cleaned' : b.lastCleaned,
          maintenanceNote: note || b.maintenanceNote
        };
      }
      return b;
    }));
    showToast(`Bed ${bedId} updated to ${newStatus}.`);
  };

  // Filtered beds for the Suitable Bed assistant
  const suitableBeds = bedItems.filter(b => {
    const matchDept = searchDept === 'All' || b.ward === searchDept;
    const matchType = searchType === 'All' || b.type === searchType;
    const matchIso = !requireIsolation || b.hasIsolation;
    const matchVent = !requireVentilator || b.hasVentilator;
    const matchGender = genderFilter === 'Any' || b.genderWard === 'Any' || b.genderWard === genderFilter;
    const matchAvailable = b.status === 'Available';
    return matchDept && matchType && matchIso && matchVent && matchGender && matchAvailable;
  });

  const handleOpenAllocate = (bed: BedItem) => {
    setSelectedBed(bed);
    setAllocateModalOpen(true);
  };

  const handleConfirmAllocation = () => {
    if (!selectedBed) return;
    setBedItems(prev => prev.map(b => {
      if (b.id === selectedBed.id) {
        return {
          ...b,
          status: 'Occupied',
          assignedPatientName: patientAssignName
        };
      }
      return b;
    }));
    setAllocateModalOpen(false);
    showToast(`Bed ${selectedBed.id} successfully allocated to ${patientAssignName}.`);
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
            Bed Capacity & Ward Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Real-time occupancy, automated bed placement queries, and end-to-end bed lifecycle tracking
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-700/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] uppercase">Surge Protocol Ready</span>
        </div>
      </div>

      {/* 4 Ward Occupancy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {beds.map((b) => (
          <div key={b.ward} className="bg-[#13251B] rounded-2xl p-5 border border-[#234230] shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-serif">{b.ward}</span>
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                  b.occupancyRate >= 85 ? 'bg-rose-950/80 text-rose-300 border border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}>
                  {b.occupancyRate}% Occupied
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-white font-mono">{b.available}</span>
                  <span className="text-xs text-slate-400 ml-1.5">free beds</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {b.occupied} / {b.total} beds
                </div>
              </div>

              <div className="w-full h-2 bg-[#0B1710] rounded-full mt-3 overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full ${b.occupancyRate >= 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${b.occupancyRate}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onAllocateBed(b.ward)}
              className="mt-5 w-full py-2 rounded-xl bg-[#1C3326] hover:bg-[#234230] text-slate-200 hover:text-white font-semibold text-xs border border-[#2F523C] transition-colors"
            >
              Manage {b.ward} Beds
            </button>
          </div>
        ))}
      </div>

      {/* 3D Isometric Bed Visualization (Requirement 2) */}
      <BedMap3D
        beds={bedItems}
        onSelectBed={(bed) => {
          setSelectedBed(bed);
          setAllocateModalOpen(true);
        }}
        onAllocateBed={(bed) => {
          setSelectedBed(bed);
          setAllocateModalOpen(true);
        }}
      />

      {/* "Find a Suitable Bed" Query Assistant (Backlog Item #13) */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3B2A]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Bed Placement Engine
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-0.5">
              Find a Suitable Bed
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Filter by department, ventilator status, negative pressure isolation, and special equipment.
            </p>
          </div>
          <button
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="text-xs text-[#E88F89] hover:text-white font-semibold"
          >
            {assistantOpen ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {assistantOpen && (
          <div className="space-y-4 pt-1">
            {/* Filter inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">DEPARTMENT</label>
                <select
                  value={searchDept}
                  onChange={(e) => setSearchDept(e.target.value)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="All">All Departments</option>
                  <option value="ICU">ICU (Critical Care)</option>
                  <option value="Emergency">Emergency</option>
                  <option value="General Ward">General Ward</option>
                  <option value="Surgical">Surgical / Post-Op</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">BED TYPE</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Intensive Care">Intensive Care</option>
                  <option value="Negative Pressure">Negative Pressure</option>
                  <option value="Standard Acute">Standard Acute</option>
                  <option value="Step-Down">Step-Down</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">VENTILATOR</label>
                <button
                  type="button"
                  onClick={() => setRequireVentilator(!requireVentilator)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    requireVentilator 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600' 
                      : 'bg-[#183124] text-slate-400 border-[#274633]'
                  }`}
                >
                  <span>Mechanical Vent</span>
                  <span>{requireVentilator ? '✓ Required' : 'Any'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">ISOLATION</label>
                <button
                  type="button"
                  onClick={() => setRequireIsolation(!requireIsolation)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    requireIsolation 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600' 
                      : 'bg-[#183124] text-slate-400 border-[#274633]'
                  }`}
                >
                  <span>Negative Pressure</span>
                  <span>{requireIsolation ? '✓ Required' : 'Any'}</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">WARD GENDER</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male Ward Only</option>
                  <option value="Female">Female Ward Only</option>
                </select>
              </div>
            </div>

            {/* Suitable Beds Query Results */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Suitable Matching Beds ({suitableBeds.length} available right now):</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {suitableBeds.map(bed => (
                  <div key={bed.id} className="p-4 rounded-xl bg-[#183124] border border-[#274633] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-sm">{bed.id}</span>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Available ✓
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{bed.floor} · {bed.ward}</p>

                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                      {bed.hasVentilator && (
                        <span className="px-2 py-0.5 rounded-md bg-[#1C3326] text-emerald-300 border border-[#2C4838]">
                          Ventilator ✓
                        </span>
                      )}
                      {bed.hasIsolation && (
                        <span className="px-2 py-0.5 rounded-md bg-[#1C3326] text-cyan-300 border border-[#2C4838]">
                          Isolation ✓
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-[#1C3326] text-slate-300 border border-[#2C4838]">
                        {bed.type}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenAllocate(bed)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Allocate Bed</span>
                    </button>
                  </div>
                ))}

                {suitableBeds.length === 0 && (
                  <div className="col-span-full p-4 rounded-xl bg-[#183124] border border-amber-900/60 text-center text-xs text-amber-300">
                    No available beds match all specific constraints. Consider step-down relocation or clearing surge beds in Ward 4B.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Bed Lifecycle Management Grid (Backlog Item #14) */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3B2A] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Bed Lifecycle State Machine
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-0.5">
              Live Bed Inventory & Status Transitions
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">Available</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">Reserved</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">Occupied</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">Cleaning</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">Maintenance</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">Blocked</span>
          </div>
        </div>

        {/* Grid of all tracked beds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bedItems.map(bed => {
            const statusColors: Record<BedLifecycleStatus, { bg: string; text: string; border: string }> = {
              Available: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' },
              Reserved: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-800' },
              Occupied: { bg: 'bg-rose-950/80', text: 'text-rose-300', border: 'border-rose-800' },
              Cleaning: { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-800' },
              Maintenance: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' },
              Blocked: { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-700' }
            };

            const col = statusColors[bed.status];

            return (
              <div key={bed.id} className="p-4 rounded-xl bg-[#183124] border border-[#274633] space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-white text-base">{bed.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">({bed.ward})</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.bg} ${col.text} border ${col.border}`}>
                      {bed.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1">{bed.floor}</p>

                  {bed.assignedPatientName && (
                    <p className="text-[11px] text-emerald-300 font-mono mt-1">
                      Patient: <strong className="text-white">{bed.assignedPatientName}</strong>
                    </p>
                  )}

                  {bed.maintenanceNote && (
                    <p className="text-[10px] text-amber-300/90 italic mt-1">
                      Note: {bed.maintenanceNote}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 flex-wrap mt-2 text-[9px] font-mono">
                    {bed.hasVentilator && <span className="px-1.5 py-0.5 rounded bg-[#1C3326] text-slate-300">Ventilator</span>}
                    {bed.hasIsolation && <span className="px-1.5 py-0.5 rounded bg-[#1C3326] text-cyan-300">Isolation</span>}
                    <span className="px-1.5 py-0.5 rounded bg-[#1C3326] text-slate-400">{bed.genderWard}</span>
                  </div>
                </div>

                {/* Lifecycle Action Buttons (Backlog Item #14) */}
                <div className="pt-2 border-t border-[#1F3729] flex items-center flex-wrap gap-1.5">
                  {bed.status === 'Available' && (
                    <>
                      <button
                        onClick={() => handleOpenAllocate(bed)}
                        className="px-2 py-1 rounded-lg bg-[#E88F89] text-slate-950 font-bold text-[10px] hover:bg-[#F2A39F]"
                      >
                        Allocate
                      </button>
                      <button
                        onClick={() => updateBedStatus(bed.id, 'Reserved')}
                        className="px-2 py-1 rounded-lg bg-[#1C3326] text-cyan-300 text-[10px] hover:bg-[#234230]"
                      >
                        Reserve
                      </button>
                      <button
                        onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                        className="px-2 py-1 rounded-lg bg-[#1C3326] text-amber-300 text-[10px] hover:bg-[#234230]"
                      >
                        Mark Cleaning
                      </button>
                    </>
                  )}

                  {bed.status === 'Occupied' && (
                    <>
                      <button
                        onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                        className="px-2 py-1 rounded-lg bg-[#1C3326] text-amber-300 text-[10px] hover:bg-[#234230]"
                      >
                        Discharge & Clean
                      </button>
                      <button
                        onClick={() => updateBedStatus(bed.id, 'Available')}
                        className="px-2 py-1 rounded-lg bg-[#1C3326] text-emerald-300 text-[10px] hover:bg-[#234230]"
                      >
                        Release
                      </button>
                    </>
                  )}

                  {bed.status === 'Reserved' && (
                    <>
                      <button
                        onClick={() => handleOpenAllocate(bed)}
                        className="px-2 py-1 rounded-lg bg-[#E88F89] text-slate-950 font-bold text-[10px]"
                      >
                        Admit Patient
                      </button>
                      <button
                        onClick={() => updateBedStatus(bed.id, 'Available')}
                        className="px-2 py-1 rounded-lg bg-[#1C3326] text-slate-300 text-[10px] hover:bg-[#234230]"
                      >
                        Cancel Reserve
                      </button>
                    </>
                  )}

                  {bed.status === 'Cleaning' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Available')}
                      className="px-2 py-1 rounded-lg bg-[#1C3326] text-emerald-300 text-[10px] hover:bg-[#234230]"
                    >
                      ✓ Mark Available
                    </button>
                  )}

                  {bed.status === 'Maintenance' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Cleaning')}
                      className="px-2 py-1 rounded-lg bg-[#1C3326] text-emerald-300 text-[10px] hover:bg-[#234230]"
                    >
                      Maintenance Cleared
                    </button>
                  )}

                  {bed.status !== 'Maintenance' && bed.status !== 'Blocked' && (
                    <button
                      onClick={() => updateBedStatus(bed.id, 'Maintenance', 'Reported via nurse console')}
                      className="px-2 py-1 rounded-lg bg-[#1C3326] text-slate-400 text-[10px] hover:text-rose-300"
                      title="Report Maintenance Issue"
                    >
                      Report Maint.
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation Modal */}
      {allocateModalOpen && selectedBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
                  Bed Allocation
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Allocate Bed {selectedBed.id}
                </h3>
              </div>
              <button
                onClick={() => setAllocateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                <p className="text-slate-400 font-mono text-[10px]">BED SPECIFICATIONS</p>
                <p className="font-bold text-white mt-0.5">{selectedBed.floor} · {selectedBed.type}</p>
                <p className="text-slate-300 text-[11px] mt-1">
                  Ventilator: {selectedBed.hasVentilator ? 'Yes' : 'No'} · Isolation: {selectedBed.hasIsolation ? 'Yes' : 'No'}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assign Patient:</label>
                <input
                  type="text"
                  value={patientAssignName}
                  onChange={(e) => setPatientAssignName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => setAllocateModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocation}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 transition-all shadow-md shadow-[#E88F89]/20"
              >
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
