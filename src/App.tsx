import React, { useState } from 'react';
import { 
  initialVesselStatus, 
  initialCompartments, 
  initialNotifications, 
  initialStakeholderMatrix, 
  initialCyberMetrics,
  initialAuditLogs
} from './data/mockData';
import { NotificationItem, Compartment, AuditLogEntry } from './types/industrial';

import { Navbar } from './components/Navbar';
import { SidebarNavigation } from './components/SidebarNavigation';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { NotificationsView } from './components/NotificationsView';
import { IncidentDetailView } from './components/IncidentDetailModal';
import { VesselMapView } from './components/VesselMapView';
import { StakeholderMatrixView } from './components/StakeholderMatrixView';
import { AnalyticsView } from './components/AnalyticsView';
import { CybersecurityDashboardView } from './components/CybersecurityDashboardView';
import { SettingsView } from './components/SettingsView';
import { SystemBackupView } from './components/SystemBackupView';
import { AuditLogsView } from './components/AuditLogsView';

export default function App() {
  const [vesselStatus, setVesselStatus] = useState(initialVesselStatus);
  const [compartments, setCompartments] = useState<Compartment[]>(initialCompartments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [matrix] = useState(initialStakeholderMatrix);
  const [cyberMetrics] = useState(initialCyberMetrics);

  const [activeTab, setActiveTab] = useState<string>('login');
  const [selectedCompartmentId, setSelectedCompartmentId] = useState<string | null>('eng-room-lower');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>('notif-101');
  
  const [gloveMode, setGloveMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'manager' | 'engineer'>('manager');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Helper to add audit log entries
  const addAuditLog = (
    action: string, 
    details: string, 
    category: 'auth' | 'simulation' | 'incident' | 'system' | 'role_switch' | 'settings' = 'system'
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toUTCString().slice(17, 25) + ' UTC',
      user: userRole === 'manager' ? 'Capt. E. Sterling' : 'Chief Engineer S. Vance',
      role: userRole,
      action,
      details,
      category,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper for Web Push Notifications
  const triggerPushNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (err) {
        console.warn('Browser push notification error:', err);
      }
    }
  };

  // Switch role with audit logging
  const handleSetUserRole = (role: 'manager' | 'engineer') => {
    setUserRole(role);
    addAuditLog(
      'View Mode Changed',
      `Switched layout to ${role === 'manager' ? 'Executive Managerial' : 'Technical SCADA Engineer'} Mode.`,
      'role_switch'
    );
  };

  // Toggle glove mode with audit logging
  const handleSetGloveMode = (enabled: boolean) => {
    setGloveMode(enabled);
    addAuditLog(
      'Glove Mode Toggle',
      `Rugged Touch Interface set to ${enabled ? 'ENABLED (High-Contrast Large Buttons)' : 'DISABLED'}.`,
      'settings'
    );
  };

  // Derived counts
  const unacknowledgedCount = notifications.filter(n => !n.acknowledged).length;
  const criticalCount = notifications.filter(n => n.severity === 'critical' && !n.acknowledged).length;
  const cyberCount = notifications.filter(n => n.severity === 'cyber' && !n.acknowledged).length;
  const hasCriticalAlert = criticalCount > 0;

  // Acknowledge single notification
  const handleAcknowledgeNotification = (id: string) => {
    const notif = notifications.find(n => n.id === id);
    setNotifications(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              acknowledged: true,
              acknowledgedBy: userRole === 'manager' ? 'Capt. E. Sterling' : 'Chief Engineer S. Vance',
              acknowledgedAt: new Date().toUTCString().slice(17, 25) + ' UTC',
            }
          : item
      )
    );
    addAuditLog(
      'Incident Acknowledged',
      `Officer signed off on incident ${notif?.incidentNo || id}: ${notif?.title || 'Safety Alarm'}.`,
      'incident'
    );
  };

  // Acknowledge all notifications
  const handleAcknowledgeAll = () => {
    setNotifications(prev =>
      prev.map(item => ({
        ...item,
        acknowledged: true,
        acknowledgedBy: userRole === 'manager' ? 'Capt. E. Sterling' : 'Chief Engineer S. Vance',
        acknowledgedAt: new Date().toUTCString().slice(17, 25) + ' UTC',
      }))
    );
    addAuditLog(
      'Bulk Incidents Acknowledged',
      'All active vessel safety alerts and cyber warnings acknowledged.',
      'incident'
    );
  };

  // Simulate Fire Emergency
  const handleSimulateFire = () => {
    setCompartments(prev =>
      prev.map(comp =>
        comp.id === 'eng-room-lower'
          ? {
              ...comp,
              temperature: 88.6,
              smokePpm: 520,
              waterMistStatus: 'Pre-Discharge',
              status: 'critical',
            }
          : comp
      )
    );

    const newNotif: NotificationItem = {
      id: `sim-fire-${Date.now()}`,
      incidentNo: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'critical',
      title: 'SIMULATED: Thermal IR Flashover Alarm (Zone 3)',
      compartmentId: 'eng-room-lower',
      compartmentName: 'Engine Room (Lower Bilge)',
      fireZone: 3,
      timestamp: 'Just Now',
      shortDescription: 'Thermal sensor IR-301 spiked to 88.6°C. High probability of fuel line rupture near Purifier Unit #2.',
      affectedEquipment: ['Purifier Unit #2', 'Main Aux Engine 3', 'Water Mist Valve 3A'],
      responsibleOfficer: userRole === 'manager' ? 'Capt. E. Sterling' : 'Chief Engineer S. Vance',
      acknowledged: false,
      escalationStatus: 'Level 1 Escalate',
      recommendedAction: 'Verify Zone 3 evacuation, verify automated ventilation closure, and confirm Water Mist pre-discharge horn.',
      riskScore: 94,
      aiConfidence: 98.2,
      sopId: 'SOP-FIRE-03A',
      timeline: [
        { time: '00:00:01', event: 'Simulated fire trigger received from test panel', type: 'system' },
        { time: '00:00:02', event: 'Thermal IR sensor S-301 threshold exceeded (88.6°C)', type: 'sensor' },
      ],
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSelectedNotificationId(newNotif.id);
    setVesselStatus(prev => ({ ...prev, activeFireCount: prev.activeFireCount + 1, mode: 'Emergency Fire Mode' }));
    
    addAuditLog(
      'Fire Drill Simulated',
      'Triggered simulated Zone 3 Engine Room Thermal Flashover alarm (88.6°C).',
      'simulation'
    );

    // Trigger Web Push
    triggerPushNotification(
      'CRITICAL FIRE ALARM: ZONE 3 ENGINE ROOM',
      'Thermal IR Sensor S-301 spiked to 88.6°C. High probability of fuel line flashover.'
    );
  };

  // Simulate Cyber Attack
  const handleSimulateCyber = () => {
    setCompartments(prev =>
      prev.map(comp =>
        comp.id === 'cargo-hold-2'
          ? {
              ...comp,
              cyberStatus: 'Anomaly Detected',
              status: 'cyber',
            }
          : comp
      )
    );

    const newNotif: NotificationItem = {
      id: `sim-cyber-${Date.now()}`,
      incidentNo: `CYB-2026-${Math.floor(100 + Math.random() * 900)}`,
      severity: 'cyber',
      title: 'SIMULATED: Modbus Solenoid Spoofing Attempt',
      compartmentId: 'cargo-hold-2',
      compartmentName: 'Cargo Hold No. 2 (Dangerous Goods)',
      fireZone: 2,
      timestamp: 'Just Now',
      shortDescription: 'IDS/IPS dropped 4,200 rogue Modbus frames attempting to force open Solenoid V-202.',
      affectedEquipment: ['Modbus Gateway GW-02', 'PLC Node 4'],
      responsibleOfficer: 'Cybersecurity Officer M. Thorne',
      acknowledged: false,
      escalationStatus: 'Level 1 Escalate',
      recommendedAction: 'Isolate VLAN-40 and switch Modbus Gateway GW-02 to local hardware interlock mode.',
      riskScore: 81,
      aiConfidence: 94.0,
      sopId: 'SOP-CYBER-02',
      timeline: [
        { time: '00:00:01', event: 'Rogue packet flood detected', type: 'cyber' },
      ],
    };

    setNotifications(prev => [newNotif, ...prev]);
    setSelectedNotificationId(newNotif.id);
    setVesselStatus(prev => ({ ...prev, activeCyberCount: prev.activeCyberCount + 1, mode: 'Cyber Containment' }));

    addAuditLog(
      'Cyber Attack Drill Simulated',
      'Triggered simulated Modbus TCP Solenoid override intrusion test.',
      'simulation'
    );

    // Trigger Web Push
    triggerPushNotification(
      'IEC 62443 CYBER INTRUSION DETECTED',
      'Modbus TCP packet flood targeting Water Mist Solenoid V-202 in Cargo Hold 2.'
    );
  };

  // Reset Simulations
  const handleResetSimulations = () => {
    setCompartments(initialCompartments);
    setNotifications(initialNotifications);
    setVesselStatus(initialVesselStatus);
    addAuditLog('Simulations Reset', 'Restored baseline SCADA telemetry and cleared test drills.', 'simulation');
  };

  // Logout handler
  const handleLogout = () => {
    addAuditLog('User Session Terminated', 'User explicitly logged out of the safety control console.', 'auth');
    setIsLoggedIn(false);
    setActiveTab('login');
  };

  // Login handler
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    addAuditLog('User Session Initiated', 'Authenticated successfully via FIDO2 / Biometric verification.', 'auth');
    setActiveTab('dashboard');
  };

  // Get current selected notification object
  const currentSelectedNotification = notifications.find(n => n.id === selectedNotificationId) || notifications[0] || null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Industrial Navbar - Only visible after successful login */}
      {isLoggedIn && (
        <Navbar
          vesselStatus={vesselStatus}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          gloveMode={gloveMode}
          setGloveMode={handleSetGloveMode}
          userRole={userRole}
          setUserRole={handleSetUserRole}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onSimulateFire={handleSimulateFire}
          onSimulateCyber={handleSimulateCyber}
          onResetSimulations={handleResetSimulations}
          hasCriticalAlert={hasCriticalAlert}
        />
      )}

      {/* Main Container Layout */}
      <div className="flex-1 w-full mx-auto flex justify-center items-start transition-all duration-500 ease-in-out">
        {isMobileFrame ? (
          /* Sleek Responsive Handheld Smartphone Device Frame */
          <div className="w-full max-w-[390px] sm:max-w-[420px] mx-auto my-4 bg-slate-50 border-[10px] sm:border-[12px] border-slate-900 rounded-[44px] sm:rounded-[52px] shadow-2xl relative overflow-hidden flex flex-col transition-all duration-500 ease-in-out ring-1 ring-slate-800/30 max-h-[86vh] min-h-[640px]">
            {/* Top Phone Speaker / Camera Notch */}
            <div className="bg-slate-900 pt-2 pb-1.5 px-6 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none z-20">
              <span>09:41</span>
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl flex items-center justify-center gap-2 border-b border-x border-slate-800">
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                <div className="w-6 h-1 rounded-full bg-slate-800" />
              </div>
              <span className="font-bold text-emerald-400">5G ●</span>
            </div>

            {/* Mobile View Header Bar */}
            <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between text-xs border-b border-slate-800 z-10">
              <span className="font-bold text-slate-200 truncate">M/V POSEIDON (Mobile)</span>
              <button
                onClick={() => setIsMobileFrame(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md transition-colors"
              >
                Exit Mobile
              </button>
            </div>

            {/* Scrollable Frame Content Body */}
            <div className="flex-1 overflow-y-auto flex flex-col scrollbar-thin">
              {isLoggedIn && (
                <SidebarNavigation
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  gloveMode={gloveMode}
                  unacknowledgedCount={unacknowledgedCount}
                  criticalCount={criticalCount}
                  cyberCount={cyberCount}
                  isLoggedIn={isLoggedIn}
                />
              )}

              <main className="flex-1 p-3 min-w-0">
                {!isLoggedIn || activeTab === 'login' ? (
                  <LoginScreen
                    onLoginSuccess={handleLoginSuccess}
                    gloveMode={gloveMode}
                  />
                ) : (
                  <>
                    {activeTab === 'dashboard' && (
                      <DashboardView
                        vesselStatus={vesselStatus}
                        compartments={compartments}
                        notifications={notifications}
                        auditLogs={auditLogs}
                        userRole={userRole}
                        setUserRole={handleSetUserRole}
                        onSelectCompartment={(id) => setSelectedCompartmentId(id)}
                        onSelectNotification={(id) => setSelectedNotificationId(id)}
                        onAcknowledgeNotification={handleAcknowledgeNotification}
                        gloveMode={gloveMode}
                        onSimulateFire={handleSimulateFire}
                        onSimulateCyber={handleSimulateCyber}
                        onResetSimulations={handleResetSimulations}
                        setActiveTab={setActiveTab}
                      />
                    )}

                    {activeTab === 'notifications' && (
                      <NotificationsView
                        notifications={notifications}
                        onAcknowledge={handleAcknowledgeNotification}
                        onAcknowledgeAll={handleAcknowledgeAll}
                        onSelectNotification={(id) => setSelectedNotificationId(id)}
                        gloveMode={gloveMode}
                        setActiveTab={setActiveTab}
                        onSendTestPush={() => triggerPushNotification(
                          'TEST MARITIME PUSH ALERT',
                          'SOLAS II-2 Water Mist Line 18.4 Bar Operational & Enclave Synced.'
                        )}
                      />
                    )}

                    {activeTab === 'audit-logs' && (
                      <AuditLogsView
                        auditLogs={auditLogs}
                        userRole={userRole}
                        gloveMode={gloveMode}
                      />
                    )}

                    {activeTab === 'system-backup' && (
                      <SystemBackupView
                        vesselStatus={vesselStatus}
                        gloveMode={gloveMode}
                      />
                    )}

                    {activeTab === 'incident-detail' && (
                      <IncidentDetailView
                        notification={currentSelectedNotification}
                        onAcknowledge={handleAcknowledgeNotification}
                        gloveMode={gloveMode}
                        onBack={() => setActiveTab('notifications')}
                      />
                    )}

                    {activeTab === 'vessel-map' && (
                      <VesselMapView
                        compartments={compartments}
                        selectedCompartmentId={selectedCompartmentId}
                        onSelectCompartment={(id) => setSelectedCompartmentId(id)}
                        gloveMode={gloveMode}
                      />
                    )}

                    {activeTab === 'stakeholder-matrix' && (
                      <StakeholderMatrixView
                        matrix={matrix}
                        gloveMode={gloveMode}
                      />
                    )}

                    {activeTab === 'analytics' && (
                      <AnalyticsView />
                    )}

                    {activeTab === 'cybersecurity' && (
                      <CybersecurityDashboardView
                        cyberMetrics={cyberMetrics}
                        gloveMode={gloveMode}
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsView
                        gloveMode={gloveMode}
                        setGloveMode={handleSetGloveMode}
                      />
                    )}
                  </>
                )}
              </main>
            </div>

            {/* Bottom Smartphone Home Bar */}
            <div className="bg-slate-900 py-2.5 flex justify-center items-center select-none z-20 border-t border-slate-800">
              <div className="w-28 h-1 bg-slate-500 rounded-full" />
            </div>
          </div>
        ) : (
          /* Desktop Full-Width Container */
          <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row transition-all duration-500 ease-in-out">
            {isLoggedIn && (
              <SidebarNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                gloveMode={gloveMode}
                unacknowledgedCount={unacknowledgedCount}
                criticalCount={criticalCount}
                cyberCount={cyberCount}
                isLoggedIn={isLoggedIn}
              />
            )}

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
              {!isLoggedIn || activeTab === 'login' ? (
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  gloveMode={gloveMode}
                />
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    <DashboardView
                      vesselStatus={vesselStatus}
                      compartments={compartments}
                      notifications={notifications}
                      auditLogs={auditLogs}
                      userRole={userRole}
                      setUserRole={handleSetUserRole}
                      onSelectCompartment={(id) => setSelectedCompartmentId(id)}
                      onSelectNotification={(id) => setSelectedNotificationId(id)}
                      onAcknowledgeNotification={handleAcknowledgeNotification}
                      gloveMode={gloveMode}
                      onSimulateFire={handleSimulateFire}
                      onSimulateCyber={handleSimulateCyber}
                      onResetSimulations={handleResetSimulations}
                      setActiveTab={setActiveTab}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <NotificationsView
                      notifications={notifications}
                      onAcknowledge={handleAcknowledgeNotification}
                      onAcknowledgeAll={handleAcknowledgeAll}
                      onSelectNotification={(id) => setSelectedNotificationId(id)}
                      gloveMode={gloveMode}
                      setActiveTab={setActiveTab}
                      onSendTestPush={() => triggerPushNotification(
                        'TEST MARITIME PUSH ALERT',
                        'SOLAS II-2 Water Mist Line 18.4 Bar Operational & Enclave Synced.'
                      )}
                    />
                  )}

                  {activeTab === 'audit-logs' && (
                    <AuditLogsView
                      auditLogs={auditLogs}
                      userRole={userRole}
                      gloveMode={gloveMode}
                    />
                  )}

                  {activeTab === 'system-backup' && (
                    <SystemBackupView
                      vesselStatus={vesselStatus}
                      gloveMode={gloveMode}
                    />
                  )}

                  {activeTab === 'incident-detail' && (
                    <IncidentDetailView
                      notification={currentSelectedNotification}
                      onAcknowledge={handleAcknowledgeNotification}
                      gloveMode={gloveMode}
                      onBack={() => setActiveTab('notifications')}
                    />
                  )}

                  {activeTab === 'vessel-map' && (
                    <VesselMapView
                      compartments={compartments}
                      selectedCompartmentId={selectedCompartmentId}
                      onSelectCompartment={(id) => setSelectedCompartmentId(id)}
                      gloveMode={gloveMode}
                    />
                  )}

                  {activeTab === 'stakeholder-matrix' && (
                    <StakeholderMatrixView
                      matrix={matrix}
                      gloveMode={gloveMode}
                    />
                  )}

                  {activeTab === 'analytics' && (
                    <AnalyticsView />
                  )}

                  {activeTab === 'cybersecurity' && (
                    <CybersecurityDashboardView
                      cyberMetrics={cyberMetrics}
                      gloveMode={gloveMode}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsView
                      gloveMode={gloveMode}
                      setGloveMode={handleSetGloveMode}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Industrial Footer */}
      {isLoggedIn && (
        <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-3.5 px-6 mt-auto shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">M/V POSEIDON VOYAGER</span>
              <span>•</span>
              <span>SCADA v4.2.1-PROD</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">IEC 62443 SL3</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>IACS E27 Compliant</span>
              <span>•</span>
              <span>Encrypted Dual PLC Channel</span>
              <span>•</span>
              <span>Water Mist High-Pressure System</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
