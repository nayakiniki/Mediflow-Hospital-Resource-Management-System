import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Heart, 
  Wind, 
  ShieldAlert, 
  FileText,
  Download,
  Printer,
  Plus,
  Share2,
  Send,
  UserCheck,
  Check,
  X,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Bed,
  PhoneCall,
  User
} from 'lucide-react';
import { Patient, PatientTimelineEvent, ClinicalNote } from '../types';
import { PatientTimeline } from './patient/PatientTimeline';

interface PatientDetailViewProps {
  patient: Patient;
  onBackToQueue: () => void;
  onToggleFlag: (patientId: string) => void;
  onUpdatePatient?: (updatedPatient: Patient) => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onBackToQueue,
  onToggleFlag,
  onUpdatePatient
}) => {
  const [isFlagged, setIsFlagged] = useState(patient.flaggedForReview ?? true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState('ICU-204');
  const [transferReason, setTransferReason] = useState('Escalation to intensive critical care hemodynamic monitoring');
  const [newNoteText, setNewNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Attending Physician');
  const [showFactorDetails, setShowFactorDetails] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleFlag = () => {
    const next = !isFlagged;
    setIsFlagged(next);
    onToggleFlag(patient.id);
    showToast(next ? `Patient ${patient.id} flagged for urgent physician review.` : `Review flag cleared for Patient ${patient.id}.`);
  };

  // CSV Export feature matching user requirement (Backlog Item #3)
  const handleExportCSV = () => {
    try {
      const headers = [
        'Patient ID',
        'Patient Name',
        'Age',
        'Gender',
        'Department',
        'Bed',
        'Severity Score',
        'Risk Probability (%)',
        'Waiting Time',
        'Status',
        'Admission Time',
        'Last Updated',
        'Oxygen Saturation',
        'Heart Rate',
        'Sepsis Indicators',
        'Chief Complaint',
        'Clinical Recommendation',
        'Flagged For Review',
        'Export Timestamp'
      ];

      const escapeCSV = (val: any) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const row = [
        escapeCSV(patient.id),
        escapeCSV(patient.name),
        escapeCSV(patient.age),
        escapeCSV(patient.gender),
        escapeCSV(patient.department),
        escapeCSV(patient.bed || 'ICU-204'),
        escapeCSV(patient.severity),
        escapeCSV(`${patient.risk}%`),
        escapeCSV(patient.waitTime),
        escapeCSV(patient.status),
        escapeCSV(patient.admittedAt),
        escapeCSV(patient.lastUpdated || '2 minutes ago'),
        escapeCSV(`${patient.oxygenSat.value} (${patient.oxygenSat.level})`),
        escapeCSV(`${patient.heartRate.value} (${patient.heartRate.level})`),
        escapeCSV(patient.sepsisIndicator),
        escapeCSV(patient.chiefComplaint),
        escapeCSV(patient.aiRecommendation),
        escapeCSV(isFlagged ? 'YES' : 'NO'),
        escapeCSV(new Date().toISOString())
      ];

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), row.join(',')].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `patient-${patient.id.toLowerCase()}-profile.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported clinical CSV profile for Patient ${patient.id}.`);
    } catch (err) {
      console.error('CSV export failed', err);
      showToast('Failed to export CSV. Please try again.');
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleConfirmTransfer = () => {
    const newTimelineEvent: PatientTimelineEvent = {
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Transferred to ${transferTarget}`,
      description: `Reason: ${transferReason}`,
      author: 'Operations Bed Dispatch',
      category: 'transfer'
    };

    const updated: Patient = {
      ...patient,
      bed: transferTarget,
      lastUpdated: 'Just now',
      timeline: [newTimelineEvent, ...(patient.timeline || [])]
    };

    if (onUpdatePatient) {
      onUpdatePatient(updated);
    }
    setTransferModalOpen(false);
    showToast(`Patient ${patient.id} transfer to ${transferTarget} confirmed.`);
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;

    const newNote: ClinicalNote = {
      id: `n-${Date.now()}`,
      author: noteAuthor,
      role: 'Clinical Staff',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: newNoteText.trim()
    };

    const newTimelineEvent: PatientTimelineEvent = {
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Clinical note added by ${noteAuthor}`,
      description: newNoteText.trim(),
      author: noteAuthor,
      category: 'note'
    };

    const updated: Patient = {
      ...patient,
      lastUpdated: 'Just now',
      notes: [newNote, ...(patient.notes || [])],
      timeline: [newTimelineEvent, ...(patient.timeline || [])]
    };

    if (onUpdatePatient) {
      onUpdatePatient(updated);
    }

    setNewNoteText('');
    setNoteModalOpen(false);
    showToast(`Note recorded for Patient ${patient.id}.`);
  };

  const handleStatusAction = (newStatus: 'Critical' | 'High' | 'Stable') => {
    const newTimelineEvent: PatientTimelineEvent = {
      id: `t-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Status changed to ${newStatus}`,
      description: `Physician reclassified patient triage status from ${patient.status} to ${newStatus}.`,
      author: 'Attending Physician',
      category: 'assessment'
    };

    const updated: Patient = {
      ...patient,
      status: newStatus,
      lastUpdated: 'Just now',
      timeline: [newTimelineEvent, ...(patient.timeline || [])]
    };

    if (onUpdatePatient) {
      onUpdatePatient(updated);
    }
    showToast(`Patient ${patient.id} marked as ${newStatus}.`);
  };

  const factor = patient.factorBreakdown || {
    severity: 42,
    oxygen: 26,
    waitTime: 18,
    age: 9,
    other: 5,
    summary: 'High severity, prolonged waiting time, and abnormal oxygen saturation contributed most to the current priority score.'
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-900 border border-emerald-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation & Workspace Header (Backlog Item #3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F3729]">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToQueue}
            className="p-2.5 rounded-xl bg-[#13251B] hover:bg-[#1C3326] text-slate-300 hover:text-white border border-[#234230] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Queue</span>
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Patient {patient.id}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                patient.status === 'Critical' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                patient.status === 'High' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
              }`}>
                {patient.status}
              </span>
              {isFlagged && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-300">
                  FLAGGED FOR REVIEW
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Age: {patient.age} · Gender: {patient.gender} · Department: {patient.department} · Bed: <strong className="text-white">{patient.bed || 'ICU-204'}</strong> · Last updated: {patient.lastUpdated || '2 minutes ago'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Backlog Item #3) */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 text-xs font-bold transition-all shadow-md shadow-[#E88F89]/20 flex items-center gap-1.5 active:scale-95"
            title="Download CSV clinical profile"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="px-3.5 py-2 rounded-xl bg-[#13251B] hover:bg-[#1C3326] text-slate-200 border border-[#234230] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Summary</span>
          </button>

          <button
            onClick={() => setNoteModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#13251B] hover:bg-[#1C3326] text-slate-200 border border-[#234230] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#E88F89]" />
            <span>Add Note</span>
          </button>

          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#13251B] hover:bg-[#1C3326] text-slate-200 border border-[#234230] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Bed className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transfer</span>
          </button>

          <button
            onClick={handleFlag}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isFlagged 
                ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
                : 'bg-[#13251B] text-slate-200 border-[#234230] hover:bg-[#1C3326]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{isFlagged ? 'Flagged' : 'Flag for Review'}</span>
          </button>
        </div>
      </div>

      {/* Patient Workflow Action Bar (Backlog Item #5) */}
      <div className="bg-[#13251B] rounded-2xl p-4 border border-[#234230] shadow-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          Quick Workflow Actions:
        </span>
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => handleStatusAction('Stable')}
            className="px-3 py-1.5 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] text-emerald-300 border border-[#274633] text-xs font-semibold transition-all"
          >
            Mark Stable
          </button>
          <button
            onClick={() => handleStatusAction('Critical')}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-semibold transition-all"
          >
            Escalate Priority
          </button>
          <button
            onClick={() => setTransferModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] text-slate-200 border border-[#274633] text-xs font-semibold transition-all"
          >
            Assign Bed
          </button>
          <button
            onClick={() => {
              showToast(`Discharge checklist initiated for Patient ${patient.id}.`);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] text-slate-200 border border-[#274633] text-xs font-semibold transition-all"
          >
            Discharge Checklist
          </button>
          <button
            onClick={() => {
              showToast(`Multidisciplinary review requested for Patient ${patient.id}.`);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] text-amber-300 border border-[#274633] text-xs font-semibold transition-all"
          >
            Request Review
          </button>
        </div>
      </div>

      {/* Top Clinical Highlight Card */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Chief Complaint & Triage Notes</span>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              "{patient.chiefComplaint}"
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 font-mono text-center">
            <div className="p-3 bg-[#183124] rounded-xl border border-[#274633] min-w-[90px]">
              <span className="text-[10px] uppercase text-slate-400 block">Severity</span>
              <span className="text-2xl font-bold text-rose-400">{patient.severity}</span>
            </div>
            <div className="p-3 bg-[#183124] rounded-xl border border-[#274633] min-w-[90px]">
              <span className="text-[10px] uppercase text-slate-400 block">Risk Score</span>
              <span className="text-2xl font-bold text-amber-300">{patient.risk}%</span>
            </div>
            <div className="p-3 bg-[#183124] rounded-xl border border-[#274633] min-w-[90px]">
              <span className="text-[10px] uppercase text-slate-400 block">Wait Time</span>
              <span className="text-2xl font-bold text-slate-200">{patient.waitTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* "Why is this patient high priority?" Section (Backlog Item #6) */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E3B2A]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Explainable Clinical Priority (SHAP Attribution)
            </span>
            <h3 className="text-lg font-serif font-bold text-white mt-0.5">
              Why was this patient prioritized?
            </h3>
          </div>
          <button
            onClick={() => setShowFactorDetails(!showFactorDetails)}
            className="text-xs font-semibold text-[#E88F89] hover:text-white transition-colors"
          >
            {showFactorDetails ? 'Hide details' : 'View factors'}
          </button>
        </div>

        {/* Priority Score & Factor Bars */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-3 text-center md:text-left">
            <span className="text-xs text-slate-400 font-mono">Priority Score</span>
            <div className="text-5xl font-mono font-bold text-white mt-1">
              {patient.severity}
            </div>
            <span className="inline-block mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              Top 2% Department Severity
            </span>
          </div>

          <div className="md:col-span-9 space-y-2.5">
            <p className="text-xs text-slate-300 italic mb-2">
              "{factor.summary}"
            </p>

            {/* Contributing factors bar chart */}
            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Severity Score</span>
                  <span className="font-bold text-rose-400">{factor.severity}%</span>
                </div>
                <div className="h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${factor.severity}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Oxygen Saturation</span>
                  <span className="font-bold text-amber-300">{factor.oxygen}%</span>
                </div>
                <div className="h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${factor.oxygen}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Waiting Time</span>
                  <span className="font-bold text-emerald-400">{factor.waitTime}%</span>
                </div>
                <div className="h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${factor.waitTime}%` }} />
                </div>
              </div>

              {showFactorDetails && (
                <>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Age Multiplier</span>
                      <span className="font-bold text-cyan-400">{factor.age}%</span>
                    </div>
                    <div className="h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${factor.age}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Other Comorbidities</span>
                      <span className="font-bold text-slate-400">{factor.other}%</span>
                    </div>
                    <div className="h-2 bg-[#0B1710] rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-slate-500 rounded-full" style={{ width: `${factor.other}%` }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Vitals Telemetry & Clinical Recommendation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Oxygen Saturation Card */}
        <div className="bg-[#13251B] rounded-2xl p-5 border border-[#234230] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>Oxygen Saturation</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
              {patient.oxygenSat.risk} Risk
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {patient.oxygenSat.value}
          </div>
          <p className="text-[11px] text-slate-400">
            Ambient air reading. Target {'>'} 94%.
          </p>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-[#13251B] rounded-2xl p-5 border border-[#234230] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Heart Rate</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
              {patient.heartRate.level}
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {patient.heartRate.value}
          </div>
          <p className="text-[11px] text-slate-400">
            Sinus tachycardia noted on telemetry lead II.
          </p>
        </div>

        {/* Sepsis Probability Card */}
        <div className="bg-[#13251B] rounded-2xl p-5 border border-[#234230] shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Sepsis Risk Indicator</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
              {patient.sepsisIndicator}
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {patient.sepsisIndicator === 'High' ? 'Flagged (> 85%)' : 'Monitored'}
          </div>
          <p className="text-[11px] text-slate-400">
            qSOFA score = 3 (RR {'>'} 22, altered mentation, SBP ≤ 100).
          </p>
        </div>
      </div>

      {/* Enhanced Patient Detail Timeline (Requirement 4) */}
      <PatientTimeline 
        patient={patient} 
        onInitiateTransfer={() => setTransferModalOpen(true)}
      />

      {/* Clinical Notes Section */}
      <div className="bg-[#13251B] rounded-2xl p-6 border border-[#234230] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
              Attending Staff Handoff
            </span>
            <h3 className="text-base font-serif font-bold text-white">Clinical Notes</h3>
          </div>
          <button
            onClick={() => setNoteModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#1C3326] hover:bg-[#234230] text-[#E88F89] text-xs font-semibold border border-[#2F523C] transition-all"
          >
            + Add Note
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {(patient.notes || []).map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-[#183124] border border-[#274633] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{n.author}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({n.role})</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{n.text}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Patient Modal (Backlog Item #5) */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
                  Bed Allocation Transfer
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Transfer Patient {patient.id}
                </h3>
              </div>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#183124] border border-[#274633]">
                <p className="text-slate-400 font-mono text-[10px]">CURRENT LOCATION</p>
                <p className="font-bold text-white mt-0.5">{patient.department} · Bed {patient.bed || 'ICU-204'}</p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Destination Bed:</label>
                <select
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-white focus:outline-none"
                >
                  <option value="ICU-204">ICU-204 (2nd Floor - Critical Care, Ventilator ✓)</option>
                  <option value="ICU-206">ICU-206 (Negative Pressure Isolation, Ventilator ✓)</option>
                  <option value="StepDown-08">StepDown-08 (3rd Floor - Telemetry)</option>
                  <option value="SURG-401">SURG-401 (4th Floor - Post-Operative Recovery)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transfer Clinical Reason:</label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-[#183124] border border-[#274633] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none"
                  placeholder="Enter reason for bed relocation..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => setTransferModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 transition-all shadow-md shadow-[#E88F89]/20"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Clinical Note Modal */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#13251B] rounded-2xl border border-[#2C4838] shadow-2xl max-w-md w-full p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-[#1E3B2A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88F89]">
                  EHR Documentation
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Add Clinical Note for {patient.id}
                </h3>
              </div>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Author / Clinician:</label>
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-[#183124] border border-[#274633] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Clinical Observation / Note:</label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  rows={4}
                  placeholder="Document vitals titration, lab review, exam findings, or intervention..."
                  className="w-full p-2.5 bg-[#183124] border border-[#274633] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1E3B2A]">
              <button
                onClick={() => setNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 transition-all shadow-md shadow-[#E88F89]/20"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
