import React, { useState } from 'react';
import { Compartment } from '../types/industrial';
import { 
  Map, 
  Thermometer, 
  Flame, 
  ShieldCheck, 
  Droplet, 
  Cpu
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
  const [selectedDeck, setSelectedDeck] = useState<'all' | 'nav' | 'main' | 'tank'>('all');
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Active compartment
  const activeComp = compartments.find(c => c.id === (selectedCompartmentId || 'eng-room-lower')) || compartments[0];

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Top Deck Layout Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Map className="w-6 h-6 text-slate-800" />
              <h2 className="text-2xl font-black text-slate-900">Interactive Vessel Deck & Fire Zone Layout</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Click any compartment or zone to inspect real-time thermal readings, smoke optical density, water mist section valves, and cyber telemetry.
            </p>
          </div>

          {/* Deck Selectors & Overlay Toggles */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
              {[
                { id: 'all', label: 'All Decks' },
                { id: 'nav', label: 'Bridge / Nav' },
                { id: 'main', label: 'Main Deck' },
                { id: 'tank', label: 'Tank Top / ER' },
              ].map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => setSelectedDeck(deck.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    selectedDeck === deck.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {deck.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-colors ${
                showHeatmap ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-600" />
              <span>Heatmap Layer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Stage & Inspector Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessel Blueprint Graphic SVG Stage (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 min-h-[480px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 pb-3">
            <span>VESSEL BLUEPRINT • M/V POSEIDON VOYAGER (280m L.O.A)</span>
            <span className="text-emerald-700 font-bold">SCADA OVERLAY ONLINE</span>
          </div>

          {/* Interactive SVG Vessel Hull Diagram */}
          <div className="relative w-full overflow-x-auto py-4 flex flex-col items-center justify-center border border-slate-100 rounded-xl bg-slate-50/50">
            <div className="w-full overflow-x-auto scrollbar-thin py-2 px-1">
              <svg
                viewBox="0 0 1060 340"
                className="w-full min-w-[650px] max-w-[1000px] mx-auto drop-shadow-md select-none h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="hullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F8FAFC" />
                    <stop offset="50%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#F8FAFC" />
                  </linearGradient>

                  {/* Heatmap Glows */}
                  <radialGradient id="criticalHeat" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Waterline Base Reference */}
                <line x1="20" y1="285" x2="1040" y2="285" stroke="#0284C7" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
                <text x="35" y="305" fill="#0369A1" fontSize="11" fontFamily="sans-serif" fontWeight="bold">WATERLINE (12.4m DRAFT)</text>

                {/* Vessel Hull Silhouette Outline */}
                <path
                  d="M 60 160 Q 40 160 30 180 L 120 275 L 940 275 L 1030 160 L 960 120 L 90 120 Z"
                  fill="url(#hullGrad)"
                  stroke="#475569"
                  strokeWidth="2.5"
                />

                {/* Deck 1: Navigation Bridge Superstructure */}
                <g
                  onClick={() => onSelectCompartment('bridge')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x="200"
                    y="35"
                    width="130"
                    height="85"
                    rx="6"
                    fill="#FFFFFF"
                    stroke={activeComp.id === 'bridge' ? '#2563EB' : '#94A3B8'}
                    strokeWidth={activeComp.id === 'bridge' ? '3' : '1.5'}
                  />
                  <text x="215" y="65" fill="#0F172A" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    BRIDGE (BR-00)
                  </text>
                  <text x="215" y="85" fill="#64748B" fontSize="10" fontFamily="monospace">
                    21.5°C • 4 PPM
                  </text>
                  <circle cx="310" cy="50" r="5" fill="#16A34A" />
                </g>

                {/* Accommodation Block Deck A */}
                <g
                  onClick={() => onSelectCompartment('accommodation-a')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x="200"
                    y="125"
                    width="140"
                    height="55"
                    rx="4"
                    fill="#FFFFFF"
                    stroke={activeComp.id === 'accommodation-a' ? '#D97706' : '#94A3B8'}
                    strokeWidth={activeComp.id === 'accommodation-a' ? '3' : '1.5'}
                  />
                  <text x="210" y="150" fill="#0F172A" fontSize="11" fontWeight="bold">
                    ACCOMMODATION
                  </text>
                  <text x="210" y="165" fill="#D97706" fontSize="10" fontFamily="monospace">
                    24.1°C • 12 PPM
                  </text>
                </g>

                {/* Cargo Holds 1 & 2 */}
                <g
                  onClick={() => onSelectCompartment('cargo-hold-2')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x="355"
                    y="130"
                    width="350"
                    height="135"
                    rx="6"
                    fill="#FFFFFF"
                    stroke={activeComp.id === 'cargo-hold-2' ? '#2563EB' : '#94A3B8'}
                    strokeWidth={activeComp.id === 'cargo-hold-2' ? '3' : '1.5'}
                  />
                  <text x="465" y="180" fill="#0F172A" fontSize="13" fontWeight="black">
                    CARGO HOLD NO. 2 (DG)
                  </text>
                  <text x="465" y="200" fill="#475569" fontSize="10" fontFamily="monospace">
                    MODBUS TCP LINK NORMAL
                  </text>
                  <circle cx="680" cy="155" r="6" fill="#2563EB" />
                </g>

                {/* Engine Room Lower Bilge (Critical Zone) */}
                <g
                  onClick={() => onSelectCompartment('eng-room-lower')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  {/* Critical Thermal Heatmap Glow */}
                  {showHeatmap && <circle cx="120" cy="225" r="85" fill="url(#criticalHeat)" />}

                  <rect
                    x="55"
                    y="180"
                    width="130"
                    height="85"
                    rx="6"
                    fill="#FEF2F2"
                    stroke="#DC2626"
                    strokeWidth="3"
                  />
                  <text x="65" y="215" fill="#991B1B" fontSize="11" fontWeight="black">
                    ENGINE ROOM
                  </text>
                  <text x="65" y="235" fill="#DC2626" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    78.4°C • 340 PPM
                  </text>
                  <circle cx="165" cy="195" r="8" fill="#DC2626" className="animate-bounce" />
                </g>

                {/* Pump Room */}
                <g
                  onClick={() => onSelectCompartment('pump-room')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x="715"
                    y="180"
                    width="125"
                    height="85"
                    rx="6"
                    fill="#FFFFFF"
                    stroke={activeComp.id === 'pump-room' ? '#2563EB' : '#94A3B8'}
                    strokeWidth="1.5"
                  />
                  <text x="725" y="215" fill="#0F172A" fontSize="11" fontWeight="bold">
                    PUMP ROOM
                  </text>
                  <text x="725" y="235" fill="#0284C7" fontSize="10" fontFamily="monospace">
                    18.4 BAR (OK)
                  </text>
                </g>

                {/* Steering Gear Room */}
                <g
                  onClick={() => onSelectCompartment('steering-gear')}
                  className="cursor-pointer transition-all hover:opacity-90"
                >
                  <rect
                    x="850"
                    y="180"
                    width="110"
                    height="85"
                    rx="6"
                    fill="#FFFFFF"
                    stroke={activeComp.id === 'steering-gear' ? '#D97706' : '#94A3B8'}
                    strokeWidth="1.5"
                  />
                  <text x="858" y="215" fill="#0F172A" fontSize="10" fontWeight="bold">
                    STEERING GEAR
                  </text>
                  <text x="858" y="235" fill="#D97706" fontSize="10" fontFamily="monospace">
                    62.0°C (WARN)
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Blueprint Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-red-600 animate-pulse" /> Critical Fire Zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" /> Warning Threshold
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-600" /> Safe Operational
              </span>
            </div>
            <span>Tap room for complete SCADA breakdown</span>
          </div>
        </div>

        {/* Right Inspector Drawer (1 Col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-[10px] font-bold text-slate-500 font-mono uppercase">
                INSPECTOR • ZONE {activeComp.fireZone}
              </div>
              <h3 className="text-xl font-black text-slate-900">{activeComp.name}</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
              activeComp.status === 'critical' ? 'bg-red-600 text-white animate-pulse' :
              activeComp.status === 'warning' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-700 text-white'
            }`}>
              {activeComp.status}
            </span>
          </div>

          {/* Environmental SCADA Gauges */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-sans block">Temperature</span>
              <span className={`text-xl font-bold mt-1 block ${
                activeComp.temperature > 50 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {activeComp.temperature}°C
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-sans block">Smoke Density</span>
              <span className={`text-xl font-bold mt-1 block ${
                activeComp.smokePpm > 100 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {activeComp.smokePpm} PPM
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-sans block">Water Mist Valve</span>
              <span className="text-sm font-bold text-blue-700 mt-1 block">
                {activeComp.waterMistStatus}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-sans block">Cyber Integrity</span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                {activeComp.cyberStatus}
              </span>
            </div>
          </div>

          {/* Active Sensor Nodes List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Sensor Nodes ({activeComp.sensors.length})</span>
              <span className="text-emerald-700 font-mono text-[11px]">{activeComp.sensorHealthPct}% Health</span>
            </h4>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {activeComp.sensors.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.id} • Tested: {s.lastTested}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${s.status === 'critical' ? 'text-red-600' : 'text-slate-800'}`}>
                      {s.value} {s.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

