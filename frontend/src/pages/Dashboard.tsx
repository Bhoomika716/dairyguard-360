import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowRight,
  Gauge,
  Clock,
  Zap,
  Recycle,
  AlertTriangle,
  HeartPulse,
  Lightbulb,
  X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { DashboardOverview, KPICardData, RiskItem, OpportunityItem } from '../types';
import { fetchRisksAndOpportunities } from '../services/api';

interface DashboardProps {
  data: DashboardOverview | null;
  onNavigate: (tabId: string) => void;
  onOpenAIChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onNavigate, onOpenAIChat }) => {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<RiskItem | null>(null);

  useEffect(() => {
    fetchRisksAndOpportunities()
      .then((res) => {
        setRisks(res.top_risks);
        setOpportunities(res.top_opportunities);
      })
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Loading Command Center Telemetry...
      </div>
    );
  }

  const kpiList = Object.entries(data.kpis);
  const health = data.plant_health || {
    overall_health: 89,
    energy_health: 82,
    hygiene_health: 94.8,
    production_health: 88,
    waste_health: 78.2,
    alert_health: 85
  };

  const getKpiColor = (title: string) => {
    if (title.includes('Energy')) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', fill: '#F59E0B' };
    if (title.includes('Hygiene')) return { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', fill: '#38BDF8' };
    if (title.includes('Packaging')) return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', fill: '#A78BFA' };
    if (title.includes('Carbon')) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', fill: '#22C55E' };
    return { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30', fill: '#14B8A6' };
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Daily Plant Intelligence Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0F172A] via-[#0B1220] to-[#07111F] relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span className="font-bold tracking-wider uppercase">DAILY PLANT INTELLIGENCE</span>
            </div>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              "{data.ai_summary}"
            </p>
          </div>

          <button
            onClick={onOpenAIChat}
            className="shrink-0 flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition"
          >
            <span>View AI Analysis</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* PLANT HEALTH & SUSTAINABILITY OVERVIEW BAR */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-3">
            <HeartPulse className="h-5 w-5 text-rose-400 animate-pulse" />
            <h3 className="font-bold text-sm text-slate-100 uppercase font-mono tracking-wider">
              Composite Operational Plant Health Index
            </h3>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="text-slate-400">Plant Health:</span>
            <span className="text-xl font-black text-rose-400">{health.overall_health}/100</span>
          </div>
        </div>

        {/* 5 Contributing Health Factors */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Energy Health</span>
            <div className="text-base font-bold font-mono text-amber-400">{health.energy_health}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Hygiene Health</span>
            <div className="text-base font-bold font-mono text-sky-400">{health.hygiene_health}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Production Health</span>
            <div className="text-base font-bold font-mono text-emerald-400">{health.production_health}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Waste Health</span>
            <div className="text-base font-bold font-mono text-purple-400">{health.waste_health}%</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Alert Stability</span>
            <div className="text-base font-bold font-mono text-teal-400">{health.alert_health}%</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiList.map(([key, kpi]: [string, KPICardData]) => {
          const colors = getKpiColor(kpi.title);
          const isPositive = kpi.change_pct >= 0;
          const chartData = kpi.trend.map((val, idx) => ({ step: idx, val }));

          return (
            <div
              key={key}
              className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-400 tracking-wide uppercase font-mono">
                    {kpi.title}
                  </span>
                  <div className="text-2xl font-extrabold text-white mt-1 font-mono tracking-tight">
                    {kpi.value}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${colors.bg} ${colors.text} ${colors.border} border`}>
                  {kpi.status}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs">
                    {isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {kpi.change_pct > 0 ? `+${kpi.change_pct}%` : `${kpi.change_pct}%`}
                    </span>
                    <span className="text-slate-500 text-[11px]">vs prev ({kpi.previous_value})</span>
                  </div>
                </div>

                <div className="w-24 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.fill} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={colors.fill}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#grad-${key})`}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOP 3 RISKS & TOP 3 OPPORTUNITIES */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 3 Risks */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              TOP 3 CURRENT RISKS
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Click risk for action</span>
          </div>

          <div className="space-y-3">
            {risks.map((risk) => (
              <button
                key={risk.id}
                onClick={() => setSelectedRisk(risk)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 group-hover:text-rose-300 transition">
                    0{risk.id}. {risk.title}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    risk.severity === 'CRITICAL' || risk.severity === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{risk.impact}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Opportunities */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              TOP 3 IMPROVEMENT OPPORTUNITIES
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Simulated Estimates</span>
          </div>

          <div className="space-y-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">0{opp.id}. {opp.title}</span>
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">
                    {opp.potential_saving}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{opp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Lines Status & Domain Shortcuts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Live Plant Operational Status
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              6 Monitored Plant Lines
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">Production / Machine Line</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Thermal / Power Load</th>
                  <th className="py-2.5 px-3 text-right">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.line_statuses.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {line.name}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono">
                      {line.zone}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">
                      {line.load}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        line.status === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        line.status === 'HIGH LOAD' || line.status === 'ATTENTION' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          line.status === 'NORMAL' ? 'bg-emerald-400' :
                          line.status === 'HIGH LOAD' || line.status === 'ATTENTION' ? 'bg-amber-400' :
                          'bg-rose-400 animate-ping'
                        }`} />
                        {line.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-cyan-400" />
              Command Shortcuts
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('digital-twin')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span>Open Plant Digital Twin</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => onNavigate('simulator')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Launch What-If Simulator</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition" />
              </button>

              <button
                onClick={() => onNavigate('consumer')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition group"
              >
                <div className="flex items-center space-x-2.5">
                  <Recycle className="h-4 w-4 text-purple-400" />
                  <span>Consumer Package Return</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition" />
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Simulation Engine running at 1-sec sync interval.</span>
          </div>
        </div>
      </div>

      {/* RISK DETAIL MODAL */}
      {selectedRisk && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-mono">{selectedRisk.title}</h3>
              <button onClick={() => setSelectedRisk(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Severity:</span>
                <span className="ml-2 font-bold text-rose-400 font-mono">{selectedRisk.severity}</span>
              </div>
              <div>
                <span className="text-slate-400">Domain:</span>
                <span className="ml-2 font-bold text-slate-200 font-mono">{selectedRisk.domain}</span>
              </div>
              <div>
                <span className="text-slate-400">Observed Impact:</span>
                <p className="mt-1 font-semibold text-slate-200 bg-slate-950 p-2.5 rounded-xl border border-slate-800">{selectedRisk.impact}</p>
              </div>
              <div>
                <span className="text-slate-400">Recommended Action:</span>
                <p className="mt-1 font-semibold text-emerald-400 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30">{selectedRisk.recommended_action}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRisk(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs"
            >
              Close Risk Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
