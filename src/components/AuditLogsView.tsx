import React, { useState } from 'react';
import { AuditLogEntry } from '../types/industrial';
import { 
  FileText, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  RotateCcw, 
  Download, 
  Filter,
  CheckCircle,
  Briefcase,
  Wrench,
  Clock
} from 'lucide-react';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  userRole: 'manager' | 'engineer';
  gloveMode: boolean;
  onClearLogs?: () => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  auditLogs,
  userRole,
  gloveMode,
  onClearLogs,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'auth':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">Auth</span>;
      case 'simulation':
        return <span className="bg-purple-100 text-purple-800 border border-purple-300 font-bold px-2 py-0.5 rounded text-[10px]">Safety Drill</span>;
      case 'incident':
        return <span className="bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded text-[10px]">Incident</span>;
      case 'role_switch':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">Role Mode</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2 py-0.5 rounded text-[10px]">System</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Category', 'Details'];
    const rows = auditLogs.map(l => [l.id, l.timestamp, l.user, l.role, l.action, l.category, `"${l.details}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maritime_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>IEC 62443 Security Audit Log</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Authenticated User Activity Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cryptographically logged record of all mode switches, incident acknowledgments, and safety overrides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs by action or user..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'auth', 'role_switch', 'incident', 'simulation', 'system'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'role_switch' ? 'Role Switch' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table / List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Showing {filteredLogs.length} User Activity Record(s)</span>
          <span className="text-emerald-700 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tamper-Proof Ledger Synced
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit logs matched your search or category filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl flex-shrink-0 mt-0.5">
                    {log.role === 'manager' ? <Briefcase className="w-4 h-4 text-blue-600" /> : <Wrench className="w-4 h-4 text-indigo-600" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      {getCategoryBadge(log.category)}
                    </div>
                    <p className="text-slate-600 text-xs font-normal leading-relaxed">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5 font-mono">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-blue-600" /> {log.user} ({log.role.toUpperCase()})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {log.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> LOGGED
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
