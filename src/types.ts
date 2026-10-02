export type MediFlowView = 
  | 'landing' 
  | 'dashboard' 
  | 'patients' 
  | 'patient-detail' 
  | 'beds' 
  | 'staff' 
  | 'alerts' 
  | 'insights'
  | 'reports';

export type HospitalUserRole = 
  | 'administrator' 
  | 'doctor' 
  | 'operations_manager' 
  | 'nursing_staff' 
  | 'management';

export interface PatientTimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  author: string;
  category: 'vitals' | 'note' | 'transfer' | 'assessment' | 'admission' | 'order';
}

export type TabType = 'text' | 'file';
export type AppStatus = 'idle' | 'processing' | 'done' | 'error';
export type AppView = 'submit' | 'processing' | 'report' | 'history';

export interface ClinicianProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'clinician' | 'physician' | 'auditor';
  department?: string;
  createdAt?: string;
}

export interface ClinicalItem {
  id?: string;
  label?: string;
  value: string;
  status?: 'normal' | 'abnormal' | 'critical' | 'neutral';
  code?: string;
  note?: string;
}

export type SectionData = string[] | ClinicalItem[];

export interface ClinicalReportSections {
  'Patient Info': SectionData;
  'Symptoms': SectionData;
  'Diagnoses': SectionData;
  'Medications': SectionData;
  'Vitals': SectionData;
  'Allergies': SectionData;
  'Observations': SectionData;
  'Concerns': SectionData;
  'Missing Info': SectionData;
  'Inconsistencies': SectionData;
  'Requires Review': SectionData;
}

export interface PatientMeta {
  name: string;
  mrn: string;
  age: string | number;
  gender: string;
  physician: string;
  encounterDate: string;
}

export interface ClinicalReport {
  id: string;
  title: string;
  sourceType: 'text' | 'file';
  filename?: string;
  fileSnippet?: string;
  rawText?: string;
  report_summary: string;
  created_at: string;
  status: 'validated' | 'requires_review' | 'flagged';
  patient_meta?: PatientMeta;
  metrics: {
    totalSectionsFound: number;
    requiresReviewCount: number;
    inconsistencyCount: number;
    missingCount: number;
  };
  sections: ClinicalReportSections;
}

export interface HistoryItem {
  id: string;
  title: string;
  filename: string;
  snippet: string;
  date: string;
  status: 'validated' | 'requires_review' | 'flagged';
  report: ClinicalReport;
}

export interface ClinicalNote {
  id: string;
  author: string;
  time: string;
  role: string;
  text: string;
}

export interface Patient {
  id: string; // e.g. 'P-1024'
  name: string;
  age: number;
  gender: string;
  severity: number; // 0 - 100
  risk: number; // percentage 0 - 100
  waitTime: string; // e.g. '42 min'
  status: 'Critical' | 'High' | 'Stable';
  bed?: string;
  chiefComplaint: string;
  oxygenSat: { value: string; level: 'Low' | 'Normal' | 'Elevated' | 'Critical'; risk: 'High' | 'Normal' };
  heartRate: { value: string; level: 'Normal' | 'Elevated' | 'Tachycardic' };
  sepsisIndicator: 'High' | 'Moderate' | 'Low';
  aiRecommendation: string;
  department: string;
  admittedAt: string;
  flaggedForReview?: boolean;
  lastUpdated?: string;
  timeline?: PatientTimelineEvent[];
  notes?: ClinicalNote[];
  factorBreakdown?: {
    severity: number;
    oxygen: number;
    waitTime: number;
    age: number;
    other: number;
    summary: string;
  };
}

export interface OperationalAlert {
  id: string;
  title: string;
  category: 'ICU' | 'Emergency' | 'Inventory' | 'Staffing';
  severity: 'Critical' | 'Warning' | 'Info';
  timeAgo: string;
  timestamp: string;
  resolved?: boolean;
  actionRequired?: string;
}

export interface BedAllocation {
  ward: 'ICU' | 'Emergency' | 'General Ward' | 'Surgical';
  total: number;
  occupied: number;
  available: number;
  occupancyRate: number;
}

export type BedLifecycleStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Blocked';

export interface BedItem {
  id: string; // e.g. 'ICU-204'
  ward: 'ICU' | 'Emergency' | 'General Ward' | 'Surgical';
  floor: string;
  type: 'Intensive Care' | 'Standard Acute' | 'Negative Pressure' | 'Step-Down' | 'Trauma Resus';
  status: BedLifecycleStatus;
  hasVentilator: boolean;
  hasIsolation: boolean;
  genderWard: 'Any' | 'Male' | 'Female';
  specialEquipment: string[];
  assignedPatientId?: string;
  assignedPatientName?: string;
  lastCleaned?: string;
  maintenanceNote?: string;
}

export interface DoctorShift {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  shift: string;
  role: string;
  status: 'Active' | 'Scheduled' | 'Conflict' | 'Leave';
  conflictDescription?: string;
}

export interface ScheduleConflict {
  id: string;
  doctorName: string;
  department: string;
  shifts: string[];
  conflictType: 'Overlapping Shift' | 'Under-Coverage' | 'Consecutive Hours' | 'Leave Conflict';
  severity: 'High' | 'Medium';
  recommendation: string;
}

export interface StaffOnDuty {
  department: string;
  doctors: number;
  nurses: number;
  coveragePercent: number;
  leadOnCall: string;
}

export interface HospitalMetrics {
  totalPatients: number;
  patientsTrendToday: number;
  availableBeds: number;
  icuBedsAvailable: number;
  doctorsOnDuty: number;
  staffCoveragePercent: number;
  icuOccupancyPercent: number;
  lastUpdated: string;
}

