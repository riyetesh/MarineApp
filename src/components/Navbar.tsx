import React, { useState, useEffect } from 'react';
import { VesselStatus } from '../types/industrial';
import { 
  Anchor, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Hand, 
  Wifi, 
  Lock, 
  UserCheck, 
  LogOut,
  Flame,
  Briefcase,
  Wrench,
  Smartphone,
  Monitor
} from 'lucide-react';

interface NavbarProps {
  vesselStatus: VesselStatus;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gloveMode: boolean;
  setGloveMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  userRole: 'manager' | 'engineer';
  setUserRole: (role: 'manager' | 'engineer') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean | ((prev: boolean) => boolean)) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onSimulateFire: () => void;
  onSimulateCyber: () => void;
  onResetSimulations: () => void;
  hasCriticalAlert: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  vesselStatus,
  activeTab,
  setActiveTab,
  gloveMode,
  setGloveMode,
  userRole,
  setUserRole,
  isMobileFrame,
  setIsMobileFrame,
  isLoggedIn,
  onLogout,
  onSimulateFire,
  onSimulateCyber,
  onResetSimulations,
  hasCriticalAlert,
}) => {
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm sticky top-0 z-40 select-none">
      {/* Critical Danger Alarm Banner - ONLY RED for Danger */}
      {hasCriticalAlert && (
        <div className="bg-red-600 text-white px-3 sm:px-4 py-2 font-bold flex items-center justify-between text-xs sm:text-sm animate-pulse gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Flame className="w-5 h-5 flex-shrink-0 animate-bounce" />
            <span className="truncate text-[11px] sm:text-xs">CRITICAL EMERGENCY: ZONE 3 ENGINE ROOM FIRE ALARM ACTIVE</span>
          </div>
          <button
            onClick={() => setActiveTab('notifications')}
            className="bg-white text-red-700 hover:bg-slate-100 px-2.5 py-1 rounded-md font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-colors flex-shrink-0"
          >
            Response &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Vessel Info */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-xl border border-slate-700 flex items-center justify-center">
            <Anchor className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-tight text-white">
                MARISAFE
              </span>
              <span className="text-[10px] bg-blue-950/80 border border-blue-600/50 text-blue-300 font-semibold px-2 py-0.5 rounded">
                Detect. Decide. Protect.
              </span>
              <span className="hidden md:inline-block text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
                IMO 9823412
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
              <span>M/V POSEIDON VOYAGER</span>
              <span className="text-slate-600">•</span>
              <span className="hidden sm:inline">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Center: Perspective / Role Switcher (Managerial vs Engineer) */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setUserRole('manager')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              userRole === 'manager'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Managerial View</span>
          </button>
          <button
            onClick={() => setUserRole('engineer')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              userRole === 'engineer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Engineer View</span>
          </button>
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Simulation triggers */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={onSimulateFire}
              className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              title="Simulate Fire Hazard Emergency"
            >
              <Flame className="w-3 h-3" />
              Fire Sim
            </button>
            <button
              onClick={onSimulateCyber}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
              title="Simulate Cyber Intrusion"
            >
              <ShieldAlert className="w-3 h-3 text-indigo-400" />
              Cyber Sim
            </button>
            <button
              onClick={onResetSimulations}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-medium"
            >
              Reset
            </button>
          </div>

          {/* Glove Mode Toggle */}
          <button
            onClick={() => setGloveMode(prev => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              gloveMode
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Glove Mode enlarges UI controls"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Glove Mode</span>
            <span className="font-mono text-[10px]">{gloveMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Mute Audio */}
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* User Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-medium text-slate-200">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Capt. Vance</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

