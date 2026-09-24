import React from 'react';
import { Settings, Building2, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-400" />
          Plant Command Settings & System Parameters
        </h2>
        <p className="text-xs text-slate-400">
          Configure real-time simulation engine sync rate, LLM API keys, and facility parameters.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-800">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            Facility Profile
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Plant Name</label>
            <input type="text" readOnly value="Alpha Dairy Plant - Sector 4" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Plant Code</label>
            <input type="text" readOnly value="PLANT-IND-01" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-emerald-400" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Daily Capacity</label>
            <input type="text" readOnly value="50,000 Litres / Day" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Location</label>
            <input type="text" readOnly value="Bengaluru Industrial Hub" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-6 border border-slate-800">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            AI & Simulation Engine Configuration
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">NVIDIA Nemotron / LLM Provider Key (Optional)</label>
            <input type="password" placeholder="nvapi-..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200" />
            <p className="text-[10px] text-slate-500 mt-1">Leave empty to use built-in analytical NLP fallback engine anchored to database telemetry.</p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Telemetry Tick Interval</label>
            <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200">
              <option value="1">1 Second (Live Real-Time Sync)</option>
              <option value="5">5 Seconds</option>
              <option value="30">30 Seconds</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
