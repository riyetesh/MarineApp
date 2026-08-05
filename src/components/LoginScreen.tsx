import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  KeyRound, 
  Fingerprint, 
  WifiOff, 
  CheckCircle2, 
  ShieldAlert, 
  Anchor, 
  Award,
  Smartphone,
  Info
} from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  gloveMode: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, gloveMode }) => {
  const [username, setUsername] = useState('chief.vance@poseidon.maris');
  const [password, setPassword] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMfa && !offlineMode) {
      setShowMfa(true);
      return;
    }
    triggerSuccess();
  };

  const handleBiometricLogin = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      triggerSuccess();
    }, 1200);
  };

  const triggerSuccess = () => {
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 600);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-slate-100 text-slate-900 pb-16 md:pb-6">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden relative">
        {/* Top Header Banner */}
        <div className="bg-slate-900 p-6 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/30 p-3 rounded-xl border border-blue-500/40">
              <Anchor className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-blue-300 font-bold uppercase tracking-widest">
                M/V POSEIDON VOYAGER • MARIS
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Marine Intelligent Fire Suppression
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Industrial Water Mist & PLC Safety Notification Platform
              </p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold px-2 py-0.5 rounded">
              IEC 62443 SL3
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">v4.2.1-PROD</span>
          </div>
        </div>

        {/* Offline Mode Banner Toggle */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-700">
            <WifiOff className={`w-4 h-4 ${offlineMode ? 'text-amber-600' : 'text-slate-500'}`} />
            <span>Emergency Offline Login Mode:</span>
          </div>
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              offlineMode
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-1 ring-amber-300'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {offlineMode ? 'OFFLINE MODE ACTIVE' : 'ENABLE OFFLINE'}
          </button>
        </div>

        {offlineMode && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>
              Using local cached cryptographic credentials. All security actions will be recorded to local offline tamper-proof audit log.
            </span>
          </div>
        )}

        {/* Login Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Officer Identifier / E-Mail
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    gloveMode ? 'py-3.5 text-base' : 'py-2.5 text-sm'
                  }`}
                  placeholder="officer@vessel.com"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Secure Passcode
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    gloveMode ? 'py-3.5 text-base' : 'py-2.5 text-sm'
                  }`}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* MFA Code if toggled */}
            {showMfa && !offlineMode && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 animate-fadeIn">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-900">
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <span>STEP 2: Enter Multi-Factor Authentication Code</span>
                </div>
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full bg-white border border-blue-400 rounded-lg py-2.5 px-3 text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="8 4 9 2 0 1"
                  maxLength={6}
                  autoFocus
                />
                <p className="text-[11px] text-slate-600 mt-2 text-center">
                  Code generated by onboard Hardware RSA Token or Vessel Authenticator
                </p>
              </div>
            )}

            {/* Checkboxes & Emergency Fast Login */}
            <div className="flex items-center justify-between text-xs text-slate-700 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember Authorized Workstation</span>
              </label>

              <button
                type="button"
                onClick={() => setShowMfa(!showMfa)}
                className="text-blue-700 hover:underline font-semibold"
              >
                {showMfa ? 'Back to Passcode' : 'MFA Options'}
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={authenticating || authSuccess}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
                  gloveMode ? 'py-4 text-lg' : 'py-3 text-base'
                } ${authenticating ? 'opacity-80 cursor-wait' : ''}`}
              >
                {authSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                    <span>AUTHENTICATION GRANTED</span>
                  </>
                ) : authenticating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING IEC 62443 CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>{showMfa ? 'VERIFY MFA & LOGIN' : 'SECURE SYSTEM LOGIN'}</span>
                  </>
                )}
              </button>

              {/* Biometric Scan Button */}
              <button
                type="button"
                onClick={handleBiometricLogin}
                disabled={biometricScanning || authenticating}
                className={`w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                  gloveMode ? 'py-3.5 text-base' : 'py-2.5 text-sm'
                }`}
              >
                <Fingerprint className={`w-5 h-5 ${biometricScanning ? 'text-blue-600 animate-pulse' : 'text-slate-600'}`} />
                <span>
                  {biometricScanning ? 'Scanning Fingerprint / Face ID...' : 'Biometric Quick Authentication'}
                </span>
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Demo Role: <strong>Chief Engineer (Level 3 Ops)</strong></span>
            </div>
            <button
              onClick={() => {
                setUsername('chief.vance@poseidon.maris');
                setPassword('••••••••••••');
                triggerSuccess();
              }}
              className="text-blue-700 hover:text-blue-800 underline font-bold"
            >
              Auto-Fill
            </button>
          </div>
        </div>

        {/* Footer Badges & Compliance */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-slate-600 text-[11px] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              IEC 62443 Compliant
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              IACS E27 Ready
            </span>
          </div>
          <div className="text-slate-500 font-mono">
            256-bit AES TLS 1.3 Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};
