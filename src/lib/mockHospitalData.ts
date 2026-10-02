import { 
  Patient, 
  OperationalAlert, 
  HospitalMetrics, 
  BedAllocation, 
  StaffOnDuty,
  BedItem,
  DoctorShift,
  ScheduleConflict
} from '../types';

export const INITIAL_METRICS: HospitalMetrics = {
  totalPatients: 247,
  patientsTrendToday: 8,
  availableBeds: 38,
  icuBedsAvailable: 6,
  doctorsOnDuty: 42,
  staffCoveragePercent: 86,
  icuOccupancyPercent: 87,
  lastUpdated: '09:42 AM'
};

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-1',
    title: 'ICU capacity nearing threshold',
    category: 'ICU',
    severity: 'Critical',
    timeAgo: '2 min ago',
    timestamp: '09:40 AM',
    actionRequired: 'Prepare 6 surge beds in Ward 4B',
    resolved: false
  },
  {
    id: 'alt-2',
    title: 'Emergency wait time increased',
    category: 'Emergency',
    severity: 'Warning',
    timeAgo: '5 min ago',
    timestamp: '09:37 AM',
    actionRequired: 'Reassign 2 triage resident physicians',
    resolved: false
  },
  {
    id: 'alt-3',
    title: 'Oxygen inventory approaching limit',
    category: 'Inventory',
    severity: 'Warning',
    timeAgo: '17 min ago',
    timestamp: '09:25 AM',
    actionRequired: 'Authorize secondary manifold liquid oxygen fill',
    resolved: false
  },
  {
    id: 'alt-4',
    title: 'Telemetry battery maintenance scheduled',
    category: 'Staffing',
    severity: 'Info',
    timeAgo: '45 min ago',
    timestamp: '08:57 AM',
    actionRequired: 'Routine swap on telemetry units #12-#18',
    resolved: true
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-1024',
    name: 'Robert Hastings',
    age: 67,
    gender: 'Male',
    severity: 94,
    risk: 96,
    waitTime: '42 min',
    status: 'Critical',
    bed: 'ICU-04',
    department: 'Critical Care / Trauma',
    chiefComplaint: 'Acute respiratory distress with suspected refractory sepsis and hemodynamic instability',
    oxygenSat: { value: '88% on ambient air', level: 'Low', risk: 'High' },
    heartRate: { value: '118 bpm (sinus tachycardia)', level: 'Elevated' },
    sepsisIndicator: 'High',
    aiRecommendation: 'Immediate clinical assessment recommended.',
    admittedAt: '08:58 AM',
    lastUpdated: '2 minutes ago',
    flaggedForReview: true,
    factorBreakdown: {
      severity: 42,
      oxygen: 26,
      waitTime: 18,
      age: 9,
      other: 5,
      summary: 'High severity, prolonged waiting time, and abnormal oxygen saturation contributed most to the current priority score.'
    },
    notes: [
      {
        id: 'n-1',
        author: 'RN J. Miller',
        role: 'Triage Nurse',
        time: '09:31 AM',
        text: 'Patient expressing severe dyspnea and diaphoresis. Supplemental high-flow nasal cannula placed. Intensivist paged.'
      },
      {
        id: 'n-2',
        author: 'Dr. Jennifer Thorne, MD',
        role: 'Attending Intensivist',
        time: '08:45 AM',
        text: 'qSOFA score = 3. Arterial lactate elevated at 4.2 mmol/L. Bedside echocardiogram shows hyperdynamic left ventricle.'
      }
    ],
    timeline: [
      {
        id: 't-1',
        time: '09:42 AM',
        title: 'Vitals updated',
        description: 'SpO2 drops to 88% ambient; HR elevated to 118 bpm. Triage severity flagged at 94.',
        author: 'Telemetry Monitor System',
        category: 'vitals'
      },
      {
        id: 't-2',
        time: '09:31 AM',
        title: 'Nurse note added',
        description: 'RN J. Miller documented severe dyspnea; titrated high-flow cannula.',
        author: 'RN J. Miller',
        category: 'note'
      },
      {
        id: 't-3',
        time: '09:10 AM',
        title: 'Patient moved to ICU-04',
        description: 'Transferred from ED Resuscitation Bay 1 to Critical Care ICU-04.',
        author: 'Operations Bed Dispatch',
        category: 'transfer'
      },
      {
        id: 't-4',
        time: '08:45 AM',
        title: 'Physician assessment',
        description: 'Dr. Jennifer Thorne conducted initial critical evaluation and ordered stat ABG.',
        author: 'Dr. Jennifer Thorne, MD',
        category: 'assessment'
      },
      {
        id: 't-5',
        time: '08:12 AM',
        title: 'Patient admitted',
        description: 'Direct arrival via EMS paramedic unit with respiratory failure alert.',
        author: 'ED Intake Desk',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1098',
    name: 'Elena Rostova',
    age: 54,
    gender: 'Female',
    severity: 88,
    risk: 91,
    waitTime: '31 min',
    status: 'Critical',
    bed: 'ED-Resus 02',
    department: 'Emergency / Cardiology',
    chiefComplaint: 'Crushing substernal chest pressure, troponin elevation with ST depression in V4-V6',
    oxygenSat: { value: '92% on 2L nasal cannula', level: 'Low', risk: 'High' },
    heartRate: { value: '104 bpm', level: 'Elevated' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'Urgent cardiac catheterization consult and anticoagulation review.',
    admittedAt: '09:11 AM',
    lastUpdated: '5 minutes ago',
    flaggedForReview: false,
    factorBreakdown: {
      severity: 38,
      oxygen: 22,
      waitTime: 20,
      age: 12,
      other: 8,
      summary: 'Troponin biomarker elevation, ischemic ECG findings, and tachycardia drive priority rating.'
    },
    notes: [
      {
        id: 'n-3',
        author: 'Dr. Marcus Vance, MD',
        role: 'ED Attending',
        time: '09:20 AM',
        text: 'Initial 12-lead ECG confirmed 1.5mm ST depression anterolateral. Aspirin and Heparin drip protocol started.'
      }
    ],
    timeline: [
      {
        id: 't-6',
        time: '09:37 AM',
        title: 'Troponin-I Level Resulted',
        description: 'Laboratory reported peak troponin of 2.14 ng/mL.',
        author: 'Core Lab System',
        category: 'vitals'
      },
      {
        id: 't-7',
        time: '09:20 AM',
        title: 'Cardiology consult requested',
        description: 'Urgent cath lab activation requested for acute coronary syndrome.',
        author: 'Dr. Marcus Vance, MD',
        category: 'order'
      },
      {
        id: 't-8',
        time: '09:11 AM',
        title: 'Patient admitted to ED',
        description: 'Triage walk-in with sudden crushing chest tightness radiating to left arm.',
        author: 'Triage Desk',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1045',
    name: 'David Vance',
    age: 72,
    gender: 'Male',
    severity: 82,
    risk: 87,
    waitTime: '25 min',
    status: 'High',
    bed: 'StepDown-12',
    department: 'Pulmonology',
    chiefComplaint: 'Exacerbation of chronic obstructive pulmonary disease with hypercapnia',
    oxygenSat: { value: '90% on BiPAP', level: 'Low', risk: 'High' },
    heartRate: { value: '96 bpm', level: 'Normal' },
    sepsisIndicator: 'Moderate',
    aiRecommendation: 'Serial arterial blood gas analysis and bronchodilator titration.',
    admittedAt: '09:17 AM',
    lastUpdated: '12 minutes ago',
    flaggedForReview: false,
    factorBreakdown: {
      severity: 35,
      oxygen: 30,
      waitTime: 15,
      age: 15,
      other: 5,
      summary: 'Chronic respiratory compromise compounded by low baseline saturation and advanced age.'
    },
    timeline: [
      {
        id: 't-9',
        time: '09:30 AM',
        title: 'BiPAP Settings adjusted',
        description: 'IPAP increased to 14 cmH2O; EPAP maintained at 6 cmH2O.',
        author: 'Respiratory Therapist K. Adams',
        category: 'vitals'
      },
      {
        id: 't-10',
        time: '09:17 AM',
        title: 'Patient admitted to StepDown',
        description: 'Direct admission from outpatient clinic referral.',
        author: 'Intake Coordinator',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1011',
    name: 'Sophia Martinez',
    age: 38,
    gender: 'Female',
    severity: 76,
    risk: 79,
    waitTime: '19 min',
    status: 'High',
    bed: 'ED-08',
    department: 'Emergency',
    chiefComplaint: 'Acute onset severe right lower quadrant pain with peritoneal signs',
    oxygenSat: { value: '98% room air', level: 'Normal', risk: 'Normal' },
    heartRate: { value: '102 bpm', level: 'Elevated' },
    sepsisIndicator: 'Moderate',
    aiRecommendation: 'Expedite abdominal CT angiography and general surgical evaluation.',
    admittedAt: '09:23 AM',
    flaggedForReview: false
  },
  {
    id: 'P-1056',
    name: 'Arthur Pendelton',
    age: 81,
    gender: 'Male',
    severity: 71,
    risk: 73,
    waitTime: '16 min',
    status: 'High',
    bed: 'Cardio-06',
    department: 'Cardiology',
    chiefComplaint: 'Decompensated congestive heart failure with bilateral pitting edema',
    oxygenSat: { value: '93% room air', level: 'Low', risk: 'Normal' },
    heartRate: { value: '84 bpm', level: 'Normal' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'IV diuretic challenge and serial weight/electrolyte tracking.',
    admittedAt: '09:26 AM',
    flaggedForReview: false
  },
  {
    id: 'P-1082',
    name: 'Claire Dupont',
    age: 29,
    gender: 'Female',
    severity: 45,
    risk: 42,
    waitTime: '12 min',
    status: 'Stable',
    bed: 'GenMed-14',
    department: 'Internal Medicine',
    chiefComplaint: 'Pyelonephritis responding favorably to initial IV cephalosporin regimen',
    oxygenSat: { value: '99% room air', level: 'Normal', risk: 'Normal' },
    heartRate: { value: '74 bpm', level: 'Normal' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'Routine transition to oral antibiotics after 24-hour afebrile window.',
    admittedAt: '09:30 AM',
    flaggedForReview: false
  }
];

export const INITIAL_BEDS: BedAllocation[] = [
  { ward: 'ICU', total: 46, occupied: 40, available: 6, occupancyRate: 87 },
  { ward: 'Emergency', total: 32, occupied: 22, available: 10, occupancyRate: 69 },
  { ward: 'General Ward', total: 140, occupied: 122, available: 18, occupancyRate: 87 },
  { ward: 'Surgical', total: 28, occupied: 24, available: 4, occupancyRate: 86 }
];

export const INITIAL_STAFF: StaffOnDuty[] = [
  { department: 'Intensive Care Unit (ICU)', doctors: 8, nurses: 24, coveragePercent: 92, leadOnCall: 'Dr. Jennifer Thorne, MD' },
  { department: 'Emergency Medicine', doctors: 14, nurses: 38, coveragePercent: 88, leadOnCall: 'Dr. Marcus Vance, MD' },
  { department: 'Cardiology & Telemetry', doctors: 6, nurses: 16, coveragePercent: 84, leadOnCall: 'Dr. Elena Kim, MD' },
  { department: 'General Surgery & Trauma', doctors: 8, nurses: 18, coveragePercent: 86, leadOnCall: 'Dr. Carlos Mendoza, MD' },
  { department: 'Pulmonology & Respiratory', doctors: 6, nurses: 14, coveragePercent: 80, leadOnCall: 'Dr. Sarah Lin, MD' }
];

export const INITIAL_BED_ITEMS: BedItem[] = [
  {
    id: 'ICU-204',
    ward: 'ICU',
    floor: '2nd Floor - Critical Wing',
    type: 'Intensive Care',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Mechanical Ventilator', 'Arterial Line Monitor', 'Crash Cart Station'],
    lastCleaned: '10 min ago'
  },
  {
    id: 'ICU-205',
    ward: 'ICU',
    floor: '2nd Floor - Critical Wing',
    type: 'Intensive Care',
    status: 'Occupied',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Ventilator', 'Dialysis Port'],
    assignedPatientId: 'P-1024',
    assignedPatientName: 'Robert Hastings'
  },
  {
    id: 'ICU-206',
    ward: 'ICU',
    floor: '2nd Floor - Critical Wing',
    type: 'Negative Pressure',
    status: 'Cleaning',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['HEPA Filter', 'Ventilator'],
    lastCleaned: 'Cleaning in progress (ETA 15 min)'
  },
  {
    id: 'ICU-207',
    ward: 'ICU',
    floor: '2nd Floor - Critical Wing',
    type: 'Intensive Care',
    status: 'Reserved',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Ventilator', 'ECMO Hookup'],
    assignedPatientName: 'Reserved for OR Post-Op'
  },
  {
    id: 'ED-018',
    ward: 'Emergency',
    floor: 'Ground Floor - Rapid Triage',
    type: 'Trauma Resus',
    status: 'Occupied',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Point-of-Care Ultrasound', 'Rapid Infuser'],
    assignedPatientId: 'P-1098',
    assignedPatientName: 'Elena Rostova'
  },
  {
    id: 'ED-019',
    ward: 'Emergency',
    floor: 'Ground Floor - Rapid Triage',
    type: 'Standard Acute',
    status: 'Available',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Telemetry Hub'],
    lastCleaned: '25 min ago'
  },
  {
    id: 'ED-020',
    ward: 'Emergency',
    floor: 'Ground Floor - Rapid Triage',
    type: 'Negative Pressure',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Airborne Isolation System', 'Portable Suction'],
    lastCleaned: '5 min ago'
  },
  {
    id: 'GEN-302',
    ward: 'General Ward',
    floor: '3rd Floor - Inpatient Med-Surg',
    type: 'Standard Acute',
    status: 'Occupied',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Male',
    specialEquipment: ['IV Pump Rack', 'Bariatric Lift'],
    assignedPatientName: 'Arthur Pendelton'
  },
  {
    id: 'GEN-303',
    ward: 'General Ward',
    floor: '3rd Floor - Inpatient Med-Surg',
    type: 'Standard Acute',
    status: 'Available',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Female',
    specialEquipment: ['Telemetry Pack'],
    lastCleaned: '30 min ago'
  },
  {
    id: 'GEN-304',
    ward: 'General Ward',
    floor: '3rd Floor - Inpatient Med-Surg',
    type: 'Step-Down',
    status: 'Maintenance',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Bed Motor Sensor'],
    maintenanceNote: 'Hydraulic lift motor inspection in progress'
  },
  {
    id: 'SURG-401',
    ward: 'Surgical',
    floor: '4th Floor - Post-Operative Recovery',
    type: 'Intensive Care',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Continuous Anesthesia Monitor', 'Warming Blanket'],
    lastCleaned: '40 min ago'
  },
  {
    id: 'SURG-402',
    ward: 'Surgical',
    floor: '4th Floor - Post-Operative Recovery',
    type: 'Standard Acute',
    status: 'Blocked',
    hasVentilator: false,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Negative Pressure Seal'],
    maintenanceNote: 'Reserved for biohazard containment drill'
  }
];

export const INITIAL_SHIFTS: DoctorShift[] = [
  {
    id: 's-1',
    doctorName: 'Dr. Jennifer Thorne, MD',
    department: 'Intensive Care Unit (ICU)',
    date: 'Today',
    shift: '07:00 – 19:00 (Day Critical)',
    role: 'Lead Intensivist',
    status: 'Active'
  },
  {
    id: 's-2',
    doctorName: 'Dr. Marcus Vance, MD',
    department: 'Emergency Medicine',
    date: 'Today',
    shift: '08:00 – 16:00 (ED Morning)',
    role: 'Attending Physician',
    status: 'Active'
  },
  {
    id: 's-3',
    doctorName: 'Dr. Amit Patel, MD',
    department: 'Emergency Medicine',
    date: 'Today',
    shift: '14:00 – 22:00 (ED Swing)',
    role: 'ED Senior Physician',
    status: 'Conflict',
    conflictDescription: 'Assigned to two overlapping shifts: ED Swing (14:00-22:00) & Urgent Care Lead (13:00-19:00)'
  },
  {
    id: 's-4',
    doctorName: 'Dr. Elena Kim, MD',
    department: 'Cardiology & Telemetry',
    date: 'Today',
    shift: '09:00 – 17:00 (Cath/Inpatient)',
    role: 'Cardiology On Call',
    status: 'Active'
  },
  {
    id: 's-5',
    doctorName: 'Dr. Carlos Mendoza, MD',
    department: 'General Surgery & Trauma',
    date: 'Today',
    shift: '07:00 – 15:00 (OR Call)',
    role: 'Trauma Surgeon',
    status: 'Active'
  },
  {
    id: 's-6',
    doctorName: 'Dr. Sarah Lin, MD',
    department: 'Pulmonology & Respiratory',
    date: 'Today',
    shift: '08:00 – 18:00 (Consults)',
    role: 'Pulmonologist',
    status: 'Active'
  },
  {
    id: 's-7',
    doctorName: 'Dr. Brian O’Connor, MD',
    department: 'Emergency Medicine',
    date: 'Today',
    shift: '16:00 – 00:00 (Evening)',
    role: 'ED Attending',
    status: 'Scheduled'
  }
];

export const INITIAL_CONFLICTS: ScheduleConflict[] = [
  {
    id: 'cf-1',
    doctorName: 'Dr. Amit Patel, MD',
    department: 'Emergency Medicine',
    shifts: ['ED Swing (14:00 – 22:00)', 'Urgent Care Lead (13:00 – 19:00)'],
    conflictType: 'Overlapping Shift',
    severity: 'High',
    recommendation: 'Reassign Urgent Care Lead to Dr. Brian O’Connor or float Dr. Lin for triage review.'
  },
  {
    id: 'cf-2',
    doctorName: 'Emergency Department',
    department: 'Emergency Medicine',
    shifts: ['14:00 – 16:00 Shift Window'],
    conflictType: 'Under-Coverage',
    severity: 'High',
    recommendation: 'Current coverage has 3 doctors on duty; minimum configured requirement is 4 doctors.'
  }
];

export const AVAILABLE_DOCTORS = [
  { name: 'Dr. Brian O’Connor, MD', department: 'Emergency Medicine', status: 'Available On-Call', contact: 'Ext. 4022' },
  { name: 'Dr. Maya Hansen, MD', department: 'Critical Care / ICU', status: 'Available Standby', contact: 'Ext. 4038' },
  { name: 'Dr. Daniel Cho, MD', department: 'Internal Medicine', status: 'Available In-House', contact: 'Ext. 4110' },
  { name: 'Dr. Lisa Bennett, MD', department: 'General Surgery', status: 'On-Call Home (15m response)', contact: 'Ext. 4209' }
];

export const DAILY_CHANGES = [
  { label: 'ICU Occupancy', change: '+8%', direction: 'up' as const, isConcerning: true, detail: '87% current (up from 79% yesterday)' },
  { label: 'Emergency Wait', change: '+12 min', direction: 'up' as const, isConcerning: true, detail: '42 min avg (target threshold: 30 min)' },
  { label: 'Available Beds', change: '-6 beds', direction: 'down' as const, isConcerning: true, detail: '38 beds hospital-wide (6 ICU beds free)' },
  { label: 'Critical Patients', change: '+3 patients', direction: 'up' as const, isConcerning: true, detail: '12 active critical vs 9 yesterday' },
  { label: 'Doctor Coverage', change: '-4%', direction: 'down' as const, isConcerning: false, detail: '86% coverage with 2 shift gaps flagged' }
];

