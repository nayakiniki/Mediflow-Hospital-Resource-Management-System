import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MediFlowView, 
  Patient, 
  OperationalAlert, 
  HospitalMetrics, 
  BedAllocation, 
  StaffOnDuty,
  HospitalUserRole
} from './types';
import { auth, googleProvider } from './lib/firebase';
import { 
  INITIAL_METRICS, 
  INITIAL_PATIENTS, 
  INITIAL_ALERTS, 
  INITIAL_BEDS, 
  INITIAL_STAFF 
} from './lib/mockHospitalData';
import { MediFlowHero } from './components/MediFlowHero';
import { MediFlowSidebar } from './components/MediFlowSidebar';
import { HospitalOperationsDashboard } from './components/HospitalOperationsDashboard';
import { CriticalPatientQueue } from './components/CriticalPatientQueue';
import { PatientDetailView } from './components/PatientDetailView';
import { BedsManagementView } from './components/BedsManagementView';
import { StaffDutyView } from './components/StaffDutyView';
import { AlertsManagerView } from './components/AlertsManagerView';
import { AIInsightsView } from './components/AIInsightsView';
import { AuthModal } from './components/AuthModal';
import { Search, Sparkles, X, ChevronRight, Bell, Command, User as UserIcon } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<MediFlowView>('landing');
  const [activeRole, setActiveRole] = useState<HospitalUserRole>('administrator');
  const [metrics, setMetrics] = useState<HospitalMetrics>(INITIAL_METRICS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);
  const [beds, setBeds] = useState<BedAllocation[]>(INITIAL_BEDS);
  const [staff, setStaff] = useState<StaffOnDuty[]>(INITIAL_STAFF);

  // Global search & smart search assistant (Backlog Item #10)
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Selected patient for detail view (default to P-1024)
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);

  // Firebase & Clinician Auth state
  const [user, setUser] = useState<User | null>(null);
  const [clinicianUser, setClinicianUser] = useState<{
    uid: string;
    email: string;
    displayName: string;
    role: HospitalUserRole;
    department: string;
    licenseId?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('mediflow_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [surgeAlertToast, setSurgeAlertToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleCustomAuthSuccess = (loggedUser: {
    uid: string;
    email: string;
    displayName: string;
    role: HospitalUserRole;
    department: string;
    licenseId?: string;
  }) => {
    setClinicianUser(loggedUser);
    setActiveRole(loggedUser.role);
    setSurgeAlertToast(`Welcome ${loggedUser.displayName} (${loggedUser.department})`);
    setTimeout(() => setSurgeAlertToast(null), 4000);
    if (currentView === 'landing') {
      if (loggedUser.role === 'doctor') setCurrentView('patients');
      else if (loggedUser.role === 'operations_manager') setCurrentView('beds');
      else setCurrentView('dashboard');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setClinicianUser(null);
    localStorage.removeItem('mediflow_auth_user');
    setSurgeAlertToast('Logged out of MediFlow Clinical Gateway.');
    setTimeout(() => setSurgeAlertToast(null), 3000);
  };

  // Actions
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('patient-detail');
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setSelectedPatient(updatedPatient);
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  const handleTogglePatientFlag = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const updated = { ...p, flaggedForReview: !p.flaggedForReview };
          if (selectedPatient.id === patientId) setSelectedPatient(updated);
          return updated;
        }
        return p;
      })
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handlePrepareSurgeBeds = () => {
    setBeds((prev) =>
      prev.map((b) =>
        b.ward === 'ICU'
          ? {
              ...b,
              total: b.total + 6,
              available: b.available + 6,
              occupancyRate: Math.round((b.occupied / (b.total + 6)) * 100)
            }
          : b
      )
    );
    setMetrics((prev) => ({
      ...prev,
      availableBeds: prev.availableBeds + 6,
      icuBedsAvailable: prev.icuBedsAvailable + 6,
      icuOccupancyPercent: Math.round((40 / 52) * 100)
    }));
    setSurgeAlertToast('Surge Protocol Executed: 6 additional ICU beds prepared in Ward 4B.');
    setTimeout(() => setSurgeAlertToast(null), 4000);
    setCurrentView('dashboard');
  };

  const handleAllocateBed = (ward: string) => {
    setCurrentView('beds');
  };

  // Smart Search suggestions (Backlog Item #10)
  const smartSearchQueries = [
    { text: 'Show available ICU beds', target: 'beds' as MediFlowView },
    { text: 'Which patients are critical?', target: 'patients' as MediFlowView },
    { text: 'Which doctors are on duty?', target: 'staff' as MediFlowView },
    { text: "Show today's alerts", target: 'alerts' as MediFlowView },
    { text: 'Run occupancy what-if scenario', target: 'insights' as MediFlowView }
  ];

  const handleExecuteSmartQuery = (query: string, target: MediFlowView) => {
    setGlobalSearch('');
    setSearchFocused(false);
    setCurrentView(target);
  };

  const unresolvedAlertsCount = alerts.filter((a) => !a.resolved).length;

  // View: Landing Page (Hero + Feature Cards)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#0B1710] selection:bg-[#E88F89] selection:text-slate-950">
        <MediFlowHero
          onNavigate={(view) => setCurrentView(view)}
          onExploreDashboard={() => setCurrentView('dashboard')}
          onOpenAuth={handleOpenAuth}
          user={clinicianUser || user}
          onSignOut={handleSignOut}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onGoogleSignIn={handleGoogleSignIn}
          onCustomAuthSuccess={handleCustomAuthSuccess}
        />
      </div>
    );
  }

  // View: Command Center Shell (Sidebar + Main Panel in Signature MediFlow Dark UI)
  return (
    <div className="flex h-screen bg-[#0B1710] overflow-hidden text-slate-100 selection:bg-[#E88F89] selection:text-slate-950">
      {/* Toast Notification */}
      {surgeAlertToast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-950 border border-emerald-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{surgeAlertToast}</span>
        </div>
      )}

      {/* Sidebar matching signature Canva design with workspace role selector */}
      <MediFlowSidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        unresolvedAlertsCount={unresolvedAlertsCount}
        activeRole={activeRole}
        onSelectRole={(newRole) => {
          setActiveRole(newRole);
          if (newRole === 'doctor') setCurrentView('patients');
          else if (newRole === 'operations_manager') setCurrentView('beds');
          else if (newRole === 'nursing_staff') setCurrentView('patients');
          else setCurrentView('dashboard');
        }}
        user={clinicianUser || user}
        onSignIn={() => handleOpenAuth('login')}
        onSignOut={handleSignOut}
      />

      {/* Main Content View Container in MediFlow Dark Theme */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0B1710] topo-pattern">
        {/* Top Global Search & Command Bar (Backlog Item #10) */}
        <header className="h-16 bg-[#0F1E16]/80 border-b border-[#1F3729] px-6 flex items-center justify-between shrink-0 backdrop-blur-md z-30">
          <div ref={searchRef} className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (e.target.value.trim().length > 1 && currentView !== 'patients') {
                  setCurrentView('patients');
                }
              }}
              placeholder="Search MediFlow... (e.g. 'Show available ICU beds', patient P-1024, staff)"
              className="w-full pl-10 pr-12 py-2 bg-[#13251B] rounded-xl border border-[#234230] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E88F89] focus:border-[#E88F89] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-[#183124] px-1.5 py-0.5 rounded border border-white/5">
              <span>⌘K</span>
            </div>

            {/* Smart Search Assistant Suggestions Dropdown (Backlog Item #10) */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#13251B] border border-[#2C4838] rounded-2xl shadow-2xl p-3 z-50 space-y-2 backdrop-blur-md">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 pt-1">
                  <span>Smart Clinical Queries</span>
                  <span className="text-[#E88F89]">1-Click Execute</span>
                </div>
                <div className="space-y-1">
                  {smartSearchQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => handleExecuteSmartQuery(q.text, q.target)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-[#183124] flex items-center justify-between group transition-colors"
                    >
                      <span className="group-hover:text-[#E88F89] transition-colors">"{q.text}"</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Active Workspace Role Pill (Backlog Item #2) */}
            <div className="hidden md:flex items-center gap-2 bg-[#13251B] border border-[#234230] px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 uppercase">Role:</span>
              <strong className="text-white capitalize">{activeRole.replace('_', ' ')}</strong>
            </div>

            {/* Alert shortcut badge */}
            <button
              onClick={() => setCurrentView('alerts')}
              className="relative p-2 rounded-xl bg-[#13251B] hover:bg-[#183124] text-slate-300 hover:text-white border border-[#234230] transition-colors"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unresolvedAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center font-mono">
                  {unresolvedAlertsCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable View Content with subtle performant page transitions (Requirement 5) */}
        <main className="flex-1 overflow-y-auto bg-[#0B1710]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="min-h-full"
            >
              {currentView === 'dashboard' && (
                <HospitalOperationsDashboard
                  metrics={metrics}
                  alerts={alerts}
                  beds={beds}
                  staff={staff}
                  patients={patients}
                  activeRole={activeRole}
                  onNavigate={(view) => setCurrentView(view)}
                  onReviewRecommendation={() => setCurrentView('insights')}
                />
              )}

              {currentView === 'patients' && (
                <CriticalPatientQueue
                  patients={patients}
                  onSelectPatient={handleSelectPatient}
                />
              )}

              {currentView === 'patient-detail' && (
                <PatientDetailView
                  patient={selectedPatient}
                  onBackToQueue={() => setCurrentView('patients')}
                  onToggleFlag={handleTogglePatientFlag}
                  onUpdatePatient={handleUpdatePatient}
                />
              )}

              {currentView === 'beds' && (
                <BedsManagementView
                  beds={beds}
                  onAllocateBed={handleAllocateBed}
                />
              )}

              {currentView === 'staff' && (
                <StaffDutyView staffList={staff} />
              )}

              {currentView === 'alerts' && (
                <AlertsManagerView
                  alerts={alerts}
                  onResolveAlert={handleResolveAlert}
                />
              )}

              {currentView === 'insights' && (
                <AIInsightsView onPrepareBeds={handlePrepareSurgeBeds} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Clinician Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onCustomAuthSuccess={handleCustomAuthSuccess}
      />
    </div>
  );
}
