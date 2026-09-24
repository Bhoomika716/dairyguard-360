import React, { useState } from 'react';
import { Play, Pause, AlertOctagon, RefreshCw } from 'lucide-react';

interface DemoControlBarProps {
  isDemoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onTriggerIncident: () => void;
  onSimulateTick: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  isDemoMode,
  onToggleDemoMode,
  onTriggerIncident,
  onSimulateTick
}) => {
  const [loading, setLoading] = useState(false);

  const handleIncident = async () => {
    setLoading(true);
    await onTriggerIncident();
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none shadow-inner">
      <div className="flex items-center space-x-3">
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold tracking-wider">
          Demo Accelerator
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Accelerated real-time simulated telemetry engine
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggleDemoMode(!isDemoMode)}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium transition ${
            isDemoMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          {isDemoMode ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
          <span>{isDemoMode ? 'PAUSE DEMO MODE' : 'DEMO MODE'}</span>
        </button>

        <button
          onClick={onSimulateTick}
          className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded-lg"
          title="Force simulated data tick"
        >
          <RefreshCw className="h-3 w-3 text-cyan-400" />
          <span className="hidden md:inline">Tick Engine</span>
        </button>

        <button
          onClick={handleIncident}
          disabled={loading}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold px-3.5 py-1 rounded-lg shadow-lg shadow-rose-950/40 border border-rose-400/40 transition active:scale-95"
        >
          <AlertOctagon className="h-3.5 w-3.5 text-white animate-pulse" />
          <span>RUN PLANT INCIDENT</span>
        </button>
      </div>
    </div>
  );
};
