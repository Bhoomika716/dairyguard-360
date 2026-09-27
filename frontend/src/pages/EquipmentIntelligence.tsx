import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Wrench, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import type { EquipmentItem } from '../types';
import { fetchEquipmentIntelligence } from '../services/api';

interface EquipmentIntelligenceProps {
  data?: EquipmentItem[];
}

export const EquipmentIntelligence: React.FC<EquipmentIntelligenceProps> = ({ data: initialData }) => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [selectedMachine, setSelectedMachine] = useState<EquipmentItem | null>(null);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const items = await fetchEquipmentIntelligence();
      setEquipmentList(items);
      if (items.length > 0 && !selectedMachine) {
        setSelectedMachine(items[0]);
      }
    } catch (err) {
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const totalKw = equipmentList.reduce((acc, eq) => acc + (eq.current_kw || 0), 0);
  const avgHealth = equipmentList.length > 0 
    ? Math.round(equipmentList.reduce((acc, eq) => acc + (eq.health_score || 0), 0) / equipmentList.length)
    : 92;
  const activeAnomalies = equipmentList.filter(eq => eq.anomaly_status === 'ANOMALY' || eq.deviation_pct > 20).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Equipment Health Center</h2>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
              LIVE SIMULATED DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time thermal, power draw & equipment stability monitoring for 6 core plant machines.
          </p>
        </div>

        <button
          onClick={loadEquipment}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Top Equipment KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Avg Equipment Health</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{avgHealth}%</span>
            <span className="text-xs text-emerald-400 font-mono">Stable</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Formula: Power Stability + Anomaly History</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Total Power Draw</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{totalKw.toFixed(1)} kW</span>
            <span className="text-xs text-slate-400 font-mono">Current load</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Sum of 6 major equipment lines</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Active Anomalies</span>
            <AlertTriangle className={`h-4 w-4 ${activeAnomalies > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{activeAnomalies}</span>
            <span className="text-xs text-slate-400 font-mono">Deviations</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Load threshold breach &gt; 20%</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Simulated Intelligence</span>
            <Info className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-sm font-semibold text-sky-300">Continuous AI Audit</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Dynamic machine health calculation</p>
        </div>
      </div>

      {/* Equipment Comparison View Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
            <span>Machine Fleet Operating Matrix</span>
            <span className="text-xs font-normal text-slate-400 font-mono">(6 Key Equipment)</span>
          </h3>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            UPDATED LIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Equipment</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Current kW</th>
                <th className="px-4 py-3">Normal kW</th>
                <th className="px-4 py-3">Deviation</th>
                <th className="px-4 py-3">Health Score</th>
                <th className="px-4 py-3">Operating State</th>
                <th className="px-4 py-3">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {equipmentList.map((eq) => {
                const isHighDev = eq.deviation_pct > 20;
                const isSelected = selectedMachine?.id === eq.id;

                return (
                  <tr 
                    key={eq.id} 
                    onClick={() => setSelectedMachine(eq)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-emerald-950/30 text-white font-medium' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-100 flex items-center space-x-2">
                      <span className={`h-2 w-2 rounded-full ${isHighDev ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                      <span>{eq.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({eq.code})</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{eq.zone}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">{eq.current_kw.toFixed(1)} kW</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{eq.normal_kw.toFixed(1)} kW</td>
                    <td className="px-4 py-3 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        eq.deviation_pct > 20 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : eq.deviation_pct > 5 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {eq.deviation_pct > 0 ? `+${eq.deviation_pct}%` : `${eq.deviation_pct}%`}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${eq.health_score > 85 ? 'bg-emerald-500' : eq.health_score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${eq.health_score}%` }}
                          ></div>
                        </div>
                        <span>{Math.round(eq.health_score)}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${
                        eq.operating_state === 'HIGH LOAD' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {eq.operating_state}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-xs">{eq.recommended_action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {equipmentList.map((eq) => (
          <div 
            key={eq.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">{eq.code} • {eq.zone}</span>
                <h4 className="text-base font-bold text-white mt-0.5">{eq.name}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                eq.status === 'ATTENTION' || eq.deviation_pct > 20
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {eq.operating_state}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-xl text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Current</span>
                <span className="text-sm font-bold text-white">{eq.current_kw} kW</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Normal</span>
                <span className="text-sm font-bold text-slate-400">{eq.normal_kw} kW</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Temp</span>
                <span className="text-sm font-bold text-cyan-300">{eq.temperature_c ? `${eq.temperature_c}°C` : 'N/A'}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Equipment Health</span>
                <span className="text-emerald-400 font-bold">{Math.round(eq.health_score)}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${eq.health_score > 85 ? 'bg-emerald-500' : eq.health_score > 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${eq.health_score}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl text-xs space-y-1">
              <div className="flex items-center text-slate-400 text-[11px]">
                <Wrench className="h-3 w-3 text-amber-400 mr-1.5 shrink-0" />
                <span>Last Maint: <span className="text-slate-200 font-mono">{eq.last_maintenance}</span></span>
              </div>
              <p className="text-slate-300 text-[11px] leading-tight pt-1">
                <span className="text-emerald-400 font-medium">Rec: </span>{eq.recommended_action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
