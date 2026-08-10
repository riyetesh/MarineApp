import React, { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Layers,
  Calendar,
  Download,
  Clock,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedDay, setSelectedDay] = useState<number | null>(10);

  const handleExportAnalytics = () => {
    const reportData = JSON.stringify({
      vessel: 'M/Y SIMO',
      timeRange,
      generatedAt: new Date().toISOString(),
      mttrMins: 4.2,
      avgAckSecs: 12,
      falseAlarmPct: 0.02,
      systemAvailabilityPct: 99.98,
      zoneDistribution: [
        { zone: 'Zone 3 (Engine Room)', pct: 64, count: 18 },
        { zone: 'Zone 2 (Cargo Hold 2)', pct: 22, count: 6 },
        { zone: 'Zone 5 (Steering Gear)', pct: 8, count: 2 },
        { zone: 'Zone 1 (Bridge Deck)', pct: 6, count: 1 },
      ]
    }, null, 2);

    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MY_SIMO_SCADA_Analytics_${timeRange}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-700">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <span>SAFETY PERFORMANCE & RELIABILITY METRICS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              SOLAS & SCADA Historical Safety Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Historical MTTR, false alarm rates, water mist discharge consumption, and zone hazard distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold font-mono">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportAnalytics}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">MTTR (MEAN TIME TO RESOLVE)</div>
          <div className="text-2xl font-black text-slate-900">4.2 Mins</div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            18% improvement ({timeRange})
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">AVG ACKNOWLEDGEMENT TIME</div>
          <div className="text-2xl font-black text-slate-900">12 Secs</div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% within IMO guidelines
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">FALSE ALARM RATE</div>
          <div className="text-2xl font-black text-emerald-700">0.02%</div>
          <div className="text-xs text-slate-500 font-sans">Dual Thermal+Smoke Verification</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-semibold uppercase">SYSTEM AVAILABILITY</div>
          <div className="text-2xl font-black text-slate-900">99.98%</div>
          <div className="text-xs text-emerald-700 font-semibold font-sans">Dual Active PLC Redundancy</div>
        </div>
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Zone Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="w-5 h-5 text-slate-700" />
            Fire Zone Incident Distribution ({timeRange.toUpperCase()})
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { zone: 'Zone 3 (Engine Room Lower Bilge)', pct: 64, count: 18, color: 'bg-red-600' },
              { zone: 'Zone 2 (Cargo Hold No. 2 DG)', pct: 22, count: 6, color: 'bg-slate-700' },
              { zone: 'Zone 5 (Steering Gear Room)', pct: 8, count: 2, color: 'bg-amber-500' },
              { zone: 'Zone 1 (Accommodation & Bridge)', pct: 6, count: 1, color: 'bg-emerald-600' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-sans font-medium">{item.zone}</span>
                  <span className="font-bold">{item.count} Events ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Incident Heatmap Visual */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700" />
              Automated Safety & Sensor Audit Heatmap
            </h3>
            <span className="text-xs font-mono text-slate-500 font-bold">30-Day Grid</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const isFireDay = dayNum === 10;
              const isCyberDay = dayNum === 15;
              const isWarnDay = dayNum === 23;
              const isSelected = selectedDay === dayNum;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(dayNum)}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold border transition-all ${
                    isSelected ? 'ring-2 ring-blue-600 ring-offset-1 scale-105' : ''
                  } ${
                    isFireDay ? 'bg-red-50 border-red-500 text-red-700' :
                    isCyberDay ? 'bg-slate-100 border-slate-400 text-slate-800' :
                    isWarnDay ? 'bg-amber-50 border-amber-400 text-amber-900' :
                    'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <span>D{dayNum}</span>
                  <span className="text-[8px] font-normal">
                    {isFireDay ? 'FIRE' : isCyberDay ? 'CYBER' : isWarnDay ? 'WARN' : 'OK'}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Day {selectedDay} Audit Log Summary:</span>{' '}
                {selectedDay === 10
                  ? 'Simulated Engine Room Zone 3 Thermal IR Flashover drill (88.6°C).'
                  : selectedDay === 15
                  ? 'Rogue Modbus TCP packet flood targeting Solenoid V-202 blocked.'
                  : selectedDay === 23
                  ? 'Minor pressure drop in Standby Pump Line B (Resolved).'
                  : 'All 48 thermal IR and smoke sensors operating within nominal limits.'}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> OK: Normal</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> FIRE: Drill/Alarm</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500" /> CYBER: Anomaly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

