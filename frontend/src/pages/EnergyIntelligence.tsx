import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  Cpu, 
  BarChart3, 
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

interface EnergyIntelligenceProps {
  data: any;
}

export const EnergyIntelligence: React.FC<EnergyIntelligenceProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'weekly'>('daily');

  if (!data) {
    return <div className="p-12 text-center text-slate-400 font-mono">Loading Energy Intelligence...</div>;
  }

  const readings = data.readings || [];
  const machineBreakdown = data.machine_breakdown || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Energy Intelligence Command
          </h2>
          <p className="text-xs text-slate-400">
            Machine-level power telemetry, peak load analysis, and ML anomaly detection.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['hourly', 'daily', 'weekly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-medium font-mono capitalize transition ${
                timeframe === tf
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-amber-500/30">
          <span className="text-xs font-mono uppercase text-slate-400">Current Energy Intensity</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {data.current_efficiency_kwh_l} <span className="text-sm text-slate-400">kWh/L</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Target: <strong className="text-slate-200">{data.target_efficiency_kwh_l} kWh/L</strong></span>
            <span className="text-amber-400 font-bold">({data.efficiency_deviation_pct > 0 ? `+${data.efficiency_deviation_pct}%` : `${data.efficiency_deviation_pct}%`})</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Peak Load Analysis</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            145.0 <span className="text-sm text-slate-400">kW</span>
          </div>
          <p className="text-xs text-slate-400">Peak hours: 14:00 - 16:00 | Power Factor: 0.95</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Refrigeration Load Share</span>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">
            45.2% <span className="text-sm text-slate-400">of Total MWh</span>
          </div>
          <p className="text-xs text-slate-400">Chiller Array A running at continuous max thermal load.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-amber-400" />
            Energy Consumption Trend & Anomaly Events
          </h3>
          <span className="text-xs text-slate-400 font-mono">Total kWh / Hour</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readings}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="timestamp" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#F59E0B' }}
              />
              <Area type="monotone" dataKey="total_kwh" stroke="#F59E0B" strokeWidth={2.5} fill="url(#energyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-sky-400" />
            Machine Power Rating & Load Share
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={machineBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10 }} interval={0} />
                <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="power_kw" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
                ML Anomaly Detection Log
              </h3>
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                IsolationForest ML
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Energy Anomaly Detected
                </span>
                <span className="text-[10px] font-mono text-slate-400">Confidence: 94%</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p>Observed: <strong className="text-white">11.8 kWh</strong> | Expected: <strong className="text-emerald-400">8.2 kWh</strong></p>
                <p>Deviation: <span className="text-rose-400 font-bold">+43.9%</span></p>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                Contributing Factors: Refrigeration load overload combined with CIP wash cycle overlap during peak shift.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>AI recommends staggering CIP washes outside peak tariff window.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
