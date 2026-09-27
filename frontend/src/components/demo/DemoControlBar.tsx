import React, { useState } from 'react';
import { Play, Pause, AlertOctagon, RefreshCw, RotateCcw, Zap, ShieldAlert, PackageX } from 'lucide-react';

interface DemoControlBarProps {
  isDemoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onTriggerIncident: (scenario?: string) => void;
  onResetPlant?: () => void;
  onSimulateTick: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onTriggerIncident,
  onResetPlant,
  onSimulateTick
}) => {
  const [loading, setLoading] = useState(false);

  const handleIncident = async (scenario: string = 'general') => {
    setLoading(true);
    await onTriggerIncident(scenario);
    setLoading(false);
  };

  const handleReset = async () => {
    if (onResetPlant) {
      setLoading(true);
      await onResetPlant();
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs select-none shadow-inner">
      <div className="flex items-center space-x-3">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider">
          HACKATHON DEMO CONTROL
        </span>
        <span className="text-slate-300 hidden xl:inline">
          Accelerated real-time operational simulation & incident engine
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        <button
          onClick={() => onToggleDemoMode(!isDemoMode)}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition ${
            isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isDemoMode ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
          <span>{isDemoMode ? 'PAUSE TICKS' : 'AUTO TICKS'}</span>
        </button>

        <button
          onClick={onSimulateTick}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1 rounded-lg"
          title="Force simulated data tick"
        >
          <RefreshCw className="h-3 w-3 text-cyan-400" />
          <span className="hidden sm:inline">Tick</span>
        </button>

        <div className="h-4 w-px bg-slate-800 hidden md:block"></div>

        <button
          onClick={() => handleIncident('energy_spike')}
          disabled={loading}
          className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-medium transition"
          title="Simulate Chiller Unit B energy overload"
        >
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          <span>Energy Spike</span>
        </button>

        <button
          onClick={() => handleIncident('hygiene_failure')}
          disabled={loading}
          className="flex items-center space-x-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 px-2.5 py-1 rounded-lg font-medium transition"
          title="Simulate Packaging Floor sanitation breach"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-sky-400" />
          <span>Hygiene Breach</span>
        </button>

        <button
          onClick={() => handleIncident('packaging_surge')}
          disabled={loading}
          className="flex items-center space-x-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded-lg font-medium transition"
          title="Simulate Packaging collection hub bottleneck"
        >
          <PackageX className="h-3.5 w-3.5 text-purple-400" />
          <span>Waste Surge</span>
        </button>

        <button
          onClick={() => handleIncident('general')}
          disabled={loading}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold px-3 py-1 rounded-lg shadow-lg shadow-rose-950/40 border border-rose-400/40 transition active:scale-95"
        >
          <AlertOctagon className="h-3.5 w-3.5 text-white animate-pulse" />
          <span>RUN PLANT INCIDENT</span>
        </button>

        {onResetPlant && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center space-x-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-lg font-semibold transition active:scale-95"
            title="Restore plant to healthy baseline"
          >
            <RotateCcw className="h-3.5 w-3.5 text-emerald-400" />
            <span>Reset Plant</span>
          </button>
        )}
      </div>
    </div>
  );
};
