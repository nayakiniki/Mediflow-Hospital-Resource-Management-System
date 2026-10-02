import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Search, 
  ShieldAlert, 
  HelpCircle, 
  FileText,
  User,
  HeartPulse,
  Pill,
  Stethoscope,
  Activity,
  Eye,
  AlertCircle
} from 'lucide-react';
import { ClinicalReport, ClinicalItem, SectionData } from '../types';

interface ReportViewProps {
  report: ClinicalReport;
  onNew: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onNew }) => {
  // Collapsible accordion state for all 11 sections (open by default, or all expandable)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Patient Info': true,
    'Symptoms': true,
    'Diagnoses': true,
    'Medications': true,
    'Vitals': true,
    'Allergies': true,
    'Observations': true,
    'Concerns': true,
    'Missing Info': true,
    'Inconsistencies': true,
    'Requires Review': true
  });

  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleExpandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(report.sections).forEach((key) => {
      allExpanded[key] = true;
    });
    setOpenSections(allExpanded);
  };

  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(report.sections).forEach((key) => {
      allCollapsed[key] = false;
    });
    setOpenSections(allCollapsed);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `CLINICAL REPORT SUMMARY: ${report.title}\nStatus: ${report.status}\nProcessed: ${report.created_at}\n\n${report.report_summary}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  // Section styling definition according to specification:
  // neutral for extracted data, amber for "requires review", red for "inconsistency", gray for "missing"
  const getSectionTheme = (title: string) => {
    switch (title) {
      case 'Requires Review':
        return {
          category: 'review',
          border: 'border-amber-300',
          headerBg: 'bg-amber-50/80 hover:bg-amber-100/60',
          textColor: 'text-amber-900',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          iconColor: 'text-amber-600',
          indicatorColor: 'bg-amber-500',
          tag: 'Requires Review'
        };
      case 'Inconsistencies':
        return {
          category: 'inconsistency',
          border: 'border-rose-300',
          headerBg: 'bg-rose-50/80 hover:bg-rose-100/60',
          textColor: 'text-rose-900',
          badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
          iconColor: 'text-rose-600',
          indicatorColor: 'bg-rose-500',
          tag: 'Contradiction / Conflict'
        };
      case 'Missing Info':
        return {
          category: 'missing',
          border: 'border-zinc-300',
          headerBg: 'bg-zinc-100/70 hover:bg-zinc-100',
          textColor: 'text-zinc-800',
          badgeBg: 'bg-zinc-200/80 text-zinc-700 border-zinc-300',
          iconColor: 'text-zinc-500',
          indicatorColor: 'bg-zinc-400',
          tag: 'Omission / Missing'
        };
      default:
        // Neutral for standard extracted data
        return {
          category: 'neutral',
          border: 'border-slate-200',
          headerBg: 'bg-slate-50/80 hover:bg-slate-100/70',
          textColor: 'text-slate-800',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          iconColor: 'text-slate-600',
          indicatorColor: 'bg-teal-600',
          tag: 'Extracted Data'
        };
    }
  };

  const getSectionIcon = (title: string) => {
    switch (title) {
      case 'Patient Info': return <User className="w-4 h-4" />;
      case 'Symptoms': return <Activity className="w-4 h-4" />;
      case 'Diagnoses': return <Stethoscope className="w-4 h-4" />;
      case 'Medications': return <Pill className="w-4 h-4" />;
      case 'Vitals': return <HeartPulse className="w-4 h-4" />;
      case 'Allergies': return <ShieldAlert className="w-4 h-4" />;
      case 'Observations': return <Eye className="w-4 h-4" />;
      case 'Concerns': return <AlertTriangle className="w-4 h-4" />;
      case 'Missing Info': return <HelpCircle className="w-4 h-4" />;
      case 'Inconsistencies': return <AlertOctagon className="w-4 h-4" />;
      case 'Requires Review': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const hasInconsistencies = (report.sections['Inconsistencies'] || []).length > 0;
  const hasReviewItems = (report.sections['Requires Review'] || []).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Top Banner Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            Document Analysis Output
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {report.title}
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            title="Copy Report Summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            title="Export full JSON structure"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            onClick={onNew}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-all shadow-2xs"
          >
            <span>+ Analyze Another</span>
          </button>
        </div>
      </div>

      {/* Two-Column Grid Top Section (Frame 3 Canva Specification) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left Column (col-span-2): REPORT SUMMARY (card) - 3-5 sentence overview */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Report Summary
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Clinical Overview
              </span>
            </div>

            {/* 3-5 Sentence Overview Paragraph */}
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {report.report_summary}
            </p>
          </div>

          {/* Quick clinical indicators footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            {report.patient_meta?.name !== 'Not found in document' && (
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md border border-slate-200">
                Patient: <strong className="text-slate-900">{report.patient_meta?.name}</strong>
              </span>
            )}
            {report.metrics.inconsistencyCount > 0 && (
              <span className="text-xs bg-rose-50 text-rose-800 font-medium px-2.5 py-1 rounded-md border border-rose-200 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                {report.metrics.inconsistencyCount} Inconsistencies Detected
              </span>
            )}
            {report.metrics.requiresReviewCount > 0 && (
              <span className="text-xs bg-amber-50 text-amber-800 font-medium px-2.5 py-1 rounded-md border border-amber-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                {report.metrics.requiresReviewCount} Review Items Flagged
              </span>
            )}
          </div>
        </div>

        {/* Right Column (col-span-1): Meta Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Document Metadata
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                ID: {report.id.slice(0, 10)}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500 font-medium">Processed:</span>
                <span className="text-slate-800 font-semibold text-right">
                  {report.created_at}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500 font-medium">Validation Status:</span>
                {report.status === 'validated' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Validated</span>
                  </span>
                )}
                {report.status === 'requires_review' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>⚠ Requires Review</span>
                  </span>
                )}
                {report.status === 'flagged' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                    <span>⚠ Flagged Conflict</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-slate-500 font-medium">Source Document:</span>
                <span className="text-slate-800 font-mono text-[11px] truncate max-w-[150px]" title={report.filename}>
                  {report.filename}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Input Format:</span>
                <span className="text-slate-700 uppercase font-semibold text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                  {report.sourceType}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>HIPAA-Safe Processing</span>
            <span className="font-mono">11 Sections Evaluated</span>
          </div>
        </div>
      </div>

      {/* Accordion Controls Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter extracted clinical entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion / Tabbed Sections (Specification: All 11 Sections) */}
      <div className="space-y-3">
        {Object.entries(report.sections).map(([sectionKey, rawData]) => {
          const theme = getSectionTheme(sectionKey);
          const isOpen = !!openSections[sectionKey];

          // Normalize items
          const items: ClinicalItem[] = Array.isArray(rawData)
            ? rawData.map((it, idx) =>
                typeof it === 'string'
                  ? { id: `${sectionKey}-${idx}`, value: it }
                  : it
              )
            : [];

          // Filter items by search term if active
          const filteredItems = searchTerm.trim()
            ? items.filter((item) =>
                item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.label && item.label.toLowerCase().includes(searchTerm.toLowerCase()))
              )
            : items;

          const isEmpty = items.length === 0;

          return (
            <div
              key={sectionKey}
              className={`bg-white rounded-xl border transition-all overflow-hidden shadow-2xs ${theme.border}`}
            >
              {/* Collapsible Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(sectionKey)}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left transition-colors ${theme.headerBg}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${theme.badgeBg}`}>
                    {getSectionIcon(sectionKey)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold tracking-tight ${theme.textColor}`}>
                        {sectionKey}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
                        {isEmpty ? '0 items' : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 uppercase hidden sm:inline">
                    {theme.tag}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Collapsible Content Area */}
              {isOpen && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  {isEmpty ? (
                    /* Exact specification requirement: empty ones say "Not found in document" */
                    <div className="py-4 px-3 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                      Not found in document
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="py-3 text-center text-xs text-slate-400 italic">
                      No matching items found for "{searchTerm}" in this section.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredItems.map((item, idx) => {
                        const isCritical = item.status === 'critical' || sectionKey === 'Inconsistencies';
                        const isAbnormal = item.status === 'abnormal';
                        const isReview = sectionKey === 'Requires Review';
                        const isMissing = sectionKey === 'Missing Info';

                        return (
                          <div
                            key={item.id || idx}
                            className={`p-3 rounded-lg text-xs leading-relaxed flex items-start justify-between gap-3 border transition-colors ${
                              isCritical
                                ? 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                                : isReview
                                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                                : isMissing
                                ? 'bg-zinc-50 border-zinc-200 text-zinc-700'
                                : isAbnormal
                                ? 'bg-amber-50/40 border-amber-200 text-slate-900'
                                : 'bg-slate-50/70 border-slate-200/80 text-slate-800'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                isCritical
                                  ? 'bg-rose-500'
                                  : isReview
                                  ? 'bg-amber-500'
                                  : isMissing
                                  ? 'bg-zinc-400'
                                  : isAbnormal
                                  ? 'bg-amber-500'
                                  : 'bg-teal-600'
                              }`} />

                              <div>
                                {item.label && (
                                  <span className="font-semibold text-slate-900 mr-1.5">
                                    {item.label}:
                                  </span>
                                )}
                                <span className="text-slate-800">
                                  {item.value}
                                </span>
                                {item.note && (
                                  <p className="mt-1 text-[11px] text-slate-500 font-mono">
                                    Note: {item.note}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Badge flags */}
                            {isCritical && (
                              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200/70 text-rose-800 uppercase">
                                Action Needed
                              </span>
                            )}
                            {isAbnormal && !isCritical && (
                              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                                Flagged
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
