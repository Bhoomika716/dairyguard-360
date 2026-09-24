import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon,
  Filter
} from 'lucide-react';
import { fetchAlerts, postAlertAction } from '../services/api';
import type { AlertItem } from '../types';

interface AlertsCenterProps {
  onTriggerIncident: () => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ onTriggerIncident }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const loadAlerts = () => {
    fetchAlerts(severityFilter === 'ALL' ? undefined : severityFilter)
      .then(setAlerts)
      .catch(console.error);
  };

  useEffect(() => {
    loadAlerts();
  }, [severityFilter]);

  const handleAction = async (id: number, action: string, assignedTo?: string) => {
    try {
      await postAlertAction(id, action, assignedTo);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'HIGH': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            Intelligent Alert & Incident Command
          </h2>
          <p className="text-xs text-slate-400">
            Real-time cross-domain alert center for Energy, Hygiene, Packaging Waste, and Sustainability.
          </p>
        </div>

        <button
          onClick={onTriggerIncident}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-950/40 border border-rose-400/40 transition"
        >
          <AlertOctagon className="h-4 w-4 animate-pulse" />
          <span>RUN PLANT INCIDENT</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
        <Filter className="h-3.5 w-3.5 text-slate-500 ml-2" />
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 rounded-lg font-medium transition uppercase ${
              severityFilter === sev
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Alert Title & Description</th>
                <th className="py-2.5 px-3">Observed vs Expected</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {alerts.map((al) => (
                <tr key={al.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3.5 px-3 font-mono text-slate-300 font-semibold">{al.category}</td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(al.severity)}`}>
                      {al.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 max-w-sm">
                    <div className="font-bold text-slate-100">{al.title}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{al.message}</p>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    {al.observed_value && (
                      <div className="text-[11px]">
                        <div>Obs: <strong className="text-white">{al.observed_value}</strong></div>
                        <div className="text-slate-400">Exp: {al.expected_value} ({al.deviation})</div>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      al.status === 'OPEN' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' :
                      al.status === 'ACKNOWLEDGED' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' :
                      'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                    }`}>
                      {al.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-1">
                    {al.status === 'OPEN' && (
                      <button
                        onClick={() => handleAction(al.id, 'ACKNOWLEDGE')}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-mono"
                      >
                        Acknowledge
                      </button>
                    )}
                    {al.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleAction(al.id, 'RESOLVE')}
                        className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
