import React, { useState, useEffect } from 'react';
import { NotificationItem, SeverityLevel } from '../types/industrial';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Info, 
  Clock, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  Zap,
  Radio,
  Send,
  BellRing
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onAcknowledge: (id: string) => void;
  onAcknowledgeAll: () => void;
  onSelectNotification: (id: string) => void;
  gloveMode: boolean;
  setActiveTab: (tab: string) => void;
  onSendTestPush?: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onAcknowledge,
  onAcknowledgeAll,
  onSelectNotification,
  gloveMode,
  setActiveTab,
  onSendTestPush,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pushStatus, setPushStatus] = useState<NotificationPermission>('default');
  const [pushTestSent, setPushTestSent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const handleRequestPush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setPushStatus(perm);
      if (perm === 'granted') {
        new Notification('M/V POSEIDON VOYAGER Safety System', {
          body: 'Push Alerts Enabled! You will receive instant SOLAS fire & cyber emergency notifications.',
          icon: '/favicon.ico'
        });
      }
    } else {
      alert('Browser does not support native Web Push Notifications. In-app alerts will be used.');
    }
  };

  const handleTriggerPushTest = () => {
    if (onSendTestPush) {
      onSendTestPush();
    } else if (pushStatus === 'granted') {
      new Notification('TEST PUSH ALERT: SOLAS II-2 Water Mist System', {
        body: 'Verified: High-Pressure Water Mist Line 18.4 Bar Ready.',
        icon: '/favicon.ico'
      });
    }
    setPushTestSent(true);
    setTimeout(() => setPushTestSent(false), 3000);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filterSeverity === 'unacknowledged' && item.acknowledged) return false;
    if (filterSeverity !== 'all' && filterSeverity !== 'unacknowledged' && item.severity !== filterSeverity) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.incidentNo.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.compartmentName.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.responsibleOfficer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            CRITICAL FIRE EMERGENCY
          </span>
        );
      case 'cyber':
        return (
          <span className="bg-slate-800 text-white text-xs font-bold uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-300" />
            CYBER INCIDENT
          </span>
        );
      case 'warning':
        return (
          <span className="bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARNING
          </span>
        );
      case 'info':
        return (
          <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            INFO
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RESOLVED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-slate-800" />
              <h2 className="text-2xl font-black text-slate-900">Vessel Notifications Center</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time alarm timeline, IEC 62443 cyber events, water mist triggers, and officer assignments.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleTriggerPushTest}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              title="Trigger a test Web Push Notification on your device"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>{pushTestSent ? 'Push Notification Sent!' : 'Send Test Push'}</span>
            </button>

            <button
              onClick={onAcknowledgeAll}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Acknowledge All Open Alerts
            </button>
          </div>
        </div>

        {/* Web Push Notification Status Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <BellRing className={`w-4 h-4 ${pushStatus === 'granted' ? 'text-emerald-600' : 'text-blue-600 animate-bounce'}`} />
            <span>
              <strong>Web Push Notifications:</strong>{' '}
              {pushStatus === 'granted'
                ? 'Active (Instant SOLAS Fire & Cyber Push Alerts Enabled)'
                : pushStatus === 'denied'
                ? 'Permission Denied in Browser (In-App Sounds Active)'
                : 'Enable Browser Push Alerts for Instant Emergency Duty Warnings'}
            </span>
          </div>

          {pushStatus !== 'granted' && pushStatus !== 'denied' && (
            <button
              onClick={handleRequestPush}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              Enable Push Notifications
            </button>
          )}

          {pushStatus === 'granted' && (
            <span className="text-emerald-800 font-mono text-[11px] font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              ● PUSH READY
            </span>
          )}
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2">
          {/* Severity Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'All Alerts' },
              { id: 'unacknowledged', label: 'Unacknowledged' },
              { id: 'critical', label: 'Critical (Red Fire)' },
              { id: 'cyber', label: 'Cyber' },
              { id: 'warning', label: 'Warning' },
              { id: 'info', label: 'Info' },
              { id: 'resolved', label: 'Resolved' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterSeverity(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  filterSeverity === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Incident, Zone, Officer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications Timeline Cards */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Matching Notifications Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              All monitored fire suppression zones, PLCs, and network nodes are operating within normal parameters.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isCriticalDanger = notif.severity === 'critical';

            return (
              <div
                key={notif.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm transition-all ${
                  !notif.acknowledged && isCriticalDanger
                    ? 'border-red-500 bg-red-50/30'
                    : notif.acknowledged
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Left Column: Metadata & Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(notif.severity)}

                      <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-mono px-2.5 py-1 rounded-md">
                        {notif.incidentNo}
                      </span>

                      <span className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        ZONE {notif.fireZone} • {notif.compartmentName}
                      </span>

                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      {notif.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {notif.shortDescription}
                    </p>

                    {/* Affected Equipment Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Equipment:</span>
                      {notif.affectedEquipment.map((eq, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded font-mono">
                          {eq}
                        </span>
                      ))}
                    </div>

                    {/* Assigned Officer */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 font-mono">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Officer: <strong className="text-slate-900">{notif.responsibleOfficer}</strong></span>
                      </div>
                      <div>
                        <span>Escalation: </span>
                        <span className={`font-bold ${
                          notif.escalationStatus !== 'Normal' ? 'text-red-600' : 'text-emerald-700'
                        }`}>
                          {notif.escalationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Risk Score & Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-slate-500">AI Risk Rating</div>
                      <div className="text-2xl font-black text-slate-900 flex items-center gap-1 justify-end">
                        <Zap className="w-5 h-5 text-amber-500" />
                        {notif.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-700 font-medium">
                        {notif.aiConfidence}% Model Confidence
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectNotification(notif.id);
                          setActiveTab('incident-detail');
                        }}
                        className={`bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-colors shadow-sm ${
                          gloveMode ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'
                        }`}
                      >
                        <span>Decision SOP</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {!notif.acknowledged ? (
                        <button
                          onClick={() => onAcknowledge(notif.id)}
                          className={`bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors flex items-center gap-1 ${
                            gloveMode ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Acknowledge</span>
                        </button>
                      ) : (
                        <span className="bg-slate-100 text-emerald-800 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Acked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

