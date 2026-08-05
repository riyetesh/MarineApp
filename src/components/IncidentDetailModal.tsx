import React, { useState } from 'react';
import { NotificationItem, SOPStep } from '../types/industrial';
import { 
  BrainCircuit, 
  Flame, 
  Droplet, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ArrowLeft,
  Zap
} from 'lucide-react';

interface IncidentDetailViewProps {
  notification: NotificationItem | null;
  onAcknowledge: (id: string) => void;
  gloveMode: boolean;
  onBack: () => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  notification,
  onAcknowledge,
  gloveMode,
  onBack,
}) => {
  if (!notification) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
        <BrainCircuit className="w-12 h-12 text-blue-600 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">No Incident Selected</h3>
        <p className="text-xs text-slate-500">
          Select an incident from the Notifications Center or Dashboard to view AI Decision Support and Standard Operating Procedures.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
        >
          Return to Notifications
        </button>
      </div>
    );
  }

  // SOP Steps state
  const [sopSteps, setSopSteps] = useState<SOPStep[]>([
    { id: 1, title: 'Verify CCTV / Infrared Local Feed', description: 'Confirm thermal signature near Fuel Oil Purifier Unit #2', automated: false, completed: true },
    { id: 2, title: 'Confirm Zone 3 Evacuation', description: 'Ensure no personnel inside Engine Room Lower Bilge', automated: false, completed: true },
    { id: 3, title: 'Close Automated Fire Dampers ER-3', description: 'Isolate ventilation loop to prevent oxygen feeding', automated: true, completed: true },
    { id: 4, title: 'Trip Fuel Oil Emergency Quick-Closing Valves', description: 'Isolate fuel supply lines leading to Purifier Unit 2', automated: true, completed: false },
    { id: 5, title: 'Confirm Water Mist Pre-Discharge Horn', description: 'Audio/Visual warning sound active for 30s', automated: true, completed: false },
    { id: 6, title: 'Release High-Pressure Water Mist Zone 3A', description: 'Activate solenoid V-301 at 18.4 Bar pump line', automated: false, completed: false },
  ]);

  const [mistDischarged, setMistDischarged] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const toggleSopStep = (id: number) => {
    setSopSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  const handleDischargeWaterMist = () => {
    setMistDischarged(true);
    setShowDischargeModal(false);
    setSopSteps(prev =>
      prev.map(step => (step.id === 6 ? { ...step, completed: true } : step))
    );
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Back to Notifications Center</span>
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
          <span>Incident Reference:</span>
          <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-900 font-bold">
            {notification.incidentNo}
          </span>
        </div>
      </div>

      {/* 1. Large Incident Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className={`p-6 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${
          notification.severity === 'critical'
            ? 'bg-red-50 border-red-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-md text-xs font-black uppercase text-white ${
                notification.severity === 'critical' ? 'bg-red-600' : 'bg-slate-800'
              }`}>
                {notification.severity} INCIDENT
              </span>

              <span className="bg-white border border-slate-200 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md">
                ZONE {notification.fireZone} • {notification.compartmentName}
              </span>

              <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-md font-mono">
                {notification.timestamp}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {notification.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
              {notification.shortDescription}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2">
            {!notification.acknowledged ? (
              <button
                onClick={() => onAcknowledge(notification.id)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledge Incident</span>
              </button>
            ) : (
              <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Acknowledged by {notification.acknowledgedBy || 'Chief Engineer'}
              </span>
            )}

            <button
              onClick={() => setShowDischargeModal(true)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 shadow-sm ${
                mistDischarged
                  ? 'bg-blue-600'
                  : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>{mistDischarged ? 'WATER MIST SPRAY ACTIVE' : 'RELEASE WATER MIST INTERLOCK'}</span>
            </button>
          </div>
        </div>

        {/* System Status Indicators Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 font-mono text-xs border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-500 font-sans uppercase">Water Mist Line</div>
            <div className="font-bold text-blue-700 mt-1 flex items-center gap-1">
              <Droplet className="w-4 h-4 text-blue-600" />
              {mistDischarged ? 'SPRAY ACTIVE (18.4 Bar)' : 'INTERLOCK STANDBY'}
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-sans uppercase">PLC Architecture</div>
            <div className="font-bold text-emerald-700 mt-1 flex items-center gap-1">
              <Cpu className="w-4 h-4 text-emerald-600" />
              PLC-01 Active & Locked
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-sans uppercase">Sensor Trigger</div>
            <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
              <Flame className="w-4 h-4 text-slate-700" />
              Thermal IR + Smoke
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 font-sans uppercase">Cyber Integrity</div>
            <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              IEC 62443 Guarded
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: AI Decision Support + Timeline + SOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): AI Decision Support & SOP Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Decision Support Recommendation Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">AI Decision Support Engine</h3>
              </div>
              <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold px-3 py-1 rounded-full">
                {notification.aiConfidence}% Confidence
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-500" />
                Recommended Action Plan (SOP-FIRE-03A)
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {notification.recommendedAction}
              </p>
            </div>

            {/* Severity Gauge & Risk Score */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Calculated Risk Index</div>
                <div className="text-3xl font-black text-red-600 mt-1">
                  {notification.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${notification.riskScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono">
                <div className="text-[10px] text-slate-500 uppercase font-sans">Suggested Suppression Method</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  High-Pressure Water Mist (Zone 3A)
                </div>
                <div className="text-xs text-slate-500 mt-1 font-sans">
                  Prevents thermal flashover without thermal shock to main engine block.
                </div>
              </div>
            </div>
          </div>

          {/* Standard Operating Procedure Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Standard Operating Procedure ({notification.sopId})
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {sopSteps.filter(s => s.completed).length} / {sopSteps.length} Completed
              </span>
            </div>

            <div className="space-y-2.5">
              {sopSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => toggleSopStep(step.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    step.completed
                      ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-white border-slate-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${step.completed ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                        {step.title}
                      </span>
                      {step.automated && (
                        <span className="text-[10px] font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded">
                          AUTO PLC INTERLOCK
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Event Timeline & Report Generator */}
        <div className="space-y-6">
          {/* Incident Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-slate-700" />
              Chronological Event Timeline
            </h3>

            <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {notification.timeline.map((item, idx) => (
                <div key={idx} className="relative pl-7 text-xs">
                  <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full -translate-x-1/2 ${
                    item.type === 'sensor' ? 'bg-amber-500' : 'bg-slate-800'
                  }`} />
                  <div className="font-mono text-[10px] text-slate-500">{item.time} UTC</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{item.event}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible Officers & Report Exporter */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personnel & IMO Reporting
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Assigned Officer:</span>
                <span className="font-bold text-slate-900">{notification.responsibleOfficer}</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500">Escalation Status:</span>
                <span className="font-bold text-red-600">{notification.escalationStatus}</span>
              </div>
            </div>

            <button
              onClick={() => setReportGenerated(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{reportGenerated ? 'Report PDF Downloaded' : 'Generate IMO Safety Incident Report'}</span>
            </button>

            {reportGenerated && (
              <div className="text-[11px] text-emerald-800 font-mono bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-center">
                IMO Incident Report generated & signed with ECC 384 key.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Water Mist Release */}
      {showDischargeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-red-600 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase">CONFIRM HIGH-PRESSURE MIST DISCHARGE</h3>
                <p className="text-xs text-red-600 font-bold">WATER MIST SECTION VALVE V-301 (ZONE 3 - ENGINE ROOM)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              You are authorizing the release of 18.4 Bar High-Pressure Water Mist in <strong>Engine Room Lower Bilge (Zone 3)</strong>. Ensure all crew members have evacuated Zone 3.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDischargeModal(false)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDischargeWaterMist}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-sm"
              >
                <Droplet className="w-4 h-4" />
                <span>CONFIRM DISCHARGE NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

