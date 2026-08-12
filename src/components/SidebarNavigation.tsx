import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  Map, 
  BrainCircuit, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Settings, 
  LockKeyhole,
  HardDrive,
  FileText,
  Menu,
  X,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gloveMode: boolean;
  unacknowledgedCount: number;
  criticalCount: number;
  cyberCount: number;
  isLoggedIn: boolean;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  setActiveTab,
  gloveMode,
  unacknowledgedCount,
  criticalCount,
  cyberCount,
  isLoggedIn,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Incidents & Alerts',
      icon: Bell,
      badge: unacknowledgedCount > 0 ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          criticalCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-white'
        }`}>
          {unacknowledgedCount}
        </span>
      ) : null,
    },
    {
      id: 'incident-detail',
      label: 'Decision Support',
      icon: BrainCircuit,
      badge: criticalCount > 0 ? (
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
      ) : null,
    },
    {
      id: 'vessel-map',
      label: 'Vessel Deck Map',
      icon: Map,
      badge: null,
    },
    {
      id: 'audit-logs',
      label: 'Audit & Activity Logs',
      icon: FileText,
      badge: null,
    },
    {
      id: 'system-backup',
      label: 'Firmware & Backup',
      icon: HardDrive,
      badge: null,
    },
    {
      id: 'stakeholder-matrix',
      label: 'Stakeholders',
      icon: Users,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'cybersecurity',
      label: 'Cyber Shield',
      icon: ShieldCheck,
      badge: cyberCount > 0 ? (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
          {cyberCount}
        </span>
      ) : null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
    {
      id: 'login',
      label: isLoggedIn ? 'Auth System' : 'Login',
      icon: LockKeyhole,
      badge: null,
    },
  ];

  // Primary mobile tabs for bottom bar
  const mobilePrimaryTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { 
      id: 'notifications', 
      label: 'Alerts', 
      icon: Bell,
      count: unacknowledgedCount
    },
    { id: 'vessel-map', label: 'Deck Map', icon: Map },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
    { id: 'more', label: isMobileMenuOpen ? 'Close' : 'Menu', icon: isMobileMenuOpen ? X : Menu },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'more') {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      if (!isLoggedIn && id !== 'login') {
        setActiveTab('login');
      } else {
        setActiveTab(id);
      }
      setIsMobileMenuOpen(false); // Collapses mobile menu drawer automatically
    }
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <nav className="hidden md:flex bg-white border-r border-slate-200 w-64 lg:w-72 flex-shrink-0 flex-col justify-between select-none py-4 px-3">
        <div className="space-y-1">
          <div className="px-3 pb-3 mb-2 border-b border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Safety Control Panel
            </div>
            <div className="text-xs text-slate-700 font-mono mt-0.5">
              IEC 62443 SL3 Standard
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full text-left rounded-xl transition-all ${
                  gloveMode ? 'py-3.5 px-4 text-base' : 'py-2.5 px-3.5 text-sm'
                } ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`${gloveMode ? 'w-5 h-5' : 'w-4 h-4'} ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                <div>{item.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer status */}
        <div className="pt-3 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
            <div className="flex items-center justify-between text-slate-700 font-bold mb-1">
              <span>SUPPRESSION LINE</span>
              <span className="text-slate-900 font-mono">100 BAR</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
              <div className="bg-slate-800 h-full rounded-full w-[98.5%]" />
            </div>
            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>Tank: 98.5%</span>
              <span className="text-emerald-700 font-bold">READY</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Collapsible Navigation Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="md:hidden fixed inset-x-0 bottom-16 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-4 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                All Navigation Sections
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
        {mobilePrimaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`absolute -top-1.5 -right-2 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    criticalCount > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
