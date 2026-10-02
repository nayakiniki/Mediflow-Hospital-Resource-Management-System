import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  Trash2, 
  Search, 
  Clock, 
  Plus,
  Filter,
  Cloud,
  Lock,
  LogIn
} from 'lucide-react';
import { User } from 'firebase/auth';
import { HistoryItem, ClinicalReport, ClinicianProfile } from '../types';

interface HistoryScreenProps {
  history: HistoryItem[];
  user?: User | null;
  profile?: ClinicianProfile | null;
  onSelectReport: (report: ClinicalReport) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
  onNew: () => void;
  onSignIn?: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  user,
  profile,
  onSelectReport,
  onDeleteHistoryItem,
  onClearHistory,
  onNew,
  onSignIn
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'validated' | 'requires_review' | 'flagged'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.snippet.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      {/* Clinician Firestore Sync Banner */}
      {user ? (
        <div className="mb-6 p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-teal-900">
          <div className="flex items-center gap-2.5">
            <Cloud className="w-5 h-5 text-teal-700 shrink-0" />
            <div>
              <p className="font-bold">
                Connected to Firestore User Profile: {user.displayName || user.email}
              </p>
              <p className="text-teal-700 text-[11px]">
                All document history and reviews are securely synced to your cloud account in real-time.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-teal-100 text-teal-800 self-start sm:self-auto font-semibold">
            {profile?.role || 'Clinician'} Profile
          </span>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Browsing Local Documentation Records</p>
              <p className="text-slate-500 text-[11px]">
                Sign in with your Clinician account to permanently synchronize and access your reports across devices.
              </p>
            </div>
          </div>
          {onSignIn && (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors shrink-0 self-start sm:self-auto"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In to Sync</span>
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Clinical Documentation History
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse and review past processed clinical notes, diagnostic evaluations, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 px-3 py-2 rounded-lg border border-transparent hover:border-rose-200 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search history by patient name, diagnosis, or filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setStatusFilter('validated')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'validated'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Validated
          </button>
          <button
            onClick={() => setStatusFilter('requires_review')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'requires_review'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Review
          </button>
          <button
            onClick={() => setStatusFilter('flagged')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              statusFilter === 'flagged'
                ? 'bg-rose-700 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Flagged
          </button>
        </div>
      </div>

      {/* History Table / List (Frame 4 Canva Specification) */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'No historical reports match the active filter criteria.'
              : 'Submit and analyze a clinical note or document to start building your record history.'}
          </p>
          <button
            onClick={onNew}
            className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-all shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Analyze First Document</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Filename / Snippet</th>
                  <th className="py-3.5 px-5">Status Badge</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredHistory.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectReport(item.report)}
                    >
                      {/* Date */}
                      <td className="py-4 px-5 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </div>
                      </td>

                      {/* Filename / Snippet */}
                      <td className="py-4 px-5 max-w-md">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5" title={item.filename}>
                          File: {item.filename}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-normal">
                          {item.snippet}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {item.status === 'validated' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>✓ Validated</span>
                          </span>
                        )}
                        {item.status === 'requires_review' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>⚠ Requires Review</span>
                          </span>
                        )}
                        {item.status === 'flagged' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertOctagon className="w-3 h-3 text-rose-600" />
                            <span>⚠ Flagged Conflict</span>
                          </span>
                        )}
                      </td>

                      {/* View Report Link -> opens screen 3 pre-filled */}
                      <td className="py-4 px-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onSelectReport(item.report)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-teal-700 hover:text-teal-900 hover:bg-teal-50 font-semibold text-xs transition-colors"
                          >
                            <span>View report</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteHistoryItem(item.id)}
                            className="p-1.5 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
