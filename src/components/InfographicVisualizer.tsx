import React, { useState } from 'react';
import { 
  Droplet, 
  Flame, 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Zap, 
  Layers, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface InfographicProps {
  vesselSafetyScore?: number;
  waterMistPressure?: number;
  tankLevelPct?: number;
  activeZone?: number;
  onSelectZone?: (zoneId: number) => void;
}

export const InfographicVisualizer: React.FC<InfographicProps> = ({
  vesselSafetyScore = 98.4,
  waterMistPressure = 18.4,
  tankLevelPct = 98.5,
  activeZone = 3,
  onSelectZone,
}) => {
  const [activeTab, setActiveTab] = useState<'hydraulic' | 'safety' | 'cyber'>('hydraulic');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header with infographic tab selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-black text-slate-900">
              Visual SCADA Infographics & System Schematics
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intuitive graphical diagrams for rapid executive and engineering decision-making.
          </p>
        </div>

        {/* Infographic Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('hydraulic')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'hydraulic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Water Mist Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'safety'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Safety Gauges</span>
          </button>

          <button
            onClick={() => setActiveTab('cyber')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'cyber'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cyber Topology</span>
          </button>
        </div>
      </div>

      {/* 1. Hydraulic Water Mist SCADA Schematic Diagram */}
      {activeTab === 'hydraulic' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-600">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              SOLAS II-2 WATER MIST HYDRAULIC SCHEMATIC (SOLENOIDS V-101 TO V-501)
            </span>
            <span className="text-emerald-700 font-bold">PUMP LINE: {waterMistPressure} BAR</span>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 overflow-x-auto scrollbar-thin">
            <svg
              viewBox="0 0 800 280"
              className="w-full min-w-[600px] h-auto select-none font-mono"
            >
              <defs>
                <linearGradient id="pipeWater" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>

                <linearGradient id="tankFill" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0284C7" />
                  <stop offset="98%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#E0F2FE" />
                </linearGradient>
              </defs>

              {/* Water Reservoir Tank */}
              <g>
                <rect x="30" y="50" width="100" height="180" rx="12" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <rect x="35" y="60" width="90" height="160" rx="8" fill="#0F172A" />
                {/* Water Liquid Fill */}
                <rect x="35" y={60 + (160 * (1 - tankLevelPct / 100))} width="90" height={160 * (tankLevelPct / 100)} rx="4" fill="url(#tankFill)" />
                <text x="80" y="140" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">WATER TANK</text>
                <text x="80" y="160" fill="#E0F2FE" fontSize="11" fontWeight="bold" textAnchor="middle">{tankLevelPct}% FULL</text>
              </g>

              {/* Main Suction Line to Pumps */}
              <path d="M 130 140 L 210 140" stroke="url(#pipeWater)" strokeWidth="8" fill="none" />

              {/* Dual High-Pressure Pumps (Pump A & Pump B) */}
              <g>
                <circle cx="240" cy="110" r="24" fill="#1E293B" stroke="#38BDF8" strokeWidth="3" />
                <text x="240" y="114" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">PUMP A</text>
                <text x="240" y="80" fill="#10B981" fontSize="9" fontWeight="bold" textAnchor="middle">RUNNING</text>

                <circle cx="240" cy="170" r="24" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                <text x="240" y="174" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">PUMP B</text>
                <text x="240" y="208" fill="#64748B" fontSize="9" fontWeight="bold" textAnchor="middle">STANDBY</text>
              </g>

              {/* High Pressure Manifold Pipe */}
              <path d="M 264 110 L 320 110 L 320 140 L 400 140" stroke="url(#pipeWater)" strokeWidth="8" fill="none" />
              <path d="M 264 170 L 320 170 L 320 140" stroke="url(#pipeWater)" strokeWidth="4" strokeDasharray="4,4" fill="none" />

              {/* Pressure Sensor Node Gauge */}
              <circle cx="360" cy="140" r="14" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
              <text x="360" y="144" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">18.4 B</text>

              {/* Distribution Solenoid Valves for Fire Zones */}
              {[
                { zone: 1, name: 'Zone 1: Bridge', solenoid: 'V-101', y: 40, active: activeZone === 1 },
                { zone: 2, name: 'Zone 2: Cargo 2', solenoid: 'V-201', y: 90, active: activeZone === 2 },
                { zone: 3, name: 'Zone 3: Engine Rm', solenoid: 'V-301', y: 140, active: activeZone === 3 },
                { zone: 4, name: 'Zone 4: Pump Rm', solenoid: 'V-401', y: 190, active: activeZone === 4 },
                { zone: 5, name: 'Zone 5: Steering', solenoid: 'V-501', y: 240, active: activeZone === 5 },
              ].map((val) => (
                <g 
                  key={val.zone} 
                  onClick={() => onSelectZone && onSelectZone(val.zone)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  {/* Pipe Branch */}
                  <path d={`M 400 140 L 460 140 L 460 ${val.y} L 540 ${val.y}`} stroke={val.active ? '#EF4444' : 'url(#pipeWater)'} strokeWidth={val.active ? '6' : '4'} fill="none" />

                  {/* Solenoid Valve Icon */}
                  <rect x="540" y={val.y - 12} width="40" height="24" rx="4" fill={val.active ? '#EF4444' : '#1E293B'} stroke={val.active ? '#F87171' : '#38BDF8'} strokeWidth="2" />
                  <text x="560" y={val.y + 4} fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">{val.solenoid}</text>

                  {/* Flow Spray Lines to Compartment */}
                  <path d={`M 580 ${val.y} L 660 ${val.y}`} stroke={val.active ? '#EF4444' : '#38BDF8'} strokeWidth="3" strokeDasharray={val.active ? '2,2' : 'none'} />

                  {/* Compartment Label Box */}
                  <rect x="660" y={val.y - 14} width="125" height="28" rx="6" fill={val.active ? '#450A0A' : '#0F172A'} stroke={val.active ? '#EF4444' : '#334155'} strokeWidth="1.5" />
                  <text x="670" y={val.y + 3} fill={val.active ? '#FCA5A5' : '#E2E8F0'} fontSize="10" fontWeight="bold">{val.name}</text>
                  <circle cx="770" cy={val.y} r="4" fill={val.active ? '#EF4444' : '#10B981'} className={val.active ? 'animate-ping' : ''} />
                </g>
              ))}
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">HIGH PRESSURE PUMP LINE</span>
              <span className="text-base font-bold text-slate-900">{waterMistPressure} BAR (1,840 kPa)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">RESERVOIR CAPACITY</span>
              <span className="text-base font-bold text-blue-700">{tankLevelPct}% (42.5 M³)</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-sans block uppercase">STANDBY READY VALVES</span>
              <span className="text-base font-bold text-emerald-700">5 SOLENOIDS SYNCED</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Overall Vessel Safety & Environmental Meter Gauges */}
      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Circular SVG Meter for Overall Safety Score */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold">
              VESSEL SAFETY & FIRE RESILIENCE INDEX
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={vesselSafetyScore > 90 ? '#10B981' : vesselSafetyScore > 75 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * vesselSafetyScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-3xl font-black text-white">{vesselSafetyScore}%</span>
                <span className="text-[9px] text-emerald-400 font-bold">SOLAS OPTIMAL</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Real-time mathematical aggregation of 48 thermal IR, optical smoke, and bilge sensors.
            </p>
          </div>

          {/* Visual Temperature & Smoke Density Bar Charts */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600" />
              Compartment Thermal Gradient & Optical Density (Zones 1-5)
            </h4>

            <div className="space-y-3 font-mono text-xs">
              {[
                { name: 'Zone 3: Engine Room Lower', temp: 88.6, maxTemp: 100, smoke: 520, critical: true },
                { name: 'Zone 5: Steering Gear Room', temp: 62.0, maxTemp: 100, smoke: 42, critical: false },
                { name: 'Zone 2: Cargo Hold No. 2 (DG)', temp: 28.4, maxTemp: 100, smoke: 18, critical: false },
                { name: 'Zone 1: Bridge & Navigation', temp: 21.5, maxTemp: 100, smoke: 4, critical: false },
              ].map((zone, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{zone.name}</span>
                    <span className={`font-bold ${zone.critical ? 'text-red-600' : 'text-slate-700'}`}>
                      {zone.temp}°C • {zone.smoke} PPM
                    </span>
                  </div>

                  {/* Temperature Visual Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        zone.critical ? 'bg-red-600 animate-pulse' : zone.temp > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, (zone.temp / zone.maxTemp) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Cyber Shield Network Topology Schematic */}
      {activeTab === 'cyber' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-600 font-bold uppercase">
            IEC 62443 SL3 ZERO TRUST MARITIME CYBER ARCHITECTURE
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
              {/* Node 1: Satellite Comms */}
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-2">
                <Zap className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-slate-100">SATCOM LINK</span>
                <span className="text-[10px] text-slate-400">Encrypted AES-256</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">CONNECTED</span>
              </div>

              {/* Node 2: Zero Trust Edge Firewall */}
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-slate-100">IDS / IPS FIREWALL</span>
                <span className="text-[10px] text-slate-400">Deep Packet Inspect</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">SL3 HARDENED</span>
              </div>

              {/* Node 3: Dual PLC Controller Nodes */}
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-2">
                <Cpu className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-slate-100">DUAL PLC-01/02</span>
                <span className="text-[10px] text-slate-400">Modbus TCP Gateway</span>
                <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">HOT SWAP SYNC</span>
              </div>

              {/* Node 4: Water Mist Solenoids */}
              <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex flex-col items-center justify-center space-y-2">
                <Droplet className="w-6 h-6 text-cyan-400" />
                <span className="font-bold text-slate-100">VALVE ACTUATORS</span>
                <span className="text-[10px] text-slate-400">Hardware Interlocks</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">AIR-GAPPED RELAY</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
