import React, { useState } from 'react';
import { VesselStatus, Compartment, NotificationItem, AuditLogEntry } from '../types/industrial';
import { 
  ShieldCheck, 
  Flame, 
  ShieldAlert, 
  Droplet, 
  Cpu, 
  Wifi, 
  Compass, 
  Navigation, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  RotateCcw,
  Briefcase,
  Wrench,
  Activity,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { InfographicVisualizer } from './InfographicVisualizer';

interface DashboardViewProps {
  vesselStatus: VesselStatus;
  compartments: Compartment[];
  notifications: NotificationItem[];
  auditLogs?: AuditLogEntry[];
  userRole: 'manager' | 'engineer';
  setUserRole: (role: 'manager' | 'engineer') => void;
  onSelectCompartment: (compartmentId: string) => void;
  onSelectNotification: (notifId: string) => void;
  onAcknowledgeNotification: (notifId: string) => void;
  gloveMode: boolean;
  onSimulateFire: () => void;
  onSimulateCyber: () => void;
  onResetSimulations: () => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vesselStatus,
  compartments,
  notifications,
  auditLogs = [],
  userRole,
  setUserRole,
  onSelectCompartment,
  onSelectNotification,
  onAcknowledgeNotification,
  gloveMode,
  onSimulateFire,
  onSimulateCyber,
  onResetSimulations,
  setActiveTab,
}) => {
  const unacknowledged = notifications.filter(n => !n.acknowledged);

  // Accordion state for collapsible mobile/desktop sections
  const [isOverviewCollapsed, setIsOverviewCollapsed] = useState(false);
  const [isKpiCollapsed, setIsKpiCollapsed] = useState(false);
  const [isAlertsCollapsed, setIsAlertsCollapsed] = useState(false);
  const [isCompartmentsCollapsed, setIsCompartmentsCollapsed] = useState(false);
  const [isAuditCollapsed, setIsAuditCollapsed] = useState(false);

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-full overflow-hidden">
      {/* View Mode Switcher Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 flex-shrink-0">
            {userRole === 'manager' ? <Briefcase className="w-6 h-6" /> : <Wrench className="w-6 h-6 text-indigo-600" />}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Mode: {userRole === 'manager' ? 'Managerial (CEO / Executive)' : 'Technical Engineer (SCADA Telemetry)'}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              {userRole === 'manager' ? 'Executive Ship Safety Summary' : 'Engine Room Telemetry & PLC Interlocks'}
            </h1>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full sm:w-auto justify-stretch">
          <button
            onClick={() => setUserRole('manager')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              userRole === 'manager'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>
          <button
            onClick={() => setUserRole('engineer')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              userRole === 'engineer'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Engineer</span>
          </button>
        </div>
      </div>

      {/* 1. Vessel Summary Card (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg uppercase">
              {vesselStatus.name}
            </span>
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {userRole === 'manager' 
                ? `Safety Score: ${vesselStatus.overallHealth}%`
                : `SCADA HEALTH: ${vesselStatus.overallHealth}%`}
            </span>
          </div>

          <button
            onClick={() => setIsOverviewCollapsed(!isOverviewCollapsed)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <span className="hidden sm:inline">{isOverviewCollapsed ? 'Expand' : 'Collapse'}</span>
            {isOverviewCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {!isOverviewCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {vesselStatus.name} • {vesselStatus.type}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {userRole === 'manager' 
                      ? 'Flag: Marshall Islands • International Fire Safety Compliant (SOLAS II-2)'
                      : `Flag: ${vesselStatus.flag} • Class: DNV-GL Maritime Safety • IMO: ${vesselStatus.imoNumber}`}
                  </p>
                </div>

                {/* Voyage Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Location</div>
                    <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      {userRole === 'manager' ? 'North Atlantic' : `${vesselStatus.lat}`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Speed</div>
                    <div className="font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      {vesselStatus.speedKnots} knots
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Sea Condition</div>
                    <div className="font-bold text-slate-900 mt-0.5">Moderate Sea</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Fire Safety</div>
                    <div className={`font-bold mt-0.5 ${
                      vesselStatus.activeFireCount > 0 ? 'text-red-600 font-black' : 'text-emerald-700'
                    }`}>
                      {vesselStatus.activeFireCount > 0 ? 'Fire Warning' : 'Safe & Ready'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Quick Bar */}
              <div className="bg-slate-50/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>
                    {userRole === 'manager' 
                      ? 'Automatic Safety & Alarm Monitoring Active'
                      : 'Live Maritime SCADA Telemetry Active (24/7 Monitored)'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={onSimulateFire}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Simulate Fire Drill
                  </button>
                  <button
                    onClick={onSimulateCyber}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
                    Simulate Cyber Alert
                  </button>
                  <button
                    onClick={onResetSimulations}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-lg text-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visual SCADA Schematics & Infographics Component */}
      <InfographicVisualizer
        vesselSafetyScore={vesselStatus.overallHealth}
        waterMistPressure={18.4}
        tankLevelPct={98.5}
        activeZone={vesselStatus.activeFireCount > 0 ? 3 : 1}
        onSelectZone={(zoneId) => {
          const comp = compartments.find(c => c.fireZone === zoneId);
          if (comp) {
            onSelectCompartment(comp.id);
            setActiveTab('vessel-map');
          }
        }}
      />

      {/* 2. Key Operational Metric Cards - Adapts to Manager vs Engineer (Collapsible) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
            {userRole === 'manager' ? 'Managerial Executive Indicators' : 'Engineer SCADA Telemetry Metrics'}
          </h3>
          <button
            onClick={() => setIsKpiCollapsed(!isKpiCollapsed)}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <span>{isKpiCollapsed ? 'Show Metrics' : 'Hide Metrics'}</span>
            {isKpiCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        <AnimatePresence>
          {!isKpiCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {userRole === 'manager' ? (
                /* MANAGERIAL LEVEL CARDS: Minimal, High-Level CEO/Supervisor Cards */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span>Overall Fleet Safety Rating</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">98.4%</div>
                    <p className="text-xs text-emerald-700 font-medium">
                      Vessel is operating safely and compliant with international maritime standards (SOLAS).
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span>Pending Safety Actions</span>
                      <Flame className={`w-5 h-5 ${unacknowledged.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
                    </div>
                    <div className={`text-3xl font-black ${unacknowledged.length > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {unacknowledged.length === 0 ? '0 Pending' : `${unacknowledged.length} Action Needed`}
                    </div>
                    <p className="text-xs text-slate-600">
                      {unacknowledged.length === 0 ? 'No supervisor sign-off required at this time.' : 'Requires executive officer sign-off.'}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <span>Fire Extinguisher Status</span>
                      <Droplet className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-black text-slate-900">Optimal (98%)</div>
                    <p className="text-xs text-emerald-700 font-medium">
                      High-pressure water mist safety system is primed and armed.
                    </p>
                  </div>
                </div>
              ) : (
                /* ENGINEER LEVEL CARDS: Deep Technical SCADA Telemetry */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans font-bold">
                      <span>FIRE SENSORS</span>
                      <Flame className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">142 / 142</div>
                    <div className="text-[11px] text-emerald-700 font-sans mt-1">
                      Scan: 50ms Loop
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans font-bold">
                      <span>PLC NODE</span>
                      <Cpu className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">Dual Sync</div>
                    <div className="text-[11px] text-slate-600 font-sans mt-1">
                      PLC-01 Primary
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans font-bold">
                      <span>LATENCY</span>
                      <Wifi className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">8 ms</div>
                    <div className="text-[11px] text-slate-600 font-sans mt-1">
                      Modbus Ring OK
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans font-bold">
                      <span>CYBER SHIELD</span>
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-lg font-black text-slate-900 mt-1">SL3 Active</div>
                    <div className="text-[11px] text-slate-600 font-sans mt-1">
                      Zero Trust
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm font-mono">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans font-bold">
                      <span>MIST PRESS</span>
                      <Droplet className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">18.4 Bar</div>
                    <div className="text-[11px] text-blue-700 font-sans mt-1">
                      Pump Standby
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Unacknowledged Alerts Section (Collapsible) */}
      {unacknowledged.length > 0 && (
        <div className="bg-white border border-red-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">
                {userRole === 'manager' 
                  ? `Safety Alerts (${unacknowledged.length} Pending)` 
                  : `Unacknowledged Incidents (${unacknowledged.length})`}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hidden sm:block"
              >
                Incident Center &rarr;
              </button>
              <button
                onClick={() => setIsAlertsCollapsed(!isAlertsCollapsed)}
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                {isAlertsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {!isAlertsCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-hidden"
              >
                {unacknowledged.map((item) => {
                  const isCriticalDanger = item.severity === 'critical';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between ${
                        isCriticalDanger
                          ? 'bg-red-50 border-red-400 text-red-950 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                          <span>{userRole === 'manager' ? `Area: ${item.title}` : `${item.incidentNo} • Zone ${item.fireZone}`}</span>
                          <span className={`uppercase px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            isCriticalDanger ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
                          }`}>
                            {userRole === 'manager' ? (isCriticalDanger ? 'High Priority' : 'Warning') : item.severity}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {userRole === 'manager' 
                            ? 'High temperature reading reported in engine room area. Automated water mist fire protection is prepped.' 
                            : item.shortDescription}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-500">{item.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectNotification(item.id);
                              setActiveTab('incident-detail');
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg"
                          >
                            {userRole === 'manager' ? 'Review SOP' : 'Inspect SOP'}
                          </button>
                          <button
                            onClick={() => onAcknowledgeNotification(item.id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg"
                          >
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. Ship Compartments Overview (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-700" />
              {userRole === 'manager' ? 'Vessel Fire Protection Compartments' : 'Monitored Compartments & Fire Zones'}
            </h3>
            <p className="text-xs text-slate-500">
              {userRole === 'manager'
                ? 'Overview of main vessel compartments and automatic fire protection status.'
                : 'Detailed SCADA telemetry, sensor readings, and water mist valve interlocks.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('vessel-map')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl hidden sm:flex items-center gap-1 transition-colors shadow-sm"
            >
              <span>{userRole === 'manager' ? 'Ship Blueprint' : 'Deck Map'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCompartmentsCollapsed(!isCompartmentsCollapsed)}
              className="p-1.5 text-slate-500 hover:text-slate-800"
            >
              {isCompartmentsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isCompartmentsCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden"
            >
              {compartments.map((comp) => {
                const isCriticalDanger = comp.status === 'critical';
                const isWarning = comp.status === 'warning';

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompartment(comp.id);
                      setActiveTab('vessel-map');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-slate-400 ${
                      isCriticalDanger
                        ? 'bg-red-50 border-red-400 shadow-sm'
                        : isWarning
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">
                        {userRole === 'manager' ? `Zone ${comp.fireZone}` : `ZONE ${comp.fireZone} • ${comp.code}`}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isCriticalDanger
                          ? 'bg-red-600 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                      }`}>
                        {userRole === 'manager' ? (isCriticalDanger ? 'Attention' : isWarning ? 'Warning' : 'Normal') : comp.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {comp.name}
                    </h4>

                    {/* Managerial view vs Engineer view details */}
                    {userRole === 'manager' ? (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 mb-2">
                        <div className="flex justify-between text-slate-600">
                          <span>Temperature:</span>
                          <strong className={comp.temperature > 50 ? 'text-red-600 font-bold' : 'text-slate-800'}>
                            {comp.temperature > 50 ? 'High' : 'Normal'} ({comp.temperature}°C)
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Fire Protection:</span>
                          <strong className="text-blue-700 font-bold">Armed & Ready</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 mb-2">
                        <div>
                          <span className="text-[10px] font-sans text-slate-500 block">Temp</span>
                          <span className={`font-bold ${comp.temperature > 50 ? 'text-red-600' : 'text-slate-800'}`}>
                            {comp.temperature}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans text-slate-500 block">Smoke</span>
                          <span className={`font-bold ${comp.smokePpm > 100 ? 'text-red-600' : 'text-slate-800'}`}>
                            {comp.smokePpm} PPM
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{comp.sensorsCount} Sensors</span>
                      <span className="text-blue-600 font-bold flex items-center gap-0.5">
                        {userRole === 'manager' ? 'Inspect' : 'View Deck'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Live Authenticated User Action Audit Trail Panel (Collapsible) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Authenticated User Activity Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Every mode switch, drill, and acknowledgment is recorded for SOLAS & IMO security compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('audit-logs')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hidden sm:block"
            >
              Full Audit Ledger &rarr;
            </button>
            <button
              onClick={() => setIsAuditCollapsed(!isAuditCollapsed)}
              className="p-1.5 text-slate-500 hover:text-slate-800"
            >
              {isAuditCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isAuditCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden"
            >
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.2 rounded uppercase">
                        {log.category}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{log.details}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono flex-shrink-0">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <UserCheck className="w-3 h-3 text-blue-600" /> {log.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
