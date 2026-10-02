# MediFlow - Hospital Operations Command Center

> A real-time, clinical-grade hospital command center and spatial operations platform designed for healthcare administrators, emergency physicians, operations managers, and nursing supervisors.

MediFlow delivers continuous operational situational awareness, combining 3D spatial hospital capacity modeling, isometric bed allocation, automated patient priority triaging, staff coverage management, and predictive surge analytics.

---

## 🏛️ Architectural Overview

MediFlow is built as a high-density, mission-critical operations system. The visual design adheres to a signature command-center aesthetic—deep obsidian and pine canvases (`#0B1710`, `#13251B`) paired with classical typography (Cinzel & Plus Jakarta Sans), high-contrast clinical indicators, and subtle directional motion.

### Technology Stack
* **Frontend**: React 19 + TypeScript + Vite
* **3D Spatial Visualization**: Three.js (WebGL rendering with true isometric camera projections, interactive raycasting, and accessible 2D matrix fallbacks)
* **Styling & Design System**: Tailwind CSS v4 with custom MediFlow theme variables and typography
* **Motion & Page Transitions**: Framer Motion (subtle, accessible transitions respecting `prefers-reduced-motion`)
* **Identity & Authentication**: Firebase Authentication (Google Auth & verified clinician credential gateway)
* **Icons**: Lucide React
* **Backend Dev Server**: Express + tsx

---

## ✨ Core Modules & Capabilities

### 1. 🛏️ 3D Bed Map & Ward Availability (`BedMap3D`)
* **Isometric Spatial Visualization**: Interactive 3D layout rendering hospital beds with physical architectural dimensions, headrests, IV poles, status beacons, and bedside telemetry monitors.
* **Discrete Availability Lifecycle States**:
  * `Available` (Controlled Emerald `#10B981`)
  * `Occupied` (Clinical Crimson `#C93838`)
  * `Cleaning` (Warm Amber `#D97706`)
  * `Reserved` (Cyan Blue `#06B6D4`)
  * `Maintenance` (Royal Purple `#8B5CF6`)
  * `Blocked` (Neutral Slate `#64748B`)
* **Detailed Bed Inspection Modal**: On-click inspection displaying Bed ID, Ward, Floor, Bed Type, Negative Pressure Isolation certification, Mechanical Ventilator hookup, special equipment status, sanitization audit timestamp, and wall O2 PSI pressure.
* **Instant Bed Allocation**: Contextual "Allocate Patient to Bed" action directly assigning triaged patients to available beds.
* **Accessible Fallback**: Integrated 2D layout grid when WebGL is unavailable or when toggled via scene controls.

### 2. 🏥 3D Hospital Capacity Spatial Scene
* **Major Department Models**: Spatial representation of the Intensive Care Unit (ICU), Emergency Medicine, General Ward, and Surgical Suites.
* **Occupancy Thresholds**: Visual state transitions (Normal, Approaching Capacity, and Critical Capacity) based on real-time bed metrics.
* **Interactive Hover Telemetry**: Parallax response with clinical information pills displaying occupancy percentages, available beds, active patients, and doctors on duty.

### 3. 🌊 Dynamic Patient-Resource Flow
* **Operational Flow Representation**: Animated particle flow mapping:
  $$\text{Arrival} \longrightarrow \text{Priority Assessment} \longrightarrow \text{Priority Queue} \longrightarrow \text{Bed Allocation} \longrightarrow \text{Doctor Assignment} \longrightarrow \text{Treatment} \longrightarrow \text{Discharge / Transfer}$$
* Connected to real application state and active patient counts without fabricated telemetry.

### 4. 📋 Critical Patient Queue & Clinical Timeline
* **Explainable Priority Scoring**: Transparent attribution breakdown (SHAP factor weights: severity, abnormal $SpO_2$, wait time, age multiplier, comorbidities).
* **Clinical Timeline View**: Comprehensive stage tracking (Admission $\to$ Assessment $\to$ Bed Assignment $\to$ Treatment $\to$ Transfer $\to$ Discharge).
* **Workflows & Handoffs**: Direct clinician actions including patient transfer modals, EHR note documentation, triage status reclassification, urgent review flagging, and one-click clinical CSV profile export.

### 5. 🩺 Staff & Doctor Duty Coverage
* **Coverage Matrix**: Real-time ratio tracking for physicians and nurses per department.
* **Schedule Conflict Detection**: Automatic identification of overlapping shifts, uncovered peak windows, and rapid "Find On-Call Coverage" dispatch.

### 6. 🔮 Predictive Surge & What-If Scenario Planner
* **Simulation Engine**: Interactive modeling of admissions surges ($+15\%$), ICU bed outages, and length-of-stay extensions.
* **Side-by-Side Comparison**: Live projection of ICU buffer impact, emergency wait times, and staffing pressure with recommended mitigation protocols.

### 7. 🔐 Clinician Access Gateway & Registration
* **Role-Based Workspaces**: Tailored interfaces for Hospital Administrators, Attending Physicians, Bed & Operations Managers, and Nursing Staff.
* **Registration & Sign-In**: Clinician account registration with medical license/badge validation, HIPAA compliance acknowledgement, Google Sign-In, and instant 1-click verified demo profiles.

---

## 📁 Directory Structure

```text
src/
├── components/
│   ├── 3d/
│   │   ├── BedMap3D.tsx               # Isometric 3D hospital beds & metadata modal
│   │   ├── HospitalCapacityScene.tsx  # 3D hospital departments visualization
│   │   ├── DepartmentModel.ts         # Three.js department geometry & materials
│   │   └── SceneControls.tsx          # 3D/2D projection toggle & camera reset
│   ├── dashboard/
│   │   ├── KPIGrid.tsx                # Interactive KPI metrics with smooth transitions
│   │   ├── CapacityOverview.tsx       # 3D capacity scene wrapper & ward metrics
│   │   └── AttentionPanel.tsx         # Clinical bottlenecks & action items
│   ├── patient/
│   │   ├── PatientFlow.tsx            # Animated patient-resource flow canvas
│   │   └── PatientTimeline.tsx        # Admission-to-discharge clinical timeline
│   ├── AuthModal.tsx                  # Clinician login, registration & demo access
│   ├── BedsManagementView.tsx         # Bed inventory, suitability query & BedMap3D
│   ├── CriticalPatientQueue.tsx       # Triage queue with multi-dimensional filters
│   ├── PatientDetailView.tsx          # Patient profile, vitals, timeline & CSV export
│   ├── StaffDutyView.tsx              # Doctor shifts, coverage matrix & conflict resolution
│   ├── AIInsightsView.tsx             # What-if scenario planner & surge models
│   ├── AlertsManagerView.tsx          # Operational alert ledger & mitigations
│   ├── MediFlowHero.tsx               # Front-page landing with Canva-aligned aesthetics
│   └── MediFlowSidebar.tsx            # Navigation drawer & active role switcher
├── lib/
│   ├── firebase.ts                    # Firebase app initialization & auth providers
│   └── mockHospitalData.ts            # Baseline clinical beds, patients, staff & telemetry
├── types.ts                           # Comprehensive TypeScript clinical domain models
├── App.tsx                            # Root application state & view routing
└── main.tsx                           # Application entry point
```

---

# Install dependencies
npm install

# Start the full-stack development server
npm run dev

# Run TypeScript type check and linter
npm run lint

# Build production bundle
npm run build
```

---

