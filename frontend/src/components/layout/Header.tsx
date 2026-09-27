import React from 'react';
import { 
  Bell, 
  User, 
  Building2, 
  Clock, 
  Sparkles,
  Zap
} from 'lucide-react';
import type { RoleType } from '../../types';

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onOpenAIChat: () => void;
  unreadAlertsCount: number;
  lastUpdated: string;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenAIChat,
  unreadAlertsCount,
  lastUpdated,
  isLive
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800/80 px-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="h-full w-full bg-[#07111F] rounded-[10px] flex items-center justify-center">
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              DAIRYGUARD 360
            </h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">
              Smart Command Center
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <Building2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-medium text-slate-200">Alpha Plant - Sector 4</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">PLANT-IND-01</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center space-x-4 bg-slate-900/50 border border-slate-800/60 rounded-full px-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            LIVE SYSTEM OPERATIONAL
          </span>
        </div>
        <div className="text-slate-600 text-xs">•</div>
        <div className="flex items-center space-x-1 text-slate-400 text-xs font-mono">
          <Clock className="h-3 w-3 text-slate-500" />
          <span>{lastUpdated || '22:57 UTC'}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="relative">
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as RoleType)}
            className="bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
          >
            <option value="Plant Manager">👔 Plant Manager</option>
            <option value="Sustainability Manager">🌱 Sustainability Manager</option>
            <option value="Quality Manager">🧼 Quality Manager</option>
            <option value="Maintenance Manager">🔧 Maintenance Manager</option>
            <option value="Consumer">♻️ Consumer Portal</option>
          </select>
        </div>

        <button
          onClick={onOpenAIChat}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 hover:to-teal-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-md shadow-emerald-900/30 transition-all font-medium border border-emerald-400/30"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-200" />
          <span className="hidden sm:inline">AI Advisor</span>
        </button>

        <button className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition">
          <Bell className="h-4 w-4" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono" title="Demo Authentication Active">
            DEMO AUTH
          </span>
        </div>
      </div>
    </header>
  );
};
