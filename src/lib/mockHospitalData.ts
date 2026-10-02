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
    title: 'ICU / MICU capacity nearing threshold',
    category: 'ICU',
    severity: 'Critical',
    timeAgo: '2 min ago',
    timestamp: '09:40 AM',
    actionRequired: 'Prepare 6 step-down HDU surge beds in Ward 4B (NABH surge protocol)',
    resolved: false
  },
  {
    id: 'alt-2',
    title: 'Casualty / Emergency wait time elevated',
    category: 'Emergency',
    severity: 'Warning',
    timeAgo: '5 min ago',
    timestamp: '09:37 AM',
    actionRequired: 'Reassign 2 Senior Resident (SR) triage physicians to Yellow Triage Bay',
    resolved: false
  },
  {
    id: 'alt-3',
    title: 'Liquid Medical Oxygen (LMO) tank buffer check',
    category: 'Inventory',
    severity: 'Warning',
    timeAgo: '17 min ago',
    timestamp: '09:25 AM',
    actionRequired: 'Authorize secondary manifold cryogenic tank replenishment (PESO protocol)',
    resolved: false
  },
  {
    id: 'alt-4',
    title: 'Biomedical engineering telemetry calibration',
    category: 'Staffing',
    severity: 'Info',
    timeAgo: '45 min ago',
    timestamp: '08:57 AM',
    actionRequired: 'Routine NABH preventive maintenance on multi-para monitors #12-#18',
    resolved: true
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-1024',
    name: 'Ramesh Sharma',
    age: 67,
    gender: 'Male',
    severity: 94,
    risk: 96,
    waitTime: '42 min',
    status: 'Critical',
    bed: 'ICU-04',
    department: 'Critical Care / MICU',
    chiefComplaint: 'Severe Dengue with plasma leakage, profound thrombocytopenia (platelets 18,000/μL), and refractory septic shock',
    oxygenSat: { value: '88% on ambient air', level: 'Low', risk: 'High' },
    heartRate: { value: '118 bpm (sinus tachycardia)', level: 'Elevated' },
    sepsisIndicator: 'High',
    aiRecommendation: 'Initiate protocolized IV fluid resuscitation (WHO/NVBDCP guidelines), central venous line insertion, and blood component reservation.',
    admittedAt: '08:58 AM',
    lastUpdated: '2 minutes ago',
    flaggedForReview: true,
    factorBreakdown: {
      severity: 42,
      oxygen: 26,
      waitTime: 18,
      age: 9,
      other: 5,
      summary: 'Severe hemodynamic collapse, prolonged Casualty triage wait time, and hypoxia contributed most to current priority score (ABHA: 91-8472-1024-5821).'
    },
    notes: [
      {
        id: 'n-1',
        author: 'Sister Marykutty Kurian',
        role: 'Triage Nursing Officer',
        time: '09:31 AM',
        text: 'Patient displaying cold clammy extremities, feeble thready pulse. High-flow oxygen started via non-rebreather mask. Intensivist and blood bank alerted for RDP/SDP.'
      },
      {
        id: 'n-2',
        author: 'Dr. Ananya Sen, MD (AIIMS)',
        role: 'Chief Intensivist & Critical Care Lead',
        time: '08:45 AM',
        text: 'qSOFA score = 3. Arterial lactate elevated at 4.2 mmol/L. Bedside echocardiogram reveals IVC collapsibility < 30%. Initiated noradrenaline infusion titration.'
      }
    ],
    timeline: [
      {
        id: 't-1',
        time: '09:42 AM',
        title: 'Telemetry vitals synchronized',
        description: 'SpO2 88% ambient; HR elevated to 118 bpm; BP 84/56 mmHg. AI triage urgency re-scored to 94 (Critical).',
        author: 'Central Telemetry Monitor (BPL Elite)',
        category: 'vitals'
      },
      {
        id: 't-2',
        time: '09:31 AM',
        title: 'Clinical triage note recorded',
        description: 'Sister Marykutty Kurian titrated non-rebreather mask to 10 L/min and sent stat Dengue NS1 & complete hemogram.',
        author: 'Sister Marykutty Kurian',
        category: 'note'
      },
      {
        id: 't-3',
        time: '09:10 AM',
        title: 'Bed allocated to MICU-04',
        description: 'Transferred from Casualty Red Bay to Intensive Care Unit Bed ICU-04.',
        author: 'Bed Dispatch / NABH Operations',
        category: 'transfer'
      },
      {
        id: 't-4',
        time: '08:45 AM',
        title: 'Attending physician evaluation',
        description: 'Dr. Ananya Sen, MD evaluated septic shock parameters and initiated central arterial line placement.',
        author: 'Dr. Ananya Sen, MD (AIIMS)',
        category: 'assessment'
      },
      {
        id: 't-5',
        time: '08:12 AM',
        title: 'Admitted via Emergency Casualty',
        description: 'Direct 108 Emergency Ambulance transfer with acute respiratory distress and severe petechial purpura.',
        author: 'Casualty Reception Desk',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1098',
    name: 'Rajeshwari Rao',
    age: 42,
    gender: 'Female',
    severity: 89,
    risk: 91,
    waitTime: '31 min',
    status: 'Critical',
    bed: 'ICU-08',
    department: 'Intensive Coronary Care (ICCU)',
    chiefComplaint: 'Acute anterior wall myocardial infarction (STEMI) with ventricular ectopics and cardiogenic pre-shock',
    oxygenSat: { value: '91% on nasal prongs', level: 'Low', risk: 'High' },
    heartRate: { value: '110 bpm', level: 'Elevated' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'Expedite primary percutaneous coronary intervention (PCI) within the 90-minute door-to-balloon window.',
    admittedAt: '09:04 AM',
    lastUpdated: '5 minutes ago',
    flaggedForReview: true,
    factorBreakdown: {
      severity: 45,
      oxygen: 22,
      waitTime: 20,
      age: 8,
      other: 5,
      summary: 'ST-segment elevations across leads V1-V4 and cardiogenic hypotension dictate emergency catheterization.'
    },
    notes: [
      {
        id: 'n-3',
        author: 'Dr. Sneha Kulkarni, MD, DM',
        role: 'Consultant Interventional Cardiologist',
        time: '09:20 AM',
        text: 'ECG shows 4mm ST elevations V1-V4 with reciprocal depressions. Loading dose of Aspirin 325mg and Ticagrelor 180mg administered. Cath Lab team activated.'
      }
    ],
    timeline: [
      {
        id: 't-6',
        time: '09:35 AM',
        title: 'Cath Lab transit cleared',
        description: 'Primary PCI scheduled in Cath Lab 2 with Dr. Sneha Kulkarni. Consent recorded on ABDM portal.',
        author: 'ICCU Coordinator',
        category: 'order'
      },
      {
        id: 't-7',
        time: '09:20 AM',
        title: 'Cardiology consult completed',
        description: 'Stat 12-lead ECG confirmed anterior STEMI; dual antiplatelet therapy loaded.',
        author: 'Dr. Sneha Kulkarni, MD, DM',
        category: 'assessment'
      },
      {
        id: 't-8',
        time: '09:04 AM',
        title: 'Admitted to Casualty triage',
        description: 'Walk-in arrival with severe retrosternal chest pain radiating to left arm and jaw.',
        author: 'Casualty Triage Desk',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1045',
    name: 'Aarav Mehta',
    age: 72,
    gender: 'Male',
    severity: 82,
    risk: 87,
    waitTime: '25 min',
    status: 'High',
    bed: 'HDU-12',
    department: 'Pulmonology & Respiratory Care',
    chiefComplaint: 'Acute exacerbation of chronic obstructive pulmonary disease (COPD) with Type-II hypercapnic respiratory failure',
    oxygenSat: { value: '90% on BiPAP', level: 'Low', risk: 'High' },
    heartRate: { value: '96 bpm', level: 'Normal' },
    sepsisIndicator: 'Moderate',
    aiRecommendation: 'Serial arterial blood gas (ABG) analysis, nebulized bronchodilators, and systemic corticosteroid administration.',
    admittedAt: '09:17 AM',
    lastUpdated: '12 minutes ago',
    flaggedForReview: false,
    factorBreakdown: {
      severity: 35,
      oxygen: 30,
      waitTime: 15,
      age: 15,
      other: 5,
      summary: 'Chronic respiratory compromise compounded by high PaCO2 (62 mmHg) and advanced age.'
    },
    timeline: [
      {
        id: 't-9',
        time: '09:30 AM',
        title: 'NIV BiPAP settings titrated',
        description: 'IPAP set to 14 cmH2O, EPAP to 6 cmH2O on Respironics V60; FiO2 maintained at 35%.',
        author: 'Respiratory Therapist K. Nair',
        category: 'vitals'
      },
      {
        id: 't-10',
        time: '09:17 AM',
        title: 'Admitted to High Dependency Unit (HDU)',
        description: 'Step-up admission from Chest Clinic referral.',
        author: 'Pulmonology Registrar',
        category: 'admission'
      }
    ]
  },
  {
    id: 'P-1011',
    name: 'Sunita Patel',
    age: 38,
    gender: 'Female',
    severity: 76,
    risk: 79,
    waitTime: '19 min',
    status: 'High',
    bed: 'ED-08',
    department: 'Casualty / Emergency',
    chiefComplaint: 'Acute calculous cholecystitis with Murphy’s sign positive and localized guarding in right hypochondrium',
    oxygenSat: { value: '98% room air', level: 'Normal', risk: 'Normal' },
    heartRate: { value: '102 bpm', level: 'Elevated' },
    sepsisIndicator: 'Moderate',
    aiRecommendation: 'Urgent ultrasound abdomen, IV third-generation cephalosporin, and surgical clearance for laparoscopic cholecystectomy.',
    admittedAt: '09:23 AM',
    flaggedForReview: false
  },
  {
    id: 'P-1056',
    name: 'Vikram Singh',
    age: 54,
    gender: 'Male',
    severity: 71,
    risk: 73,
    waitTime: '16 min',
    status: 'High',
    bed: 'Cardio-06',
    department: 'Cardiology & HDU',
    chiefComplaint: 'Decompensated dilated cardiomyopathy with acute congestive cardiac failure and bilateral pedal edema',
    oxygenSat: { value: '93% room air', level: 'Low', risk: 'Normal' },
    heartRate: { value: '84 bpm', level: 'Normal' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'IV loop diuretic challenge (Furosemide 40mg stat), strict fluid balance chart, and serial serum creatinine monitoring.',
    admittedAt: '09:26 AM',
    flaggedForReview: false
  },
  {
    id: 'P-1082',
    name: 'Priya Nair',
    age: 29,
    gender: 'Female',
    severity: 45,
    risk: 42,
    waitTime: '12 min',
    status: 'Stable',
    bed: 'GEN-302',
    department: 'General Medicine',
    chiefComplaint: 'Complicated urinary tract infection (Pyelonephritis) showing clinical resolution with IV Ceftriaxone',
    oxygenSat: { value: '99% room air', level: 'Normal', risk: 'Normal' },
    heartRate: { value: '74 bpm', level: 'Normal' },
    sepsisIndicator: 'Low',
    aiRecommendation: 'Transition to oral Cefixime 200mg BD following 24 hours of afebrile period; discharge planned tomorrow.',
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
  { department: 'Intensive Care Unit (ICU / MICU)', doctors: 8, nurses: 24, coveragePercent: 92, leadOnCall: 'Dr. Ananya Sen, MD (AIIMS)' },
  { department: 'Casualty & Emergency Medicine', doctors: 14, nurses: 38, coveragePercent: 88, leadOnCall: 'Dr. Amit Patel, MD' },
  { department: 'Cardiology & ICCU', doctors: 6, nurses: 16, coveragePercent: 84, leadOnCall: 'Dr. Sneha Kulkarni, MD, DM' },
  { department: 'General Surgery & Trauma OT', doctors: 8, nurses: 18, coveragePercent: 86, leadOnCall: 'Dr. Rajesh Mukherjee, MS, MCh' },
  { department: 'Pulmonology & Respiratory Care', doctors: 6, nurses: 14, coveragePercent: 80, leadOnCall: 'Dr. Arvind Swaminathan, MD' }
];

export const INITIAL_BED_ITEMS: BedItem[] = [
  {
    id: 'MICU-204',
    ward: 'ICU',
    floor: '2nd Floor - Critical Care Block',
    type: 'Intensive Care',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Hamilton-C3 Mechanical Ventilator', 'Arterial Line Monitor', 'Crash Cart Station'],
    lastCleaned: '10 min ago'
  },
  {
    id: 'MICU-205',
    ward: 'ICU',
    floor: '2nd Floor - Critical Care Block',
    type: 'Intensive Care',
    status: 'Occupied',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Dräger Evita Ventilator', 'Fresenius CRRT Dialysis Port'],
    assignedPatientId: 'P-1024',
    assignedPatientName: 'Ramesh Sharma (ABHA-91-8472-1024)'
  },
  {
    id: 'MICU-206',
    ward: 'ICU',
    floor: '2nd Floor - Critical Care Block',
    type: 'Negative Pressure',
    status: 'Cleaning',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['HEPA Airborne Isolation Filter', 'Maquet Servo-I Ventilator'],
    lastCleaned: 'Sanitization in progress (NABH protocol ETA 15 min)'
  },
  {
    id: 'MICU-207',
    ward: 'ICU',
    floor: '2nd Floor - Critical Care Block',
    type: 'Intensive Care',
    status: 'Reserved',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Ventilator', 'ECMO Hookup Station'],
    assignedPatientName: 'Reserved for Post-CABG recovery'
  },
  {
    id: 'CAS-018',
    ward: 'Emergency',
    floor: 'Ground Floor - Casualty & Trauma Bay',
    type: 'Trauma Resus',
    status: 'Occupied',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Sonosite Point-of-Care Ultrasound (POCUS)', 'Belmont Rapid Infuser'],
    assignedPatientId: 'P-1098',
    assignedPatientName: 'Rajeshwari Rao'
  },
  {
    id: 'CAS-019',
    ward: 'Emergency',
    floor: 'Ground Floor - Casualty & Trauma Bay',
    type: 'Standard Acute',
    status: 'Available',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['BPL Multi-para Monitor Hub'],
    lastCleaned: '25 min ago'
  },
  {
    id: 'CAS-020',
    ward: 'Emergency',
    floor: 'Ground Floor - Casualty & Trauma Bay',
    type: 'Negative Pressure',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Airborne Infection Isolation Room (AIIR)', 'Portable Vacuum Suction'],
    lastCleaned: '5 min ago'
  },
  {
    id: 'HDU-302',
    ward: 'General Ward',
    floor: '3rd Floor - Inpatient Med-Surg & HDU',
    type: 'Standard Acute',
    status: 'Occupied',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Male',
    specialEquipment: ['Infusion Syringe Pump Rack', 'Bariatric Motor Bed'],
    assignedPatientName: 'Vikram Singh'
  },
  {
    id: 'GEN-303',
    ward: 'General Ward',
    floor: '3rd Floor - Female Medical Ward',
    type: 'Standard Acute',
    status: 'Available',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Female',
    specialEquipment: ['Central Wall Oxygen Hub'],
    lastCleaned: '30 min ago'
  },
  {
    id: 'HDU-304',
    ward: 'General Ward',
    floor: '3rd Floor - High Dependency Unit (HDU)',
    type: 'Step-Down',
    status: 'Maintenance',
    hasVentilator: false,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Bed Motor Sensor Hub'],
    maintenanceNote: 'Biomedical engineering hydraulic motor inspection in progress'
  },
  {
    id: 'SURG-401',
    ward: 'Surgical',
    floor: '4th Floor - Post-Operative Surgical Recovery (PACU)',
    type: 'Intensive Care',
    status: 'Available',
    hasVentilator: true,
    hasIsolation: false,
    genderWard: 'Any',
    specialEquipment: ['Mindray Continuous Anesthesia Monitor', 'Bair Hugger Patient Warming System'],
    lastCleaned: '40 min ago'
  },
  {
    id: 'SURG-402',
    ward: 'Surgical',
    floor: '4th Floor - Post-Operative Surgical Recovery (PACU)',
    type: 'Standard Acute',
    status: 'Blocked',
    hasVentilator: false,
    hasIsolation: true,
    genderWard: 'Any',
    specialEquipment: ['Negative Pressure Airflow Seal'],
    maintenanceNote: 'NABH annual decontamination drill'
  }
];

export const INITIAL_SHIFTS: DoctorShift[] = [
  {
    id: 's-1',
    doctorName: 'Dr. Ananya Sen, MD (AIIMS)',
    department: 'Intensive Care Unit (ICU / MICU)',
    date: 'Today',
    shift: '08:00 – 16:00 (Day Critical Duty)',
    role: 'Lead Intensivist',
    status: 'Active'
  },
  {
    id: 's-2',
    doctorName: 'Dr. Amit Patel, MD',
    department: 'Casualty & Emergency Medicine',
    date: 'Today',
    shift: '08:00 – 14:00 (Morning Casualty)',
    role: 'Casualty Medical Officer (CMO)',
    status: 'Active'
  },
  {
    id: 's-3',
    doctorName: 'Dr. Rohan Deshmukh, MD',
    department: 'Casualty & Emergency Medicine',
    date: 'Today',
    shift: '14:00 – 20:00 (Evening Triage)',
    role: 'Senior Resident (SR)',
    status: 'Conflict',
    conflictDescription: 'Double-rostered: Evening Triage (14:00-20:00) & Urgent Fever OPD Lead (13:00-19:00)'
  },
  {
    id: 's-4',
    doctorName: 'Dr. Sneha Kulkarni, MD, DM',
    department: 'Cardiology & ICCU',
    date: 'Today',
    shift: '09:00 – 17:00 (Cath Lab / ICCU Call)',
    role: 'Consultant Cardiologist',
    status: 'Active'
  },
  {
    id: 's-5',
    doctorName: 'Dr. Rajesh Mukherjee, MS, MCh',
    department: 'General Surgery & Trauma OT',
    date: 'Today',
    shift: '08:00 – 16:00 (Emergency OT Call)',
    role: 'Trauma Surgeon',
    status: 'Active'
  },
  {
    id: 's-6',
    doctorName: 'Dr. Arvind Swaminathan, MD',
    department: 'Pulmonology & Respiratory Care',
    date: 'Today',
    shift: '08:00 – 18:00 (Bronchoscopy / HDU Rounds)',
    role: 'Consultant Pulmonologist',
    status: 'Active'
  },
  {
    id: 's-7',
    doctorName: 'Dr. Brian D’Souza, MD',
    department: 'Casualty & Emergency Medicine',
    date: 'Today',
    shift: '20:00 – 08:00 (Night Casualty Duty)',
    role: 'Emergency Physician',
    status: 'Scheduled'
  }
];

export const INITIAL_CONFLICTS: ScheduleConflict[] = [
  {
    id: 'cf-1',
    doctorName: 'Dr. Rohan Deshmukh, MD',
    department: 'Casualty & Emergency Medicine',
    shifts: ['Evening Triage (14:00 – 20:00)', 'Fever OPD Lead (13:00 – 19:00)'],
    conflictType: 'Overlapping Shift',
    severity: 'High',
    recommendation: 'Reassign Fever OPD to Dr. Brian D’Souza or dispatch on-call pool resident.'
  },
  {
    id: 'cf-2',
    doctorName: 'Casualty & Emergency Triage',
    department: 'Casualty & Emergency Medicine',
    shifts: ['14:00 – 16:00 Peak Intake Window'],
    conflictType: 'Under-Coverage',
    severity: 'High',
    recommendation: 'NABH minimum required Casualty staffing is 4 doctors; currently only 3 physicians are signed in.'
  }
];

export const AVAILABLE_DOCTORS = [
  { name: 'Dr. Brian D’Souza, MD', department: 'Casualty & Emergency Medicine', status: 'Available On-Call', contact: 'Ext. 4022 / Intercom 108' },
  { name: 'Dr. Maya Hansen / Dr. Pooja Hegde, MD', department: 'Critical Care / MICU', status: 'Available Standby', contact: 'Ext. 4038' },
  { name: 'Dr. Daniel Cho / Dr. Tushar Saxena, MD', department: 'Internal Medicine', status: 'Available In-House', contact: 'Ext. 4110' },
  { name: 'Dr. Lisa Bennett / Dr. Kavita Reddy, MS', department: 'General Surgery', status: 'On-Call Home (15m response)', contact: 'Ext. 4209' }
];

export const DAILY_CHANGES = [
  { label: 'MICU / ICU Occupancy', change: '+8%', direction: 'up' as const, isConcerning: true, detail: '87% current (up from 79% yesterday baseline)' },
  { label: 'Casualty Waiting Time', change: '+12 min', direction: 'up' as const, isConcerning: true, detail: '42 min avg (target NABH benchmark: 30 min)' },
  { label: 'Available Inpatient Beds', change: '-6 beds', direction: 'down' as const, isConcerning: true, detail: '38 beds hospital-wide (6 ICU beds free)' },
  { label: 'Critical Triage Patients', change: '+3 patients', direction: 'up' as const, isConcerning: true, detail: '12 active critical vs 9 yesterday' },
  { label: 'Doctor Coverage Ratio', change: '-4%', direction: 'down' as const, isConcerning: false, detail: '86% coverage with 2 shift gaps flagged in Casualty' }
];
