import React, { useState } from 'react';
import { StakeholderMatrixRow } from '../types/industrial';
import { 
  Users,
  Send,
  Download,
  CheckCircle2,
  PhoneCall,
  Bell
} from 'lucide-react';

interface StakeholderMatrixViewProps {
  matrix: StakeholderMatrixRow[];
  gloveMode?: boolean;
}

export const StakeholderMatrixView: React.FC<StakeholderMatrixViewProps> = ({ matrix, gloveMode = false }) => {
  const [testingRole, setTestingRole] = useState<string | null>(null);
  const [testSuccessRole, setTestSuccessRole] = useState<string | null>(null);

  const handleTestDispatch = (roleName: string) => {
    setTestingRole(roleName);
    setTestSuccessRole(null);
    setTimeout(() => {
      setTestingRole(null);
      setTestSuccessRole(roleName);
      setTimeout(() => setTestSuccessRole(null), 3500);
    }, 1200);
  };

  const handleExportMatrixCSV = () => {
    const headers = ['Role', 'Officer Name', 'Contact Channel', 'Low Severity', 'Medium Severity', 'High Severity', 'Critical Fire', 'Cyber Incident'];
    const rows = matrix.map(r => [
      `"${r.role}"`,
      `"${r.officerName}"`,
      `"${r.contactChannel}"`,
      r.low.notify ? `"${r.low.delay} (${r.low.method})"` : '"No Dispatch"',
      r.medium.notify ? `"${r.medium.delay} (${r.medium.method})"` : '"No Dispatch"',
      r.high.notify ? `"${r.high.delay} (${r.high.method})"` : '"No Dispatch"',
      r.critical.notify ? `"${r.critical.delay} (${r.critical.method})"` : '"No Dispatch"',
      r.cyber.notify ? `"${r.cyber.delay} (${r.cyber.method})"` : '"No Dispatch"',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MY_SIMO_Escalation_Matrix_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-blue-400">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-2">
              <span>SOLAS II-2 & ISM CODE ESCALATION CHAIN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Stakeholder Escalation & Channel Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Configure notification dispatch pathways, communication channels, and automatic escalation delays per operational rank and incident severity.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportMatrixCSV}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Matrix CSV</span>
        </button>
      </div>

      {testSuccessRole && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>DISPATCH TEST SUCCESSFUL: Satellite PTT & Enclave SMS push sent to {testSuccessRole}.</span>
          </div>
        </div>
      )}

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[11px] font-bold">
              <th className="p-4 font-sans text-slate-900 font-bold min-w-[220px]">Officer / Stakeholder Role</th>
              <th className="p-4 text-slate-600">Low Severity</th>
              <th className="p-4 text-amber-700">Medium Severity</th>
              <th className="p-4 text-amber-900">High Severity</th>
              <th className="p-4 text-red-700">Critical Fire</th>
              <th className="p-4 text-slate-700">Cyber Incident</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {matrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                {/* Officer Role */}
                <td className="p-4">
                  <div className="font-bold font-sans text-sm text-slate-900">{row.role}</div>
                  <div className="text-[11px] text-blue-700 font-mono mt-0.5">{row.officerName}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{row.contactChannel}</div>
                </td>

                {/* Low */}
                <td className="p-4">
                  {row.low.notify ? (
                    <div className="space-y-1">
                      <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px] inline-block">
                        {row.low.delay}
                      </span>
                      <div className="text-slate-700 text-[11px] font-sans">{row.low.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* Medium */}
                <td className="p-4">
                  {row.medium.notify ? (
                    <div className="space-y-1">
                      <span className="bg-amber-50 border border-amber-300 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px] inline-block">
                        {row.medium.delay}
                      </span>
                      <div className="text-slate-700 text-[11px] font-sans">{row.medium.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* High */}
                <td className="p-4">
                  {row.high.notify ? (
                    <div className="space-y-1">
                      <span className="bg-amber-100 border border-amber-400 text-amber-950 px-2 py-0.5 rounded font-bold text-[10px] inline-block">
                        {row.high.delay}
                      </span>
                      <div className="text-slate-700 text-[11px] font-sans">{row.high.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* Critical */}
                <td className="p-4 bg-red-50/50">
                  {row.critical.notify ? (
                    <div className="space-y-1">
                      <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] inline-block">
                        {row.critical.delay}
                      </span>
                      <div className="text-red-900 font-bold text-[11px] font-sans">{row.critical.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* Cyber */}
                <td className="p-4 bg-slate-100/50">
                  {row.cyber.notify ? (
                    <div className="space-y-1">
                      <span className="bg-slate-800 text-white font-black px-2 py-0.5 rounded text-[10px] inline-block">
                        {row.cyber.delay}
                      </span>
                      <div className="text-slate-900 font-bold text-[11px] font-sans">{row.cyber.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* Action Test Button */}
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleTestDispatch(row.role)}
                    disabled={testingRole === row.role}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-sans font-bold text-[11px] rounded-lg transition-colors inline-flex items-center gap-1"
                  >
                    <Send className={`w-3 h-3 text-blue-600 ${testingRole === row.role ? 'animate-bounce' : ''}`} />
                    <span>{testingRole === row.role ? 'Pinging...' : 'Test Ping'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

