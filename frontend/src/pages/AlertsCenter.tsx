import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon,
  Filter,
  CheckCircle
} from 'lucide-react';
import { fetchAlerts, acknowledgeAlert, resolveAlert } from '../services/api';
import type { AlertItem } from '../types';

interface AlertsCenterProps {
  onTriggerIncident: (scenario?: string) => void;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ onTriggerIncident }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadAlerts = () => {
    fetchAlerts()
      .then(setAlerts)
      .catch(console.error);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (id: number) => {
    try {
      await acknowledgeAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await resolveAlert(id);
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['ALL', 'Energy', 'Hygiene', 'Equipment', 'Packaging', 'Sustainability', 'System'];
  const statuses = ['ALL', 'CRITICAL', 'WARNING', 'INFO', 'RESOLVED'];

  const filteredAlerts = alerts.filter(al => {
    const matchCat = categoryFilter === 'ALL' || al.category.toLowerCase() === categoryFilter.toLowerCase();
    let matchSev = true;
    if (statusFilter === 'CRITICAL') matchSev = al.severity === 'CRITICAL';
    else if (statusFilter === 'WARNING') matchSev = (al.severity as string) === 'HIGH' || (al.severity as string) === 'MEDIUM' || (al.severity as string) === 'WARNING';
    else if (statusFilter === 'INFO') matchSev = al.severity === 'LOW' || al.severity === 'INFO';
    else if (statusFilter === 'RESOLVED') matchSev = al.status === 'RESOLVED';
    return matchCat && matchSev;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'HIGH':
      case 'WARNING': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            Smart Alert & Incident Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time cross-domain alert management generated from live plant simulation telemetry.
          </p>
        </div>

        <button
          onClick={() => onTriggerIncident('general')}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-950/40 border border-rose-400/40 transition"
        >
          <AlertOctagon className="h-4 w-4 animate-pulse" />
          <span>RUN PLANT INCIDENT</span>
        </button>
      </div>

      {/* Category & Status Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-500 mr-1 shrink-0" />
          <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 md:pt-0 border-t md:border-t-0 border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase font-mono mr-1">Filter:</span>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-mono font-medium transition ${
                statusFilter === st
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert Title & Description</th>
                <th className="py-3 px-4">Affected Area / Equipment</th>
                <th className="py-3 px-4">Recommended Action</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No active alerts matching filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((al) => (
                  <tr key={al.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{al.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getSeverityBadge(al.severity)}`}>
                        {al.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-100">{al.title}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{al.message}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
                        {al.affected_target || 'Plant Wide'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs text-[11px] leading-tight">
                      {al.recommended_action ? (
                        <span className="text-emerald-400">{al.recommended_action}</span>
                      ) : (
                        <span className="text-slate-500 font-mono">Inspect logs</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        al.status === 'NEW' || al.status === 'OPEN' ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30' :
                        al.status === 'ACKNOWLEDGED' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' :
                        'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                      }`}>
                        {al.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {(al.status === 'NEW' || al.status === 'OPEN') && (
                        <button
                          onClick={() => handleAcknowledge(al.id)}
                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold transition"
                        >
                          Acknowledge
                        </button>
                      )}
                      {al.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleResolve(al.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition"
                        >
                          Resolve
                        </button>
                      )}
                      {al.status === 'RESOLVED' && (
                        <span className="text-slate-500 text-[10px] font-mono flex items-center justify-end">
                          <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
