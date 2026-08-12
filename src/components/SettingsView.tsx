import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Wifi, 
  Download
} from 'lucide-react';

interface SettingsViewProps {
  gloveMode: boolean;
  setGloveMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ gloveMode, setGloveMode }) => {
  const [hornEnabled, setHornEnabled] = useState(true);
  const [pagerVibrate, setPagerVibrate] = useState(true);
  const [cloudSyncMinutes, setCloudSyncMinutes] = useState('5');
  const [retentionDays, setRetentionDays] = useState('365');
  const [exported, setExported] = useState(false);

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-800" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">System Parameters & SCADA Settings</h2>
        </div>
        <p className="text-xs text-slate-500">
          Configure notification alerts, role permissions, satellite cloud synchronization, and IEC 62443 compliance options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification & Audio Alert Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-slate-700" />
            Alert Dispatch & Glove Mode
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Glove-Friendly Touch Target Mode</div>
                <div className="text-slate-500 text-[11px]">Enlarges UI controls for heavy maritime work gloves</div>
              </div>
              <button
                onClick={() => setGloveMode(prev => !prev)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  gloveMode ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {gloveMode ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Bridge Horn & Engine Room Siren</div>
                <div className="text-slate-500 text-[11px]">Automatic high-decibel audio alarm triggers on Critical fire</div>
              </div>
              <input
                type="checkbox"
                checked={hornEnabled}
                onChange={(e) => setHornEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 bg-white border-slate-300"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Continuous Pager Vibration Interlock</div>
                <div className="text-slate-500 text-[11px]">Haptic feedback on officer rugged mobile devices</div>
              </div>
              <input
                type="checkbox"
                checked={pagerVibrate}
                onChange={(e) => setPagerVibrate(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 bg-white border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Cloud Telemetry & Data Retention */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Wifi className="w-5 h-5 text-slate-700" />
            Satellite Cloud Sync & Audit Retention
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-700 font-bold mb-1 font-sans">Satellite Cloud Telemetry Interval</label>
              <select
                value={cloudSyncMinutes}
                onChange={(e) => setCloudSyncMinutes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-sans"
              >
                <option value="1">Real-time Stream (1 Min - High Bandwidth)</option>
                <option value="5">Standard Voyage (5 Mins)</option>
                <option value="15">Economic Sat-Link (15 Mins)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 font-sans">IMO Audit Log Retention Period</label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-sans"
              >
                <option value="365">365 Days (IMO Compliant)</option>
                <option value="730">2 Years (Extended Flag State Standard)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setExported(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-sans"
              >
                <Download className="w-4 h-4" />
                <span>Export Master Audit Log & Config (JSON)</span>
              </button>
              {exported && (
                <div className="text-[11px] text-emerald-700 text-center mt-2 font-sans font-bold">
                  Export complete. Hash: 0x8F92A...3B0
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

