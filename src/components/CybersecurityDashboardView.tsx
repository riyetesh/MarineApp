import React from 'react';
import { CyberMetric } from '../types/industrial';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Terminal, 
  Radio
} from 'lucide-react';

interface CybersecurityDashboardProps {
  cyberMetrics: CyberMetric;
  gloveMode: boolean;
}

export const CybersecurityDashboardView: React.FC<CybersecurityDashboardProps> = ({
  cyberMetrics,
}) => {
  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-8 h-8 text-slate-800" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">
              SCADA & PLC CYBERSECURITY MONITORING
            </div>
            <h2 className="text-2xl font-black text-slate-900">IEC 62443 Zero Trust Security Shield</h2>
            <p className="text-xs text-slate-500">
              Active intrusion detection (IDS/IPS), Modbus TCP packet inspection, and VLAN network isolation.
            </p>
          </div>
        </div>
      </div>

      {/* Cyber Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Firewall Health */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>FIREWALL HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{cyberMetrics.firewallHealthPct}%</div>
          <div className="text-xs text-emerald-700 font-medium mt-1">0 Packet Drops</div>
        </div>

        {/* IDS / IPS */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>INTRUSION PREVENTION</span>
            <Radio className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">100% Active</div>
          <div className="text-xs text-slate-600 mt-1">{cyberMetrics.threatsBlockedToday} Threats Blocked Today</div>
        </div>

        {/* Failed Logins */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>AUTH ATTEMPTS (24H)</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{cyberMetrics.failedLogins24h} Failed</div>
          <div className="text-xs text-slate-500 mt-1">MFA & Rate Limiting Active</div>
        </div>

        {/* Certificates */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ECC CERTIFICATE</span>
            <KeyRound className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm font-black text-slate-900 mt-1">384-bit Hardware Key</div>
          <div className="text-xs text-emerald-700 mt-1">Valid thru Nov 2028</div>
        </div>
      </div>

      {/* Cyber Incidents Table & Terminal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-700" />
          Recent Cyber Threat & Modbus Protocol Event Log
        </h3>

        <div className="space-y-3">
          {cyberMetrics.activeIncidents.map((inc) => (
            <div
              key={inc.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                    {inc.id}
                  </span>
                  <span className="text-slate-900 font-bold">{inc.node}</span>
                  <span className="text-slate-500">• {inc.protocol}</span>
                </div>
                <div className="text-slate-700">{inc.description}</div>
              </div>

              <div className="text-right flex items-center sm:flex-col justify-between sm:justify-center">
                <span className="text-slate-500">{inc.timestamp}</span>
                <span className="text-slate-800 font-bold">CONTAINED BY ZERO TRUST</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

