import React from 'react';
import { 
  BarChart3, 
  Activity, 
  Layers
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-slate-800" />
          <h2 className="text-2xl font-black text-slate-900">System Reliability & Safety Analytics</h2>
        </div>
        <p className="text-xs text-slate-500">
          Historical MTTR metrics, false alarm rates, water mist discharge consumption, and zone risk distribution.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">MTTR (MEAN TIME TO RESOLVE)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">4.2 Mins</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">&darr; 18% improvement this month</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">AVG ACKNOWLEDGEMENT TIME</div>
          <div className="text-2xl font-black text-slate-900 mt-1">12 Secs</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">100% within IMO guidelines</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">FALSE ALARM RATE</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">0.02%</div>
          <div className="text-xs text-slate-500 mt-1">Dual Thermal+Smoke Verification</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 font-semibold">SYSTEM AVAILABILITY</div>
          <div className="text-2xl font-black text-slate-900 mt-1">99.98%</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Dual Active PLC Redundancy</div>
        </div>
      </div>

      {/* Visual Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Zone Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            Fire Zone Incident Distribution (Past 12 Months)
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
                  <span>{item.zone}</span>
                  <span className="font-bold">{item.count} Events ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                  <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Incident Heatmap Visual */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-700" />
            30-Day Automated Safety Check Heatmap
          </h3>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const isFireDay = i === 9;
              const isCyberDay = i === 14;
              const isWarnDay = i === 22;

              return (
                <div
                  key={i}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold border ${
                    isFireDay ? 'bg-red-50 border-red-500 text-red-700' :
                    isCyberDay ? 'bg-slate-100 border-slate-400 text-slate-800' :
                    isWarnDay ? 'bg-amber-50 border-amber-400 text-amber-900' :
                    'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                  title={`Day ${i + 1}`}
                >
                  <span>D{i + 1}</span>
                  <span className="text-[8px] font-normal">
                    {isFireDay ? 'FIRE' : isCyberDay ? 'CYBER' : isWarnDay ? 'WARN' : 'OK'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
            <span>OK = Normal</span>
            <span>FIRE = Fire Trigger</span>
            <span>CYBER = Anomaly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

