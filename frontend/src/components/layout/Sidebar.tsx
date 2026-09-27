import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  ShieldCheck, 
  Recycle, 
  Activity, 
  BrainCircuit, 
  Sliders, 
  AlertTriangle, 
  FileSpreadsheet, 
  ShoppingBag, 
  Settings,
  Globe
} from 'lucide-react';
import type { RoleType } from '../../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  unreadAlertsCount: number;
  currentRole: RoleType;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
  currentRole
}) => {
  const navItems = [
    { id: 'landing', label: 'Landing Overview', icon: Globe },
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, roleHighlight: ['Plant Manager'] },
    { id: 'equipment', label: 'Equipment Health Center', icon: Activity, color: 'text-emerald-400', badge: '6 Major', roleHighlight: ['Maintenance Manager'] },
    { id: 'digital-twin', label: 'Digital Twin', icon: Activity, badge: 'Live Pipeline' },
    { id: 'energy', label: 'Energy Intelligence', icon: Zap, color: 'text-amber-400', roleHighlight: ['Sustainability Manager'] },
    { id: 'hygiene', label: 'Hygiene & Compliance', icon: ShieldCheck, color: 'text-sky-400', roleHighlight: ['Quality Manager'] },
    { id: 'waste', label: 'Circular Packaging Waste', icon: Recycle, color: 'text-purple-400', roleHighlight: ['Sustainability Manager'] },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders, badge: 'Simulated' },
    { id: 'insights', label: 'AI Plant Advisor', icon: BrainCircuit, badge: 'AI Insight' },
    { id: 'alerts', label: 'Smart Alert Center', icon: AlertTriangle, count: unreadAlertsCount },
    { id: 'consumer', label: 'Consumer Rewards', icon: ShoppingBag, roleHighlight: ['Consumer'] },
    { id: 'reports', label: 'Analytics & Reports', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#07111F] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Command Modules
          </p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isHighlightedRole = item.roleHighlight && item.roleHighlight.includes(currentRole);

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/30'
                  : isHighlightedRole
                  ? 'bg-slate-900/90 border border-slate-700/60 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : item.color || 'text-slate-400'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.count !== undefined && item.count > 0 && (
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}

              {item.badge && !item.count && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 m-3 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-slate-800 rounded-xl">
        <div className="flex items-center space-x-2 text-emerald-400 font-medium text-xs mb-1">
          <Recycle className="h-3.5 w-3.5 animate-spin-slow" />
          <span>Circular Plant Index</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Monitoring 3 Domains: Energy, Hygiene & Packaging Waste.
        </p>
      </div>
    </aside>
  );
};
