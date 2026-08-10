import React, { useState } from 'react';
import { Compartment } from '../types/industrial';
import { 
  Map, 
  Thermometer, 
  Flame, 
  ShieldCheck, 
  Droplet, 
  Cpu,
  AlertTriangle,
  Layers,
  Info,
  CheckCircle2,
  Zap,
  Maximize2,
  Box,
  Eye,
  Activity,
  Wind,
  Radio,
  Sparkles,
  Volume2
} from 'lucide-react';

interface VesselMapViewProps {
  compartments: Compartment[];
  selectedCompartmentId: string | null;
  onSelectCompartment: (id: string) => void;
  gloveMode: boolean;
}

export const VesselMapView: React.FC<VesselMapViewProps> = ({
  compartments,
  selectedCompartmentId,
  onSelectCompartment,
  gloveMode,
}) => {
  const [selectedView, setSelectedView] = useState<'all' | 'bridge' | 'main' | 'tank' | 'profile'>('all');
  const [is3DMode, setIs3DMode] = useState(true); // Default 3D Isometric View
  const [showHeatmap, setShowHeatmap] = useState(false); // Thermal Heatmap Overlay
  const [simulatingMist, setSimulatingMist] = useState<string | null>(null); // Active mist simulation
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Helper to find compartment
  const getComp = (id: string): Compartment => {
    return compartments.find(c => c.id === id) || {
      id,
      name: id,
      code: id.toUpperCase(),
      deck: 'Main Deck',
      fireZone: 1,
      temperature: 22,
      smokePpm: 5,
      pressureBar: 18.4,
      waterMistStatus: 'Standby',
      valvePosition: 'Closed',
      sensorHealthPct: 100,
      cyberStatus: 'Secured',
      status: 'safe',
      sensorsCount: 4,
      sensors: []
    };
  };

  // Currently active room
  const activeComp = compartments.find(c => c.id === (selectedCompartmentId || 'eng-room-lower')) || compartments[0];

  // Helper to check error status
  const isErrorComp = (comp: Compartment) => comp.status === 'critical' || comp.status === 'warning' || comp.status === 'cyber';

  // Helper for status background fill in 3D Mode
  const getRoomColorClass = (comp: Compartment, isSelected: boolean) => {
    if (showHeatmap) {
      if (comp.temperature >= 60) return 'fill-red-500/80 stroke-red-400';
      if (comp.temperature >= 35) return 'fill-amber-500/80 stroke-amber-400';
      return 'fill-emerald-500/70 stroke-emerald-400';
    }

    if (comp.status === 'critical') {
      return 'fill-red-600/90 stroke-red-400 animate-pulse';
    }
    if (comp.status === 'cyber') {
      return 'fill-purple-600/90 stroke-cyan-400';
    }
    if (comp.status === 'warning') {
      return 'fill-amber-500/90 stroke-amber-300';
    }
    if (isSelected) {
      return 'fill-sky-600/80 stroke-sky-300';
    }
    return 'fill-slate-800/90 stroke-slate-600 hover:fill-slate-700/90';
  };

  // Trigger temporary mist test in room
  const handleTriggerMist = (roomId: string) => {
    setSimulatingMist(roomId);
    setTimeout(() => {
      setSimulatingMist(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6 font-sans">
      {/* Interactive Top Control Bar */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <Box className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Spatial Deck Telemetry & Compartment Safety Topography
                  </h2>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE SCADA TELEMETRY
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  M/V POSEIDON VOYAGER • 01 Tank Top (0.00m), 02 Main Deck (+3.20m), 03 Bridge Deck (+6.40m) & Elevation Profile
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls & View Toggles */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {/* View Mode Switcher */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              {[
                { id: 'all', label: 'All Decks (Stack)' },
                { id: 'tank', label: '01 Tank Top' },
                { id: 'main', label: '02 Main Deck' },
                { id: 'bridge', label: '03 Bridge Deck' },
                { id: 'profile', label: 'Elevation Profile' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => setSelectedView(view.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedView === view.id 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* 3D vs 2D Toggle */}
            <button
              onClick={() => setIs3DMode(!is3DMode)}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                is3DMode
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>{is3DMode ? '3D Isometric' : '2D Flat CAD'}</span>
            </button>

            {/* Thermal Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-2 transition-all ${
                showHeatmap
                  ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>{showHeatmap ? 'Heatmap ON' : 'Thermal Overlay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Map Area + Inspector Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Interactive Canvas Stage */}
        <div className="lg:col-span-2 bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

          {/* Map Header Overlay */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 border-b border-slate-800/80 pb-3 gap-3">
            <div className="flex items-center gap-2 font-bold">
              <span className="bg-blue-900/80 text-blue-300 border border-blue-700 px-2.5 py-0.5 rounded text-[10px]">
                3D SCADA MATRIX
              </span>
              <span className="text-slate-100 font-semibold">27.00M YACHT ARCHITECTURE • ISOMETRIC PERSPECTIVE</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SENSORS ACTIVE
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">SCALE 1:100</span>
            </div>
          </div>

          {/* SVG 3D Canvas Box */}
          <div className="relative z-10 w-full overflow-x-auto p-2 sm:p-4 flex flex-col items-center justify-center min-h-[580px]">
            <svg
              viewBox="0 0 1000 1000"
              className={`w-full min-w-[700px] max-w-[980px] mx-auto select-none h-auto font-mono transition-all duration-700 ${
                is3DMode ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : ''
              }`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* 3D Floor Linear Gradients */}
                <linearGradient id="deck3dGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="hull3dGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                <linearGradient id="fire3dGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.95" />
                </linearGradient>

                <linearGradient id="mistSprayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                </linearGradient>

                {/* 3D Wall Bevel Filter */}
                <filter id="wallShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.8" />
                </filter>

                {/* Blinking Pulse Glow Filter */}
                <filter id="glowPulse" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ========================================================= */}
              {/* SECTION 1: ELEVATION PROFILE (NO NUMBER) ABOVE BRIDGE DECK */}
              {/* ========================================================= */}
              {(selectedView === 'all' || selectedView === 'profile') && (
                <g 
                  id="side-profile-3d" 
                  transform={is3DMode ? (selectedView === 'profile' ? "translate(0, 30)" : "translate(0, 20)") : "translate(0, 20)"}
                  className="transition-transform duration-500"
                >
                  {/* Title Box */}
                  <g transform="translate(30, 0)">
                    <rect x="0" y="0" width="280" height="32" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="14" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900">ELEVATION PROFILE</text>
                  </g>

                  {/* Waterline Glow Line */}
                  <line x1="40" y1="210" x2="940" y2="210" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="8,4" />
                  <text x="50" y="228" fill="#38bdf8" fontSize="11" fontWeight="bold">WATERLINE (1.60m DRAFT)</text>

                  {/* 3D Hull Geometry Path */}
                  <path
                    d="M 100 130 
                       Q 80 130 60 160 
                       L 120 230 
                       L 820 230 
                       Q 920 230 940 130 
                       L 880 130 
                       L 850 100 
                       L 620 100 
                       L 550 50 
                       L 320 50 
                       L 280 100 
                       L 200 100 
                       L 150 130 
                       Z"
                    fill="url(#hull3dGradient)"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    filter={is3DMode ? "url(#wallShadow)" : undefined}
                  />

                  {/* Radar Mast */}
                  <path d="M 420 50 L 420 15 M 400 22 L 440 22 M 410 32 L 430 32" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="420" cy="12" r="4" fill="#38bdf8" className="animate-ping" filter="url(#glowPulse)" />

                  {/* Deck Lines */}
                  <line x1="150" y1="130" x2="880" y2="130" stroke="#475569" strokeWidth="2" strokeDasharray="4,2" />
                  <text x="890" y="134" fill="#cbd5e1" fontSize="9" fontWeight="bold">MAIN DECK (+3.20m)</text>

                  <line x1="280" y1="100" x2="850" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4,2" />
                  <text x="860" y="104" fill="#cbd5e1" fontSize="9" fontWeight="bold">BRIDGE DECK (+6.40m)</text>

                  {/* Windows & Glossy Visual Highlights */}
                  <polygon points="340,60 520,60 510,90 350,90" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <rect x="220" y="110" width="180" height="14" fill="#0284c7" rx="2" />
                  <rect x="420" y="110" width="200" height="14" fill="#0284c7" rx="2" />
                  <rect x="640" y="110" width="140" height="14" fill="#0284c7" rx="2" />

                  {/* Porthole LED Indicators */}
                  <circle cx="200" cy="170" r="5" fill="#38bdf8" />
                  <circle cx="240" cy="170" r="5" fill="#38bdf8" />
                  <circle cx="280" cy="170" r="5" fill="#38bdf8" />
                  <circle cx="680" cy="170" r="5" fill="#38bdf8" />
                  <circle cx="720" cy="170" r="5" fill="#38bdf8" />

                  {/* Engine Room Lower Profile Cutout & Pulsing Glow */}
                  <g 
                    onClick={() => onSelectCompartment('eng-room-lower')}
                    className="cursor-pointer"
                  >
                    {isErrorComp(getComp('eng-room-lower')) ? (
                      <rect x="300" y="140" width="260" height="70" fill="url(#fire3dGradient)" stroke="#ef4444" strokeWidth="3" rx="6" />
                    ) : (
                      <rect x="300" y="140" width="260" height="70" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="6" />
                    )}
                    <text x="315" y="172" fill="#FFFFFF" fontSize="12" fontWeight="900">
                      ENGINE ROOM / MACHINERY (ER-L01)
                    </text>

                    {isErrorComp(getComp('eng-room-lower')) && (
                      <g transform="translate(315, 180)">
                        <rect x="0" y="0" width="170" height="20" fill="#dc2626" rx="4" filter="url(#glowPulse)" />
                        <text x="8" y="14" fill="#FFFFFF" fontSize="10" fontWeight="black" className="animate-pulse">
                          🔥 CRITICAL FIRE WARNING
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              )}

              {/* ========================================================= */}
              {/* SECTION 2: 03 BRIDGE DECK (+6.40m)                         */}
              {/* ========================================================= */}
              {(selectedView === 'all' || selectedView === 'bridge') && (
                <g 
                  id="bridge-deck-3d" 
                  transform={is3DMode ? (selectedView === 'bridge' ? "translate(0, 30)" : "translate(0, 270)") : "translate(0, 260)"}
                  className="transition-transform duration-500"
                >
                  {/* Deck Title Tag */}
                  <g transform="translate(30, 0)">
                    <rect x="0" y="0" width="220" height="32" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="14" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900">03 BRIDGE DECK (+6.40m)</text>
                  </g>

                  {/* 3D Deck Plate Extrusion Depth Shadow */}
                  {is3DMode && (
                    <path
                      d="M 120 70 L 500 70 Q 620 70 700 110 Q 620 150 500 150 L 120 150 Z"
                      fill="#020617"
                      transform="translate(0, 18)"
                      opacity="0.9"
                    />
                  )}

                  {/* Bridge Deck Main Base Plate */}
                  <path
                    d="M 120 50 
                       L 500 50 
                       Q 620 50 700 90 
                       Q 620 130 500 130 
                       L 120 130 
                       Z"
                    fill="url(#deck3dGradient)"
                    stroke="#3b82f6"
                    strokeWidth={is3DMode ? "3" : "2"}
                    filter={is3DMode ? "url(#wallShadow)" : undefined}
                  />

                  {/* Open Observation Deck */}
                  <rect x="120" y="50" width="100" height="80" fill="#0f172a" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,2" />
                  <text x="135" y="95" fill="#94a3b8" fontSize="10" fontWeight="bold">OPEN DECK</text>

                  {/* Captain's Cabin Room */}
                  <g 
                    onClick={() => onSelectCompartment('accommodation-a')}
                    onMouseEnter={() => setHoveredRoom('accommodation-a')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    <rect 
                      x="220" y="50" width="130" height="40" 
                      className={getRoomColorClass(getComp('accommodation-a'), activeComp.id === 'accommodation-a')} 
                      strokeWidth="2" 
                      rx="4"
                    />
                    <text x="230" y="72" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      CAPTAIN'S CABIN
                    </text>
                    <text x="230" y="84" fill="#cbd5e1" fontSize="9" fontWeight="bold">
                      {getComp('accommodation-a').temperature}°C
                    </text>

                    {/* Blinking Status LED Dot */}
                    <circle 
                      cx="335" cy="62" r="5" 
                      fill={isErrorComp(getComp('accommodation-a')) ? '#ef4444' : '#10b981'} 
                      className="animate-ping" 
                      filter="url(#glowPulse)"
                    />
                    <circle 
                      cx="335" cy="62" r="4" 
                      fill={isErrorComp(getComp('accommodation-a')) ? '#ef4444' : '#10b981'} 
                    />
                  </g>

                  {/* Wheelhouse / Main Command Room ('bridge') */}
                  <g 
                    onClick={() => onSelectCompartment('bridge')}
                    onMouseEnter={() => setHoveredRoom('bridge')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    {/* 3D Extruded Room Shadow in 3D Mode */}
                    {is3DMode && (
                      <rect x="350" y="58" width="220" height="80" fill="#020617" opacity="0.6" rx="6" />
                    )}

                    <rect 
                      x="350" y="50" width="220" height="80" 
                      className={getRoomColorClass(getComp('bridge'), activeComp.id === 'bridge')} 
                      strokeWidth="3"
                      rx="6"
                    />

                    {/* Wheelhouse Console Geometry */}
                    <rect x="520" y="60" width="12" height="60" fill="#38bdf8" rx="2" />
                    <text x="365" y="80" fill="#FFFFFF" fontSize="13" fontWeight="900" className="tracking-tight">
                      WHEELHOUSE / COMMAND
                    </text>
                    <text x="365" y="98" fill="#e2e8f0" fontSize="11" fontWeight="bold">
                      ZONE 1 • {getComp('bridge').temperature}°C • {getComp('bridge').smokePpm} PPM
                    </text>

                    {/* Blinking Critical Alert Badge if Room in Error */}
                    {isErrorComp(getComp('bridge')) ? (
                      <g transform="translate(365, 105)">
                        <rect x="0" y="0" width="150" height="20" fill="#dc2626" rx="4" filter="url(#glowPulse)" />
                        <text x="8" y="14" fill="#FFFFFF" fontSize="10" fontWeight="black">
                          ⚠ FIRE / ALARM ACTIVE
                        </text>
                      </g>
                    ) : (
                      <g transform="translate(365, 105)">
                        <rect x="0" y="0" width="100" height="18" fill="#065f46" rx="4" />
                        <text x="6" y="13" fill="#34d399" fontSize="9" fontWeight="bold">
                          ● SYSTEM SECURE
                        </text>
                      </g>
                    )}

                    {/* Water Mist Spray Animation Overlay if Simulating */}
                    {simulatingMist === 'bridge' && (
                      <g transform="translate(350, 50)">
                        <rect x="0" y="0" width="220" height="80" fill="url(#mistSprayGradient)" rx="6" />
                        <text x="60" y="45" fill="#0284c7" fontSize="11" fontWeight="black" className="animate-bounce">
                          💦 100 BAR MIST SPRAYING
                        </text>
                      </g>
                    )}

                    {/* Blinking Sensor LEDs on Wheelhouse */}
                    <g transform="translate(540, 65)">
                      <circle cx="0" cy="0" r="6" fill="#38bdf8" className="animate-ping" filter="url(#glowPulse)" />
                      <circle cx="0" cy="0" r="4" fill="#38bdf8" />
                    </g>
                  </g>
                </g>
              )}

              {/* Connecting 3D Pillar Guides in 3D Stack View */}
              {selectedView === 'all' && is3DMode && (
                <g id="deck-3d-connecting-posts" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4">
                  <line x1="100" y1="620" x2="100" y2="460" />
                  <line x1="850" y1="580" x2="850" y2="420" />
                  <line x1="100" y1="460" x2="120" y2="320" />
                  <line x1="850" y1="420" x2="700" y2="280" />
                </g>
              )}

              {/* ========================================================= */}
              {/* SECTION 3: 02 MAIN DECK (+3.20m)                         */}
              {/* ========================================================= */}
              {(selectedView === 'all' || selectedView === 'main') && (
                <g 
                  id="main-deck-3d" 
                  transform={is3DMode ? (selectedView === 'main' ? "translate(0, 30)" : "translate(0, 440)") : "translate(0, 420)"}
                  className="transition-transform duration-500"
                >
                  {/* Deck Title Tag */}
                  <g transform="translate(30, 0)">
                    <rect x="0" y="0" width="200" height="32" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                    <text x="14" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900">02 MAIN DECK (+3.20m)</text>
                  </g>

                  {/* 3D Deck Extrusion Shadow */}
                  {is3DMode && (
                    <path
                      d="M 100 70 L 620 70 Q 780 70 850 110 Q 780 150 620 150 L 100 150 Z"
                      fill="#020617"
                      transform="translate(0, 18)"
                      opacity="0.9"
                    />
                  )}

                  {/* Main Deck Outer Hull */}
                  <path
                    d="M 100 50 
                       L 620 50 
                       Q 780 50 850 90 
                       Q 780 130 620 130 
                       L 100 130 
                       Z"
                    fill="url(#deck3dGradient)"
                    stroke="#38bdf8"
                    strokeWidth={is3DMode ? "3" : "2"}
                    filter={is3DMode ? "url(#wallShadow)" : undefined}
                  />

                  {/* Aft Deck */}
                  <rect x="100" y="50" width="100" height="80" fill="#0f172a" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,2" />
                  <text x="115" y="95" fill="#94a3b8" fontSize="10" fontWeight="bold">AFT DECK</text>

                  {/* Main Salon ('accommodation-a') */}
                  <g 
                    onClick={() => onSelectCompartment('accommodation-a')}
                    onMouseEnter={() => setHoveredRoom('accommodation-a')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    <rect 
                      x="200" y="50" width="160" height="80" 
                      className={getRoomColorClass(getComp('accommodation-a'), activeComp.id === 'accommodation-a')} 
                      strokeWidth="2.5" 
                      rx="4"
                    />
                    <text x="215" y="80" fill="#FFFFFF" fontSize="12" fontWeight="bold">
                      MAIN SALON
                    </text>
                    <text x="215" y="96" fill="#cbd5e1" fontSize="10">
                      ACC-A • {getComp('accommodation-a').smokePpm} PPM
                    </text>

                    {isErrorComp(getComp('accommodation-a')) && (
                      <g transform="translate(215, 102)">
                        <rect x="0" y="0" width="130" height="18" fill="#dc2626" rx="3" filter="url(#glowPulse)" />
                        <text x="6" y="13" fill="#FFFFFF" fontSize="9" fontWeight="bold">⚠ TEMP EXCEEDED</text>
                      </g>
                    )}

                    {/* Blinking Sensor Dot */}
                    <circle 
                      cx="345" cy="65" r="5" 
                      fill={isErrorComp(getComp('accommodation-a')) ? '#ef4444' : '#10b981'} 
                      className="animate-ping" 
                      filter="url(#glowPulse)"
                    />
                    <circle 
                      cx="345" cy="65" r="4" 
                      fill={isErrorComp(getComp('accommodation-a')) ? '#ef4444' : '#10b981'} 
                    />
                  </g>

                  {/* Dining Area */}
                  <rect x="360" y="50" width="100" height="80" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="375" y="95" fill="#f8fafc" fontSize="10" fontWeight="bold">DINING AREA</text>

                  {/* Galley */}
                  <rect x="460" y="50" width="80" height="80" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="475" y="95" fill="#f8fafc" fontSize="10" fontWeight="bold">GALLEY</text>

                  {/* VIP Cabin */}
                  <rect x="540" y="50" width="120" height="80" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="555" y="90" fill="#f8fafc" fontSize="10" fontWeight="bold">VIP CABIN</text>

                  {/* Fore Cabin / DG Cargo Hold ('cargo-hold-2') */}
                  <g 
                    onClick={() => onSelectCompartment('cargo-hold-2')}
                    onMouseEnter={() => setHoveredRoom('cargo-hold-2')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    <path 
                      d="M 660 50 L 760 50 Q 820 50 840 90 Q 820 130 760 130 L 660 130 Z" 
                      className={getRoomColorClass(getComp('cargo-hold-2'), activeComp.id === 'cargo-hold-2')} 
                      strokeWidth="2.5" 
                    />
                    <text x="675" y="80" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                      FORE CABIN / CH-02
                    </text>
                    <text x="675" y="96" fill="#cbd5e1" fontSize="9">
                      {getComp('cargo-hold-2').name}
                    </text>

                    {isErrorComp(getComp('cargo-hold-2')) && (
                      <g transform="translate(675, 102)">
                        <rect x="0" y="0" width="130" height="18" fill="#7c3aed" rx="3" filter="url(#glowPulse)" />
                        <text x="6" y="13" fill="#FFFFFF" fontSize="9" fontWeight="bold">⚠ CYBER PLC ALERT</text>
                      </g>
                    )}

                    {/* Blinking LED */}
                    <circle cx="810" cy="80" r="5" fill="#a855f7" className="animate-ping" filter="url(#glowPulse)" />
                    <circle cx="810" cy="80" r="4" fill="#a855f7" />
                  </g>
                </g>
              )}

              {/* ========================================================= */}
              {/* SECTION 4: 01 TANK TOP DECK (0.00m)                        */}
              {/* ========================================================= */}
              {(selectedView === 'all' || selectedView === 'tank') && (
                <g 
                  id="tank-top-deck-3d" 
                  transform={is3DMode ? (selectedView === 'tank' ? "translate(0, 30)" : "translate(0, 610)") : "translate(0, 580)"}
                  className="transition-transform duration-500"
                >
                  {/* Deck Title Tag */}
                  <g transform="translate(30, 0)">
                    <rect x="0" y="0" width="220" height="32" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                    <text x="14" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900">01 TANK TOP DECK (0.00m)</text>
                  </g>

                  {/* 3D Deck Shadow */}
                  {is3DMode && (
                    <path
                      d="M 110 70 L 600 70 Q 720 70 780 110 Q 720 150 600 150 L 110 150 Z"
                      fill="#020617"
                      transform="translate(0, 18)"
                      opacity="0.9"
                    />
                  )}

                  {/* Tank Top Outer Hull */}
                  <path
                    d="M 110 50 
                       L 600 50 
                       Q 720 50 780 90 
                       Q 720 130 600 130 
                       L 110 130 
                       Z"
                    fill="url(#deck3dGradient)"
                    stroke="#10b981"
                    strokeWidth={is3DMode ? "3" : "2"}
                    filter={is3DMode ? "url(#wallShadow)" : undefined}
                  />

                  {/* Steering Gear Room ('steering-gear') */}
                  <g 
                    onClick={() => onSelectCompartment('steering-gear')}
                    onMouseEnter={() => setHoveredRoom('steering-gear')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    <rect 
                      x="110" y="50" width="90" height="80" 
                      className={getRoomColorClass(getComp('steering-gear'), activeComp.id === 'steering-gear')} 
                      strokeWidth="2" 
                      rx="4"
                    />
                    <text x="118" y="80" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      STEERING GEAR
                    </text>
                    <text x="118" y="96" fill="#cbd5e1" fontSize="8">
                      SG-01 • {getComp('steering-gear').temperature}°C
                    </text>

                    <circle cx="185" cy="65" r="4" fill="#10b981" className="animate-ping" />
                  </g>

                  {/* Fuel Tank */}
                  <rect x="200" y="50" width="60" height="80" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <text x="208" y="95" fill="#94a3b8" fontSize="9" fontWeight="bold">FUEL TANK</text>

                  {/* Engine Room Lower (Main High-Risk Machinery Room 'eng-room-lower') */}
                  <g 
                    onClick={() => onSelectCompartment('eng-room-lower')}
                    onMouseEnter={() => setHoveredRoom('eng-room-lower')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    {/* Shadow extrusion */}
                    {is3DMode && (
                      <rect x="260" y="58" width="220" height="80" fill="#020617" opacity="0.7" rx="6" />
                    )}

                    <rect 
                      x="260" y="50" width="220" height="80" 
                      className={getRoomColorClass(getComp('eng-room-lower'), activeComp.id === 'eng-room-lower')} 
                      strokeWidth="3.5" 
                      rx="6"
                    />

                    {/* Twin Diesel Engine Vector Icons */}
                    <rect x="280" y="60" width="60" height="22" fill="#000000" rx="3" stroke="#f8fafc" strokeWidth="1" />
                    <rect x="280" y="98" width="60" height="22" fill="#000000" rx="3" stroke="#f8fafc" strokeWidth="1" />

                    <text x="350" y="78" fill="#FFFFFF" fontSize="13" fontWeight="900" className="tracking-tight">
                      ENGINE ROOM (LOWER)
                    </text>
                    <text x="350" y="96" fill="#f1f5f9" fontSize="11" fontWeight="bold">
                      ER-L01 • {getComp('eng-room-lower').temperature}°C • {getComp('eng-room-lower').smokePpm} PPM
                    </text>

                    {/* Intense Flashing Fire Error Indicator */}
                    {isErrorComp(getComp('eng-room-lower')) ? (
                      <g transform="translate(350, 104)">
                        <rect x="0" y="0" width="160" height="20" fill="#dc2626" rx="4" filter="url(#glowPulse)" />
                        <text x="8" y="14" fill="#FFFFFF" fontSize="10" fontWeight="black" className="animate-pulse">
                          🔥 CRITICAL FIRE ALARM
                        </text>
                      </g>
                    ) : (
                      <g transform="translate(350, 104)">
                        <rect x="0" y="0" width="110" height="18" fill="#065f46" rx="4" />
                        <text x="6" y="13" fill="#34d399" fontSize="9" fontWeight="bold">
                          ● ENGINE SECURE
                        </text>
                      </g>
                    )}

                    {/* Water Mist Spray Effect if active */}
                    {simulatingMist === 'eng-room-lower' && (
                      <g transform="translate(260, 50)">
                        <rect x="0" y="0" width="220" height="80" fill="url(#mistSprayGradient)" rx="6" />
                        <text x="50" y="45" fill="#0284c7" fontSize="11" fontWeight="black" className="animate-bounce">
                          💦 100 BAR MIST SPRAYING
                        </text>
                      </g>
                    )}

                    {/* Dual Blinking Red Alarm LED Dots */}
                    <circle cx="465" cy="65" r="7" fill="#ef4444" className="animate-ping" filter="url(#glowPulse)" />
                    <circle cx="465" cy="65" r="4" fill="#ef4444" />
                  </g>

                  {/* Water Mist Pump Room ('pump-room') */}
                  <g 
                    onClick={() => onSelectCompartment('pump-room')}
                    onMouseEnter={() => setHoveredRoom('pump-room')}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className="cursor-pointer group"
                  >
                    <rect 
                      x="480" y="50" width="100" height="80" 
                      className={getRoomColorClass(getComp('pump-room'), activeComp.id === 'pump-room')} 
                      strokeWidth="2" 
                      rx="4"
                    />
                    <text x="490" y="80" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                      PUMP ROOM
                    </text>
                    <text x="490" y="96" fill="#cbd5e1" fontSize="8">
                      100 BAR MIST
                    </text>

                    {/* Blinking Cyan Pump LED */}
                    <circle cx="565" cy="65" r="5" fill="#38bdf8" className="animate-ping" filter="url(#glowPulse)" />
                    <circle cx="565" cy="65" r="3.5" fill="#38bdf8" />
                  </g>

                  {/* Crew Cabins */}
                  <rect x="580" y="50" width="90" height="80" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                  <text x="590" y="88" fill="#f8fafc" fontSize="9" fontWeight="bold">CREW CABINS</text>

                  {/* Fore Peak */}
                  <path d="M 670 50 L 730 50 Q 770 50 775 90 Q 770 130 730 130 L 670 130 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <text x="680" y="95" fill="#94a3b8" fontSize="9" fontWeight="bold">FORE PEAK</text>
                </g>
              )}

              {/* ========================================================= */}
              {/* SECTION 5: 3D PARTICULARS & SYMBOL LEGEND                  */}
              {/* ========================================================= */}
              <g id="legend-3d-section" transform={selectedView === 'all' ? "translate(20, 780)" : "translate(20, 220)"}>
                  {/* Particulars Card */}
                  <rect x="0" y="0" width="460" height="175" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <rect x="0" y="0" width="460" height="28" rx="8" fill="#1e293b" />
                  <text x="14" y="19" fill="#38bdf8" fontSize="12" fontWeight="900">PRINCIPAL PARTICULARS (YACHT SPECIFICATION)</text>

                  <g fontSize="10" fill="#f8fafc">
                    <text x="15" y="46" fontWeight="bold">LENGTH OVERALL (L.O.A):</text> <text x="230" y="46" fill="#cbd5e1">27.00 m (88.5 ft)</text>
                    <line x1="10" y1="52" x2="450" y2="52" stroke="#1e293b" />

                    <text x="15" y="68" fontWeight="bold">LENGTH WATERLINE (L.W.L):</text> <text x="230" y="68" fill="#cbd5e1">23.50 m</text>
                    <line x1="10" y1="74" x2="450" y2="74" stroke="#1e293b" />

                    <text x="15" y="90" fontWeight="bold">BEAM OVERALL:</text> <text x="230" y="90" fill="#cbd5e1">6.60 m</text>
                    <line x1="10" y1="96" x2="450" y2="96" stroke="#1e293b" />

                    <text x="15" y="112" fontWeight="bold">MAX DRAFT (LIGHT):</text> <text x="230" y="112" fill="#cbd5e1">1.60 m</text>
                    <line x1="10" y1="118" x2="450" y2="118" stroke="#1e293b" />

                    <text x="15" y="134" fontWeight="bold">GROSS TONNAGE / CLASS:</text> <text x="230" y="134" fill="#34d399" fontWeight="bold">120 GT • SOLAS II-2 & IEC 62443</text>
                    <line x1="10" y1="140" x2="450" y2="140" stroke="#1e293b" />

                    <text x="15" y="156" fontWeight="bold">PASSENGERS / CREW:</text> <text x="230" y="156" fill="#cbd5e1">12 Guests / 4 Crew</text>
                  </g>

                  {/* 3D Symbol Legend Box */}
                  <rect x="490" y="0" width="460" height="175" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <rect x="490" y="0" width="460" height="28" rx="8" fill="#1e293b" />
                  <text x="504" y="19" fill="#38bdf8" fontSize="12" fontWeight="900">3D LEGEND & LIVE SCADA STATUS</text>

                  <g fontSize="10" fill="#f8fafc" transform="translate(505, 32)">
                    {/* Fire Detector */}
                    <circle cx="12" cy="12" r="6" fill="#ef4444" className="animate-ping" />
                    <circle cx="12" cy="12" r="4" fill="#ef4444" />
                    <text x="28" y="16">FIRE ALARM (BLINKING RED)</text>

                    {/* Cyber Status */}
                    <circle cx="230" cy="12" r="6" fill="#a855f7" className="animate-ping" />
                    <circle cx="230" cy="12" r="4" fill="#a855f7" />
                    <text x="246" y="16">CYBER ANOMALY (PURPLE)</text>

                    {/* Smoke Node */}
                    <circle cx="12" cy="42" r="5" fill="#38bdf8" />
                    <text x="28" y="46">SMOKE DETECTOR (CYAN)</text>

                    {/* Safe Status */}
                    <circle cx="230" cy="42" r="5" fill="#10b981" />
                    <text x="246" y="46">NOMINAL / SECURE (GREEN)</text>

                    {/* Water Mist Nozzle */}
                    <polygon points="12,68 6,76 18,76" fill="#0284c7" />
                    <text x="28" y="74">100 BAR WATER MIST SPRAY</text>

                    {/* Divider */}
                    <line x1="0" y1="88" x2="430" y2="88" stroke="#1e293b" />

                    {/* Active Vessel Status Row */}
                    <text x="0" y="108" fontWeight="bold">CURRENT VESSEL SAFETY SCORE:</text>
                    <text x="200" y="108" fill="#34d399" fontWeight="900" fontSize="13">99.8% (SOLAS NOMINAL)</text>

                    <text x="0" y="128" fontWeight="bold">SOLAS MIST VALVE PRESSURE:</text>
                    <text x="200" y="128" fill="#38bdf8" fontWeight="bold">100 BAR OPERATIONAL</text>
                  </g>
                </g>
            </svg>
          </div>

          {/* Canvas Footer Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" /> Blinking Dots = Active SCADA Sensor Signals
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 bg-sky-600 rounded border border-sky-300" /> Selected Room
              </span>
            </div>
            <span className="text-blue-400 font-bold">Click any room to inspect parameters</span>
          </div>
        </div>

        {/* Right Column: Selected Room Inspector Panel */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-white space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] font-bold text-blue-400 font-mono uppercase tracking-wider">
                SCADA INSPECTOR • ZONE {activeComp.fireZone}
              </div>
              <h3 className="text-2xl font-black text-white mt-0.5 tracking-tight">{activeComp.name}</h3>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono uppercase ${
              isErrorComp(activeComp)
                ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {activeComp.status}
            </span>
          </div>

          {/* Interactive Water Mist Test Button */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-slate-300 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-sky-400" />
                SOLAS II-2 WATER MIST SYSTEM
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">100 BAR READY</span>
            </div>

            <button
              onClick={() => handleTriggerMist(activeComp.id)}
              disabled={simulatingMist === activeComp.id}
              className={`w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all ${
                simulatingMist === activeComp.id
                  ? 'bg-sky-600 text-white animate-bounce'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>
                {simulatingMist === activeComp.id ? 'MIST DISCHARGING (4s TEST)...' : `SIMULATE MIST DISCHARGE IN ${activeComp.code}`}
              </span>
            </button>
          </div>

          {/* Alarm Banner if Error */}
          {isErrorComp(activeComp) && (
            <div className="bg-red-950/80 text-red-200 p-4 rounded-xl border border-red-500/50 space-y-2">
              <div className="flex items-center gap-2 font-black text-xs font-mono text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                <span>ACTIVE SCADA INCIDENT</span>
              </div>
              <p className="text-xs text-red-100 leading-relaxed font-sans">
                Sensors in <strong>{activeComp.name}</strong> registered abnormal threshold breaches. Water mist valve status is <strong>{activeComp.waterMistStatus}</strong>.
              </p>
            </div>
          )}

          {/* Environmental Gauges */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans block font-bold">Temperature</span>
              <span className={`text-2xl font-black mt-1 block ${
                activeComp.temperature > 50 ? 'text-red-400' : 'text-white'
              }`}>
                {activeComp.temperature}°C
              </span>
              <span className="text-[9px] text-slate-500 font-sans block mt-0.5">Threshold: 55°C</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans block font-bold">Smoke Density</span>
              <span className={`text-2xl font-black mt-1 block ${
                activeComp.smokePpm > 100 ? 'text-red-400' : 'text-white'
              }`}>
                {activeComp.smokePpm} PPM
              </span>
              <span className="text-[9px] text-slate-500 font-sans block mt-0.5">Threshold: 50 PPM</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans block font-bold">Water Mist Line</span>
              <span className="text-sm font-black text-sky-400 mt-1 block">
                {activeComp.waterMistStatus}
              </span>
              <span className="text-[9px] text-slate-500 font-sans block mt-0.5">Line Pressure: 100 BAR</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans block font-bold">PLC Cyber Security</span>
              <span className="text-sm font-black text-emerald-400 mt-1 block">
                {activeComp.cyberStatus}
              </span>
              <span className="text-[9px] text-slate-500 font-sans block mt-0.5">IEC 62443 SL3</span>
            </div>
          </div>

          {/* Sensor Nodes Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-200 uppercase font-mono flex items-center justify-between">
              <span>Sensors ({activeComp.sensors.length})</span>
              <span className="text-emerald-400 font-bold">{activeComp.sensorHealthPct}% Health</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
              {activeComp.sensors.length === 0 ? (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500 font-mono">
                  No direct sensors registered
                </div>
              ) : (
                activeComp.sensors.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{s.id} • {s.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black ${s.status === 'critical' ? 'text-red-400' : 'text-white'}`}>
                        {s.value} {s.unit}
                      </div>
                      <div className="text-[9px] text-slate-500">{s.lastTested}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
