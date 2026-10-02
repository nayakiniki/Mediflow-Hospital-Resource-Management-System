import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  ArrowRight, 
  UserCheck, 
  Bed, 
  Stethoscope, 
  Activity, 
  Truck, 
  FileCheck,
  Check
} from 'lucide-react';
import { Patient, PatientTimelineEvent } from '../../types';

interface PatientTimelineProps {
  patient: Patient;
  onInitiateTransfer?: () => void;
  onInitiateDischarge?: () => void;
}

interface TimelineStage {
  id: string;
  label: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  author?: string;
  notes?: string;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({
  patient,
  onInitiateTransfer,
  onInitiateDischarge
}) => {
  // Determine the 6 stages based on patient state and timeline events
  const hasTransferred = (patient.timeline || []).some(t => t.category === 'transfer');
  const isDischarged = patient.status === 'Stable' && (patient.timeline || []).some(t => t.description.toLowerCase().includes('discharge'));

  const stages: TimelineStage[] = [
    {
      id: 'admission',
      label: 'Admission',
      status: 'completed',
      timestamp: patient.admittedAt || '08:12 AM',
      author: 'ED Intake Desk',
      notes: `Admitted for ${patient.chiefComplaint.slice(0, 48)}...`
    },
    {
      id: 'assessment',
      label: 'Assessment',
      status: 'completed',
      timestamp: '08:45 AM',
      author: 'Dr. Jennifer Thorne, MD',
      notes: `Severity score ${patient.severity}/100. SpO2 ${patient.oxygenSat.value}.`
    },
    {
      id: 'bed_assignment',
      label: 'Bed Assignment',
      status: 'completed',
      timestamp: '09:10 AM',
      author: 'Operations Dispatch',
      notes: `Allocated to ${patient.bed || 'ICU-204'} (${patient.department})`
    },
    {
      id: 'treatment',
      label: 'Treatment',
      status: patient.status === 'Critical' || patient.status === 'High' ? 'active' : 'completed',
      timestamp: 'In Progress (Active)',
      author: 'Critical Care Team',
      notes: patient.aiRecommendation || 'Aggressive hemodynamic monitoring & supplemental O2 titration.'
    },
    {
      id: 'transfer',
      label: 'Transfer',
      status: hasTransferred ? 'completed' : patient.status === 'Critical' ? 'active' : 'pending',
      timestamp: hasTransferred ? '09:10 AM' : undefined,
      author: hasTransferred ? 'Operations Dispatch' : undefined,
      notes: hasTransferred ? `Relocated to ${patient.bed}` : 'Step-down transfer evaluation scheduled.'
    },
    {
      id: 'discharge',
      label: 'Discharge',
      status: isDischarged ? 'completed' : 'pending',
      timestamp: isDischarged ? 'Pending Order' : undefined,
      author: isDischarged ? 'Attending Physician' : undefined,
      notes: isDischarged ? 'Discharge criteria satisfied.' : 'Awaiting clinical stabilization window.'
    }
  ];

  return (
    <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-5 text-slate-100">
      <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
            Clinical Pathway Progression
          </span>
          <h3 className="text-base font-serif font-bold text-white mt-0.5">
            Operational Patient Timeline
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Stage: {stages.find(s => s.status === 'active')?.label || 'Active Monitoring'}</span>
        </span>
      </div>

      {/* 6 Stage Horizontal Milestone Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          return (
            <div 
              key={stage.id}
              className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                stage.status === 'completed'
                  ? 'bg-[#183124] border-emerald-800/80 text-emerald-300'
                  : stage.status === 'active'
                  ? 'bg-[#1A3326] border-[#E88F89] shadow-md shadow-[#E88F89]/10 text-white'
                  : 'bg-[#14261D]/50 border-[#234230]/60 text-slate-400 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span>0{idx + 1}</span>
                  {stage.status === 'completed' ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-950 text-emerald-300 flex items-center justify-center border border-emerald-600">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : stage.status === 'active' ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E88F89] animate-ping" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <p className="font-serif text-xs font-bold text-white">{stage.label}</p>
                {stage.timestamp && (
                  <p className="text-[10px] font-mono text-slate-300 mt-1">{stage.timestamp}</p>
                )}
              </div>

              <div className="mt-3 pt-1.5 border-t border-white/5">
                <p className="text-[10px] text-slate-400 line-clamp-2 italic">
                  {stage.notes}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Chronological Events Feed */}
      <div className="pt-2 space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Timestamped Clinical Audit Trail
        </h4>
        <div className="space-y-3">
          {(patient.timeline || []).map((ev, index) => (
            <div key={ev.id || index} className="p-3.5 rounded-xl bg-[#183124] border border-[#274633] flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{ev.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{ev.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{ev.description}</p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400">Author: {ev.author}</span>
                  <span>·</span>
                  <span className="capitalize">{ev.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
