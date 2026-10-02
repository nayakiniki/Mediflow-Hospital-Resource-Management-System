import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  X, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Stethoscope, 
  BadgeCheck, 
  Eye, 
  EyeOff, 
  Sparkles 
} from 'lucide-react';
import { HospitalUserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoogleSignIn: () => Promise<void>;
  initialMode?: 'login' | 'register';
  onCustomAuthSuccess?: (user: {
    uid: string;
    email: string;
    displayName: string;
    role: HospitalUserRole;
    department: string;
    licenseId?: string;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onGoogleSignIn,
  initialMode = 'login',
  onCustomAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<HospitalUserRole>('doctor');
  const [regDepartment, setRegDepartment] = useState('Critical Care / ICU');
  const [regLicense, setRegLicense] = useState('');
  const [agreePolicies, setAgreePolicies] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignInClick = async () => {
    setLoading(true);
    setError('');
    try {
      await onGoogleSignIn();
      onClose();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err?.message || 'Authentication failed. Please verify network access.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your work email and password.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      // Create user profile
      const loggedUser = {
        uid: `usr-${Date.now()}`,
        email: loginEmail,
        displayName: loginEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        role: 'doctor' as HospitalUserRole,
        department: 'Critical Care / ICU'
      };

      localStorage.setItem('mediflow_auth_user', JSON.stringify(loggedUser));
      if (onCustomAuthSuccess) {
        onCustomAuthSuccess(loggedUser);
      }
      setLoading(false);
      onClose();
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please fill in all mandatory clinician registration fields.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!agreePolicies) {
      setError('Please agree to the privacy policies and guidelines.');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      const newUser = {
        uid: `usr-${Date.now()}`,
        email: regEmail,
        displayName: regName,
        role: regRole,
        department: regDepartment,
        licenseId: regLicense || 'MED-VERIFIED'
      };

      localStorage.setItem('mediflow_auth_user', JSON.stringify(newUser));
      if (onCustomAuthSuccess) {
        onCustomAuthSuccess(newUser);
      }
      setLoading(false);
      onClose();
    }, 700);
  };

  const quickDemoLogin = (role: HospitalUserRole, name: string, dept: string) => {
    const demoUser = {
      uid: `demo-${role}-${Date.now()}`,
      email: `${role}@mediflow.health`,
      displayName: name,
      role: role,
      department: dept,
      licenseId: 'MED-DEMO-AUTH'
    };

    localStorage.setItem('mediflow_auth_user', JSON.stringify(demoUser));
    if (onCustomAuthSuccess) {
      onCustomAuthSuccess(demoUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#13251B] rounded-3xl border border-[#2C4838] shadow-2xl max-w-md w-full p-6 sm:p-8 relative text-slate-100 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#183124] border border-[#274633] text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-white tracking-wide">
              MediFlow Access Gateway
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure HIPAA-Compliant Hospital Command Center
            </p>
          </div>
        </div>

        {/* Auth Mode Toggle Tabs (Login vs Register) */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0E1D15] border border-[#1E3728] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-[#1C3326] text-white shadow-sm border border-[#2F523C]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#1C3326] text-white shadow-sm border border-[#2F523C]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* ====================================================================
            MODE 1: CLINICIAN LOGIN
            ==================================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Hospital Email / Clinician ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 hover:text-[#E88F89] cursor-pointer">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#E88F89]/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to MediFlow</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ====================================================================
            MODE 2: CLINICIAN REGISTRATION
            ==================================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Full Name & Clinical Credentials
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Dr. Jennifer Thorne, MD"
                  className="w-full pl-9 pr-4 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="j.thorne@hospital.org"
                  className="w-full pl-9 pr-4 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Primary Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as HospitalUserRole)}
                  className="w-full px-2.5 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="doctor">Doctor / Physician</option>
                  <option value="administrator">Hospital Admin</option>
                  <option value="operations_manager">Operations Manager</option>
                  <option value="nursing_staff">Nursing Staff</option>
                  <option value="management">Executive Management</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Department
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="Critical Care / ICU">Critical Care / ICU</option>
                  <option value="Emergency Medicine">Emergency</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Pulmonology">Pulmonology</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Medical License / Badge ID (Optional)
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regLicense}
                  onChange={(e) => setRegLicense(e.target.value)}
                  placeholder="MD-84920"
                  className="w-full pl-9 pr-4 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-10 py-2 bg-[#183124] border border-[#274633] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E88F89]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
              <input
                type="checkbox"
                id="agreePolicies"
                checked={agreePolicies}
                onChange={(e) => setAgreePolicies(e.target.checked)}
                className="rounded border-[#274633] bg-[#183124] text-[#E88F89] focus:ring-0 cursor-pointer"
                required
              />
              <label htmlFor="agreePolicies" className="cursor-pointer select-none">
                I agree to privacy policies and guidelines
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreePolicies}
              className="w-full mt-2 py-3 rounded-xl bg-[#E88F89] hover:bg-[#F2A39F] text-slate-950 font-bold text-xs transition-all shadow-md shadow-[#E88F89]/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Complete Clinician Registration</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E3B2A]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase text-slate-400">
            <span className="bg-[#13251B] px-3">or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignInClick}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#183124] hover:bg-[#1E3B2A] border border-[#274633] text-white text-xs font-semibold transition-all hover:scale-101 active:scale-98 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* 1-Click Demo Profiles for Rapid Testing */}
        <div className="mt-4 pt-3 border-t border-[#1E3B2A]/80">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            1-Click Demo Testing Profiles:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickDemoLogin('doctor', 'Dr. Ananya Sen, MD (AIIMS)', 'Critical Care / MICU')}
              className="p-2 rounded-xl bg-[#0E1D15] hover:bg-[#183124] border border-[#1E3728] text-center transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-white block">Intensivist</span>
              <span className="text-[9px] font-mono text-emerald-400">Dr. A. Sen</span>
            </button>

            <button
              type="button"
              onClick={() => quickDemoLogin('administrator', 'Rajesh Sharma', 'NABH Operations Administration')}
              className="p-2 rounded-xl bg-[#0E1D15] hover:bg-[#183124] border border-[#1E3728] text-center transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-white block">Admin</span>
              <span className="text-[9px] font-mono text-amber-400">R. Sharma</span>
            </button>

            <button
              type="button"
              onClick={() => quickDemoLogin('operations_manager', 'Sister Marykutty Kurian', 'Casualty & Bed Management')}
              className="p-2 rounded-xl bg-[#0E1D15] hover:bg-[#183124] border border-[#1E3728] text-center transition-colors cursor-pointer"
            >
              <span className="text-[10px] font-bold text-white block">Bed Mgr</span>
              <span className="text-[9px] font-mono text-cyan-400">Sr. Marykutty</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
