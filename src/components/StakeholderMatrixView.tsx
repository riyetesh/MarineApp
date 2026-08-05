import React from 'react';
import { StakeholderMatrixRow } from '../types/industrial';
import { 
  Users
} from 'lucide-react';

interface StakeholderMatrixViewProps {
  matrix: StakeholderMatrixRow[];
  gloveMode: boolean;
}

export const StakeholderMatrixView: React.FC<StakeholderMatrixViewProps> = ({ matrix }) => {
  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-800" />
          <h2 className="text-2xl font-black text-slate-900">Stakeholder Notification & Escalation Matrix</h2>
        </div>
        <p className="text-xs text-slate-500">
          Configure notification dispatch pathways, communication channels, and automatic escalation delays per operational rank and incident severity.
        </p>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[11px] font-bold">
              <th className="p-4 font-sans text-slate-900 font-black min-w-[200px]">Officer / Stakeholder Role</th>
              <th className="p-4 text-slate-600">Low Severity</th>
              <th className="p-4 text-amber-700">Medium Severity</th>
              <th className="p-4 text-amber-900">High Severity</th>
              <th className="p-4 text-red-700">Critical Fire</th>
              <th className="p-4 text-slate-700">Cyber Incident</th>
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
                      <div className="text-slate-700 text-[11px]">{row.low.method}</div>
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
                      <div className="text-slate-700 text-[11px]">{row.medium.method}</div>
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
                      <div className="text-slate-700 text-[11px]">{row.high.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>

                {/* Critical */}
                <td className="p-4 bg-red-50/50">
                  {row.critical.notify ? (
                    <div className="space-y-1">
                      <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-[10px] inline-block animate-pulse">
                        {row.critical.delay}
                      </span>
                      <div className="text-red-900 font-bold text-[11px]">{row.critical.method}</div>
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
                      <div className="text-slate-900 font-bold text-[11px]">{row.cyber.method}</div>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-sans">No Dispatch</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

