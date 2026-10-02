import React, { useRef, useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import { TabType } from '../types';
import { SAMPLE_NOTES, SampleNote } from '../lib/sampleNotes';

interface SubmitFormProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
  inputText: string;
  setInputText: (val: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  onSubmit: () => void;
  onLoadSample: (sample: SampleNote) => void;
}

export const SubmitForm: React.FC<SubmitFormProps> = ({
  tab,
  setTab,
  inputText,
  setInputText,
  uploadedFile,
  setUploadedFile,
  onSubmit,
  onLoadSample
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const isReady = tab === 'text' ? inputText.trim().length > 10 : !!uploadedFile;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    // If it's a text/markdown file, also read into text for preview
    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        if (content) {
          setInputText(content);
        }
      };
      reader.readAsText(file);
    } else {
      // Simulate file content summary for PDF / images
      setInputText(`[Attached Clinical Record: ${file.name} - ${(file.size / 1024).toFixed(1)} KB]`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Centered Headline & Subtext */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
          <span>Clinical NLP Extraction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Submit clinical documentation
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
          Paste unstructured clinical notes or upload documentation (PDF, images, TXT) to generate structured summaries, vitals, and inconsistency flags.
        </p>
      </div>

      {/* Quick Sample Presets */}
      <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Test Clinical Presets
          </span>
          <span className="text-xs text-slate-400">Click to load realistic sample EHR note</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_NOTES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onLoadSample(sample)}
              className="text-left px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 bg-slate-50/60 transition-all group flex flex-col justify-between"
            >
              <div className="text-xs font-semibold text-slate-800 group-hover:text-teal-900 line-clamp-1">
                {sample.title}
              </div>
              <div className="mt-1 text-[11px] font-medium text-slate-500">
                {sample.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        {/* Tabs: [Paste text] [Upload file] */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-slate-200 pb-4 mb-6">
          <button
            type="button"
            onClick={() => setTab('text')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'text'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste text</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'file'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload file</span>
          </button>
        </div>

        {/* Tab 1: Textarea */}
        {tab === 'text' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste EHR consultation notes, discharge summaries, triage assessments, lab records, or clinical orders here...

Example:
Patient: Sarah Jenkins, 45F. Presents with acute onset epigastric pain radiating to back. Vitals: BP 142/88, HR 88, SpO2 98%. Allergies: Sulfa drugs. Active meds: Lisinopril 10mg..."
                rows={11}
                className="w-full rounded-xl border border-slate-300 p-4 text-sm font-mono leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all resize-y bg-slate-50/30"
              />
              {inputText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Clear text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>{wordCount} words · {charCount} characters</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Info className="w-3.5 h-3.5" /> Minimum 10 characters for clinical analysis
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Dropzone */}
        {tab === 'file' && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-teal-600 bg-teal-50/70 scale-[0.99]'
                  : uploadedFile
                  ? 'border-teal-500 bg-teal-50/30'
                  : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB · Ready to analyze</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-800">
                      Drag file or click to browse
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, TXT, DOCX, or scanned EHR images up to 25MB
                    </p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-white rounded-md border border-slate-200 text-slate-600 shadow-2xs">
                    Choose local file
                  </span>
                </>
              )}
            </div>

            {uploadedFile && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span className="truncate max-w-sm">
                  Loaded: <strong className="font-semibold">{uploadedFile.name}</strong>
                </span>
                <span className="text-teal-700 font-medium">✓ Ready for processing</span>
              </div>
            )}
          </div>
        )}

        {/* Primary CTA: [ Analyze document ] */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isReady}
            className={`w-full sm:w-auto min-w-[260px] flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-sm ${
              isReady
                ? 'bg-teal-700 hover:bg-teal-800 active:scale-98 text-white cursor-pointer shadow-teal-900/10'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5 text-teal-200" />
            <span>Analyze document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
