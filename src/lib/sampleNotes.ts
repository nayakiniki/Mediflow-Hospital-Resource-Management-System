export interface SampleNote {
  id: string;
  title: string;
  badge: string;
  filename: string;
  text: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'cardiology-nstemi',
    title: 'Cardiology Discharge Summary (NSTEMI with Allergy Conflict)',
    badge: 'Contains Contradiction ⚠️',
    filename: 'Cardiology_Discharge_Chen_R.txt',
    text: `PATIENT DEMOGRAPHICS & ENCOUNTER:
Patient Name: Robert M. Chen
Age: 68 years | Gender: Male | MRN: #4892-019B
Encounter Date: October 14, 2026
Attending Physician: Dr. Elena Rostova, MD (Cardiology Dept)

CHIEF COMPLAINT & PRESENTATION:
Patient presented with sudden-onset retrosternal crushing chest pain radiating to left mandible and shoulder, accompanied by profound diaphoresis and dyspnea on exertion. Symptoms began approximately 3.5 hours prior to ED arrival.

PRIMARY & SECONDARY DIAGNOSES:
1. Acute Non-ST-Segment Elevation Myocardial Infarction (NSTEMI) - Primary
2. Essential Hypertension (Stage 2, poorly controlled)
3. Type 2 Diabetes Mellitus with mild peripheral neuropathy
4. Hyperlipidemia

ALLERGIES & ADVERSE REACTIONS:
- Penicillin (SEVERE: Anaphylaxis and laryngeal angioedema in 2018 - DO NOT ADMINISTER)
- Contrast Radiographic Dye (Mild: Urticaria and rash; requires pre-medication protocol)

ACTIVE MEDICATIONS & DISCHARGE REGIMEN:
- Atorvastatin 80 mg PO once daily at bedtime
- Metoprolol Succinate ER 50 mg PO daily
- Aspirin 81 mg PO daily
- Clopidogrel 75 mg PO daily (DAPT maintenance)
- Amoxicillin-Clavulanate (Augmentin) 875/125 mg PO BID for dental abscess [INCONSISTENCY FLAGGED]
- Metformin 500 mg PO twice daily with meals

VITAL SIGNS (AT DISCHARGE):
- Blood Pressure: 156/94 mmHg (Elevated above target <130/80)
- Heart Rate: 88 bpm (Sinus rhythm, regular)
- Respiratory Rate: 18 breaths/min
- SpO2: 96% on room air
- Temperature: 98.4 °F (36.9 °C)
- Body Mass Index: 29.4 kg/m²

PHYSICAL OBSERVATIONS & LAB HIGHLIGHTS:
- Cardiac Exam: S1/S2 present, no S3 or pericardial friction rub. Peripheral pulses +2 bilaterally. 1+ pretibial edema.
- Peak Troponin-I: 1.84 ng/mL (Reference normal: < 0.04 ng/mL).
- Serial ECG: T-wave inversions in anterolateral leads V4-V6; no persistent ST-elevation.
- Serum Creatinine: 1.1 mg/dL; Serum Potassium: 4.2 mEq/L; eGFR: 68 mL/min.

CLINICAL CONCERNS & CRITICAL INCONSISTENCIES:
- CRITICAL MEDICATION CONFLICT: Discharge list includes Amoxicillin-Clavulanate despite chart-verified severe anaphylaxis to Penicillin-class antibiotics. Immediate cessation and switch to non-beta-lactam alternative required.
- Elevated residual blood pressure (156/94 mmHg) despite beta-blocker therapy; secondary agent titration recommended.

MISSING CLINICAL INFORMATION:
- Post-procedure Transthoracic Echocardiogram (TTE) Left Ventricular Ejection Fraction (LVEF %) report is absent from discharge dossier.
- Scheduled outpatient cardiology clinic follow-up date and physician contact unrecorded.
- Recent HbA1c measurement within last 90 days not documented in electronic chart.

ACTION ITEMS REQUIRING REVIEW:
- Attending physician urgent sign-off required to revoke Amoxicillin-Clavulanate and substitute Clindamycin 300mg PO TID.
- Outpatient pharmacy notification of penicillin cross-allergy alert block.
- Schedule repeat lipid panel and basic metabolic panel at 4-week outpatient check.`
  },
  {
    id: 'er-acute-abdomen',
    title: 'Emergency Medicine Consult (Acute Appendicitis Suspect)',
    badge: 'Urgent Surgical Review 🚨',
    filename: 'ED_Triage_Note_Vasquez_S.pdf',
    text: `CLINICAL ENCOUNTER NOTE - EMERGENCY MEDICINE
Patient Name: Sofia Vasquez
Age: 24 | Gender: Female | MRN: #3029-771
Date: October 20, 2026 | ED Bed: 04
Attending: Dr. Marcus Vance, MD (Emergency Medicine)

CHIEF COMPLAINT:
Severe right lower quadrant abdominal pain progressing over 14 hours, initially periumbilical then migrating to McBurney's point. Associated with nausea, non-bilious emesis x2, and low-grade chills.

DIAGNOSES CONSIDERED:
1. Acute Appendicitis (High clinical probability, Alvarado score 8)
2. Ruptured Ovarian Cyst (Differential)
3. Mesenteric Adenitis (Less likely)

DOCUMENTED ALLERGIES:
- Sulfa drugs (Trimethoprim-Sulfamethoxazole causes full-body maculopapular rash)
- Latex (Contact dermatitis)

CURRENT MEDICATIONS:
- Oral contraceptive pill (Ethinyl estradiol / Levonorgestrel) 1 tab daily
- Acetaminophen 500mg PRN (took 1000mg 4 hours prior with minimal relief)
- Morphine Sulfate 4mg IV administered at 14:15 for acute pain control

VITAL SIGNS:
- Blood Pressure: 118/74 mmHg (Normal)
- Heart Rate: 104 bpm (Sinus tachycardia secondary to acute visceral pain)
- Respiratory Rate: 20 breaths/min
- Temperature: 100.8 °F / 38.2 °C (Low-grade febrile)
- SpO2: 99% ambient air

PHYSICAL EXAMINATION & LABS:
- Abdomen: Marked guarding and focal tenderness at McBurney's point. Positive Rovsing's sign. Positive Psoas sign. Hypoactive bowel sounds.
- WBC Count: 14,800 /mcL with 82% neutrophilic left shift.
- Urine Beta-hCG: Negative (Pregnancy ruled out).
- Urinalysis: Normal, no hematuria or pyuria.

CRITICAL INCONSISTENCIES:
- Clinical handover note stated patient tolerated oral fluids; nursing observation indicates persistent vomiting and NPO order placed.

MISSING INFORMATION:
- Formal Abdominal/Pelvic Ultrasound or Contrast-Enhanced CT scan report pending radiology read.
- Pre-operative surgical clearance consent form unsigned.

ITEMS REQUIRING REVIEW:
- Urgent General Surgery consultation on call for exploratory laparoscopic appendectomy.
- Pre-operative antibiotic prophylaxis selection confirming Sulfa-safe coverage (e.g. Cefoxitin or Cefazolin + Metronidazole).`
  },
  {
    id: 'outpatient-geriatric',
    title: 'Outpatient Geriatric Follow-up (Polypharmacy & Fall Risk)',
    badge: 'Routine Maintenance 📋',
    filename: 'Geriatric_Followup_Miller_H.txt',
    text: `OUTPATIENT CLINIC NOTE:
Patient Name: Harold Miller
Age: 79 | Gender: Male | MRN: #1184-902
Date of Encounter: October 22, 2026
Provider: Dr. Sarah Lin, MD (Geriatric Medicine)

CHIEF COMPLAINT:
Follow-up for chronic multimorbidity, gradual balance instability, and review of multi-drug regimen.

ACTIVE DIAGNOSES:
1. Type 2 Diabetes Mellitus with peripheral neuropathy
2. Chronic Kidney Disease Stage 3a (stable)
3. Mild Cognitive Impairment (MoCA 23/30)
4. Osteoarthritis (bilateral knees)
5. Essential Hypertension

ALLERGIES:
- No Known Drug Allergies (NKDA)

MEDICATIONS:
- Metformin 500mg PO twice daily
- Lisinopril 20mg PO daily
- Amlodipine 5mg PO daily
- Zolpidem 10mg PO at bedtime for insomnia [BEERS CRITERIA CAUTION]
- Gabapentin 300mg PO TID for neuropathic leg pain
- Omeprazole 20mg PO daily

VITALS:
- Blood Pressure: Sitting 134/78 mmHg | Standing 112/68 mmHg (Orthostatic hypotension drop)
- Heart Rate: 68 bpm
- Respiratory Rate: 16 breaths/min
- SpO2: 98% room air
- Temperature: 97.9 °F

OBSERVATIONS & LABS:
- Gait & Balance: Timed Up and Go (TUG) test 16 seconds (indicating elevated fall risk). Uses single-point cane.
- eGFR: 52 mL/min/1.73m² (stable CKD 3a).
- Potassium: 4.6 mEq/L.

CONCERNS & INCONSISTENCIES:
- Beers criteria violation: Concomitant Zolpidem and Gabapentin significantly compounds sedating CNS depression and fall risk in elderly male with documented orthostatic blood pressure drops.

MISSING INFORMATION:
- Dexa bone density scan report not updated since 2022.
- Home blood glucose daily logbook not brought to appointment.

ITEMS REQUIRING REVIEW:
- Formulate taper and deprescribing plan for Zolpidem; initiate sleep hygiene counseling.
- Refer for outpatient physical therapy fall prevention and gait retraining.`
  }
];
