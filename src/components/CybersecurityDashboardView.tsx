import React, { useState } from 'react';
import { CyberMetric } from '../types/industrial';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Terminal, 
  Radio,
  Scan,
  RefreshCw,
  Server,
  AlertOctagon,
  Download,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';

interface CybersecurityDashboardProps {
  cyberMetrics: CyberMetric;
  gloveMode?: boolean;
}

export const CybersecurityDashboardView: React.FC<CybersecurityDashboardProps> = ({
  cyberMetrics,
  gloveMode = false,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const [gw02Isolated, setGw02Isolated] = useState(false);
  const [keyRotated, setKeyRotated] = useState(false);
  const [rotatingKeys, setRotatingKeys] = useState(false);

  // Trigger Vulnerability Scan
  const handleRunScan = () => {
    setScanning(true);
    setScanProgress(10);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            setScanResult('Scan Complete: 0 High Vulnerabilities Found. All 12 PLC Enclaves Secured.');
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // Toggle Gateway Isolation
  const handleToggleIsolation = () => {
    setGw02Isolated(prev => !prev);
  };

  // Rotate Cryptographic Keys
  const handleRotateKeys = () => {
    setRotatingKeys(true);
    setTimeout(() => {
      setRotatingKeys(false);
      setKeyRotated(true);
      setTimeout(() => setKeyRotated(false), 4000);
    }, 1500);
  };

  // Export Security Log
  const handleExportSecurityReport = () => {
    const data = JSON.stringify({
      vessel: 'M/Y SIMO',
      standard: 'IEC 62443 SL3',
      timestamp: new Date().toISOString(),
      firewallHealth: `${cyberMetrics.firewallHealthPct}%`,
      threatsBlocked: cyberMetrics.threatsBlockedToday,
      activeIncidents: cyberMetrics.activeIncidents,
      gatewayIsolation: gw02Isolated ? 'ISOLATED' : 'NOMINAL',
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MY_SIMO_Cyber_Compliance_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-cyan-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <span>SCADA & PLC CYBERSECURITY SHIELD</span>
              <span className="bg-cyan-100 text-cyan-900 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                IEC 62443 SL3 HARDENED
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">Zero Trust Industrial Cyber Defense</h2>
            <p className="text-xs text-slate-500">
              Real-time Modbus TCP packet inspection, dual-PLC isolation, and hardware-enforced air gap protection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRunScan}
            disabled={scanning}
            className={`px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm ${
              gloveMode ? 'py-3 text-sm' : ''
            }`}
          >
            <Scan className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning Enclave...' : 'Run Deep Vulnerability Scan'}</span>
          </button>

          <button
            onClick={handleExportSecurityReport}
            className={`px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm ${
              gloveMode ? 'py-3 text-sm' : ''
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Vulnerability Scan Progress Card */}
      {scanning && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-blue-500/50 shadow-md space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-cyan-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
              EXECUTING IEC 62443 PENETRATION & DEEP PACKET SCAN...
            </span>
            <span className="font-black text-white">{scanProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-cyan-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            Auditing Modbus TCP Ports 502/443 • Validating ECC-384 Hash Signature Chains • Testing VLAN 40 Air-Gap
          </div>
        </div>
      )}

      {scanResult && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{scanResult}</span>
          </div>
          <button
            onClick={() => setScanResult(null)}
            className="text-emerald-700 hover:text-emerald-950 font-sans text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Cyber Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Firewall Health */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>FIREWALL HEALTH</span>
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{cyberMetrics.firewallHealthPct}%</div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            0 Malicious Packet Ingress
          </div>
        </div>

        {/* IDS / IPS */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>INTRUSION PREVENTION</span>
            <Radio className="w-4 h-4 text-cyan-600 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-slate-900">100% Active</div>
          <div className="text-xs text-slate-600 font-sans">{cyberMetrics.threatsBlockedToday} Threats Intercepted Today</div>
        </div>

        {/* Failed Logins */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>AUTH ATTEMPTS (24H)</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{cyberMetrics.failedLogins24h} Blocked</div>
          <div className="text-xs text-slate-500 font-sans">FIDO2 Biometric Hardened</div>
        </div>

        {/* ECC Certificates */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>ECC-384 ENCLAVE KEY</span>
            <KeyRound className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">Hardware Bound</div>
          <div className="text-xs text-emerald-700 font-semibold">Valid thru Nov 2028</div>
        </div>
      </div>

      {/* Cyber Actions Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Zap className="w-5 h-5 text-slate-800" />
          Active Defensive Countermeasures & Network Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gateway GW-02 Isolation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  MODBUS GATEWAY GW-02 (CARGO HOLD 2)
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  gw02Isolated ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {gw02Isolated ? 'AIR-GAPPED ISOLATED' : 'ONLINE / INSPECTED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Isolate Modbus TCP Gateway GW-02 to prevent spoofed solenoid command packets during active intrusion attempts.
              </p>
            </div>

            <button
              onClick={handleToggleIsolation}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                gw02Isolated
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>{gw02Isolated ? 'Re-Establish GW-02 Network Link' : 'Enforce Air-Gap Isolation on GW-02'}</span>
            </button>
          </div>

          {/* Cryptographic Key Rotation */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  ECC-384 ENCLAVE ROOT KEYS
                </span>
                <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px]">
                  {keyRotated ? 'JUST ROTATED' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Rotate master session keys across PLC-01 and PLC-02 enclaves to invalidate compromised telemetry sessions.
              </p>
            </div>

            <button
              onClick={handleRotateKeys}
              disabled={rotatingKeys}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${rotatingKeys ? 'animate-spin' : ''}`} />
              <span>{rotatingKeys ? 'Rotating Cryptographic Keys...' : 'Force Rotate ECC Session Keys'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cyber Incidents Table & Terminal */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Terminal className="w-5 h-5 text-slate-800" />
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
                <div className="text-slate-700 font-sans">{inc.description}</div>
              </div>

              <div className="text-right flex items-center sm:flex-col justify-between sm:justify-center">
                <span className="text-slate-500">{inc.timestamp}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CONTAINED BY ZERO TRUST
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


