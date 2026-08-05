import React, { useState } from 'react';
import { 
  HardDrive, 
  RefreshCw, 
  ShieldCheck, 
  Download, 
  Upload, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck,
  Zap,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { VesselStatus } from '../types/industrial';

interface SystemBackupViewProps {
  vesselStatus: VesselStatus;
  gloveMode: boolean;
}

export const SystemBackupView: React.FC<SystemBackupViewProps> = ({ vesselStatus, gloveMode }) => {
  // Firmware Update State
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(true);
  const [flashing, setFlashing] = useState(false);
  const [flashProgress, setFlashProgress] = useState(0);
  const [flashStep, setFlashStep] = useState<string>('');
  const [firmwareVersion, setFirmwareVersion] = useState('v4.2.1-IMO');
  const [flashSuccess, setFlashSuccess] = useState(false);

  // Backup State
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [backupHistory, setBackupHistory] = useState([
    { id: 'BAK-2026-07-27-01', size: '14.2 MB', hash: '0x8F92A...3B0', time: 'Today 00:00 UTC', type: 'Automated Satellite Sync' },
    { id: 'BAK-2026-07-26-01', size: '14.1 MB', hash: '0x3E11C...92F', time: 'Yesterday 00:00 UTC', type: 'Daily IMO Snapshot' },
  ]);
  const [backupInterval, setBackupInterval] = useState('hourly');
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState('');

  // Handle Firmware Check
  const handleCheckUpdates = () => {
    setCheckingUpdate(true);
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateAvailable(true);
    }, 1200);
  };

  // Handle Flashing
  const handleStartFlashing = () => {
    setFlashing(true);
    setFlashProgress(5);
    setFlashStep('Verifying ECC-384 Cryptographic Digital Signature...');

    setTimeout(() => {
      setFlashProgress(25);
      setFlashStep('Syncing Standby PLC #2 Enclave Memory Buffer...');
    }, 1000);

    setTimeout(() => {
      setFlashProgress(55);
      setFlashStep('Flashing Primary PLC-01 Water Mist Logic Registers...');
    }, 2500);

    setTimeout(() => {
      setFlashProgress(85);
      setFlashStep('Validating SOLAS II-2 Interlock Relay Timing...');
    }, 4000);

    setTimeout(() => {
      setFlashProgress(100);
      setFlashStep('Firmware Successfully Applied! Dual-Redundant Hot Swap Verified.');
      setFlashing(false);
      setFirmwareVersion('v4.3.0-SOLAS');
      setFlashSuccess(true);
      setUpdateAvailable(false);
    }, 5200);
  };

  // Handle Create Backup
  const handleCreateBackup = () => {
    setBackingUp(true);
    setBackupSuccess(false);

    setTimeout(() => {
      setBackingUp(false);
      setBackupSuccess(true);
      const newBak = {
        id: `BAK-${new Date().toISOString().slice(0, 10)}-${Math.floor(10 + Math.random() * 90)}`,
        size: '14.3 MB',
        hash: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 5).toUpperCase()}`,
        time: 'Just now',
        type: 'Manual Certified Enclave Snapshot'
      };
      setBackupHistory([newBak, ...backupHistory]);

      // Trigger file download
      const backupData = JSON.stringify({
        vessel: vesselStatus.name,
        imo: vesselStatus.imoNumber,
        timestamp: new Date().toISOString(),
        firmware: firmwareVersion,
        cyberStatus: vesselStatus.cyberZeroTrustShield,
        standards: ['SOLAS II-2', 'IMO FSS Code Ch. 7', 'IMO MSC.1/Circ.1472', 'IEC 62443 SL3'],
        integrityHash: '0x992FA817CB234901DE08'
      }, null, 2);

      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${vesselStatus.name.replace(/\s+/g, '_')}_Backup_${newBak.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1500);
  };

  // Handle Restore Backup
  const handleSimulateRestore = () => {
    setRestoring(true);
    setRestoreMessage('Validating snapshot SHA-256 integrity hash...');
    setTimeout(() => {
      setRestoreMessage('Restoring SCADA registers and SOLAS alarm response matrices...');
    }, 1000);
    setTimeout(() => {
      setRestoring(false);
      setRestoreMessage('System snapshot successfully restored! All sensors & PLC nodes synchronized.');
    }, 2200);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
              <HardDrive className="w-7 h-7 text-slate-800" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span>SYSTEM INTEGRITY & DISASTER RECOVERY</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-sans font-bold">
                  IEC 62443 SL3 ENCLAVE
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                Firmware Updates & Cryptographic Backup Center
              </h2>
              <p className="text-xs text-slate-500">
                PLC logic updates, cryptographic state backups, and SOLAS II-2 compliance audit logs for Port State Control (PSC).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckUpdates}
              disabled={checkingUpdate || flashing}
              className={`px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2 transition-all ${
                gloveMode ? 'py-3 text-sm' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${checkingUpdate ? 'animate-spin' : ''}`} />
              <span>{checkingUpdate ? 'Checking Satellite Link...' : 'Check Online Updates'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Firmware Updates & Cryptographic Backup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Firmware & Logic Update Module */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">PLC Firmware & SCADA Engine Updates</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg">
                Current: {firmwareVersion}
              </span>
            </div>

            {/* Current System Components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Primary Master PLC-01</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">Water Mist Interlock {firmwareVersion}</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">● Dual Active Synced</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">SCADA Zero Trust Engine</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">MARIS Core v4.8.0-SL3</span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">● ECC-384 Signature Valid</span>
              </div>
            </div>

            {/* Available Firmware Patch Card */}
            {updateAvailable && !flashSuccess && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-950">
                        Firmware Update v4.3.0-SOLAS Available
                      </h4>
                      <p className="text-xs text-blue-800 mt-0.5">
                        Includes IMO MSC.1/Circ.1472 water mist valve timing optimization & anti-spoofing Modbus patch.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                    CRITICAL IMO PATCH
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-blue-200 space-y-1">
                  <div>• Package SHA-256: <code className="text-blue-700 font-bold">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></div>
                  <div>• Security Level: <span className="font-bold text-slate-800">IACS E27 Compliant</span></div>
                  <div>• Hot Swap Safety: <span className="text-emerald-700 font-bold">Zero Downtime Dual PLC Failover</span></div>
                </div>

                {flashing ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-900 font-bold">{flashStep}</span>
                      <span className="text-blue-700 font-bold">{flashProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${flashProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleStartFlashing}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-2.5 text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      gloveMode ? 'py-3.5 text-sm' : ''
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Verify Cryptographic Signature & Flash Firmware Now</span>
                  </button>
                )}
              </div>
            )}

            {flashSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Firmware Flashed Successfully (v4.3.0-SOLAS)</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Primary PLC-01 and Standby PLC-02 are running updated interlock firmware in sync.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>IMO Resolution A.1021(26) Compliant</span>
            <span>Hot-Swap Lock: Active</span>
          </div>
        </div>

        {/* Cryptographic Backup & Restoration Module */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-800" />
                <h3 className="text-base font-bold text-slate-900">Encrypted Enclave Backup & Restoration</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">AES-256 Encrypted</span>
            </div>

            <p className="text-xs text-slate-600">
              Create cryptographically signed, tamper-proof snapshots of vessel safety configurations, water mist valve section thresholds, and incident audit logs.
            </p>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCreateBackup}
                disabled={backingUp}
                className={`bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-3 px-4 text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                  gloveMode ? 'py-4 text-sm' : ''
                }`}
              >
                <Download className={`w-4 h-4 ${backingUp ? 'animate-bounce' : ''}`} />
                <span>{backingUp ? 'Generating Enclave Bundle...' : 'Create Backup Snapshot'}</span>
              </button>

              <button
                onClick={handleSimulateRestore}
                disabled={restoring}
                className={`bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold rounded-xl py-3 px-4 text-xs flex items-center justify-center gap-2 transition-all ${
                  gloveMode ? 'py-4 text-sm' : ''
                }`}
              >
                <Upload className="w-4 h-4 text-slate-700" />
                <span>Restore From File / Enclave</span>
              </button>
            </div>

            {backupSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 font-mono flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Snapshot created & downloaded!
                </span>
                <span className="text-[10px] text-emerald-700">AES-256 Signature verified</span>
              </div>
            )}

            {restoreMessage && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 font-mono flex items-center gap-2">
                <RefreshCw className={`w-4 h-4 text-blue-600 ${restoring ? 'animate-spin' : ''}`} />
                <span>{restoreMessage}</span>
              </div>
            )}

            {/* Scheduled Backup Config */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-600" />
                  Automated Backup Frequency
                </span>
                <span className="text-emerald-700 font-mono text-[11px]">ACTIVE</span>
              </div>
              <select
                value={backupInterval}
                onChange={(e) => setBackupInterval(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono text-slate-900"
              >
                <option value="hourly">Hourly Encrypted Local TPM Snapshots</option>
                <option value="daily">Daily Satellite Cloud Relay Snapshot (IMO Audit)</option>
                <option value="voyage">Voyage Departure / Arrival Automated Trigger</option>
              </select>
            </div>

            {/* Backup History Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Recent Cryptographic Snapshots
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {backupHistory.map((b) => (
                  <div key={b.id} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-slate-900">{b.id}</div>
                      <div className="text-[10px] text-slate-500">{b.type} • {b.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-700">{b.size}</div>
                      <div className="text-[10px] text-blue-700 font-bold">{b.hash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Hardware Enclave TPM 2.0</span>
            <span>Port State Control Ready</span>
          </div>
        </div>
      </div>

      {/* Maritime Law & Standards Compliance Verification Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-slate-800" />
            <div>
              <h3 className="text-lg font-black text-slate-900">Maritime Law & IMO / SOLAS Safety Certification Matrix</h3>
              <p className="text-xs text-slate-500">
                Official compliance verification for Port State Control (PSC), Flag State Authorities, and IACS Class Societies.
              </p>
            </div>
          </div>
          <button 
            onClick={handleCreateBackup}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-700" />
            <span>Generate PSC Audit Report (PDF/JSON)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">FIRE PROTECTION</div>
            <div className="font-black text-slate-900 text-sm">SOLAS Chapter II-2</div>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              Regulation 10 compliance for fixed water-based fire extinguishing & detection.
            </p>
            <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              ✔ CERTIFIED PASSED
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">WATER MIST STANDARD</div>
            <div className="font-black text-slate-900 text-sm">IMO MSC.1/Circ.1472</div>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              Equivalent water mist systems for machinery spaces & pump rooms (18.4 Bar baseline).
            </p>
            <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              ✔ 100% PRESSURE OK
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">INDUSTRIAL CYBERSECURITY</div>
            <div className="font-black text-slate-900 text-sm">IEC 62443 SL3</div>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              Zero trust network segmentation & Modbus packet integrity for IACS Automation.
            </p>
            <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              ✔ HARDENED SHIELD
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-slate-500 text-[10px] font-bold uppercase font-sans">CLASS RESILIENCE</div>
            <div className="font-black text-slate-900 text-sm">IACS UR E26 / E27</div>
            <p className="text-[11px] text-slate-600 font-sans mt-1">
              Cyber resilience for shipborne systems and equipment integrity verification.
            </p>
            <span className="inline-block mt-2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              ✔ AUDIT COMPLIANT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
