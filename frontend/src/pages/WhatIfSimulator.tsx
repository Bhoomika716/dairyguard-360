import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Play,
  RotateCcw,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { runSimulation, saveSimulationScenario, fetchSavedScenarios } from '../services/api';
import type { SavedScenario } from '../types';

export const WhatIfSimulator: React.FC = () => {
  const [params, setParams] = useState({
    production_volume_change_pct: 20,
    cleaning_frequency_change: 1,
    energy_efficiency_change_pct: 5,
    packaging_recovery_change_pct: 10,
    recycling_rate_change_pct: 15
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSavedScenarios().then(setSavedScenarios).catch(console.error);
  }, []);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await runSimulation(params);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveScenario = async () => {
    try {
      await saveSimulationScenario(params);
      setSaveSuccess(true);
      fetchSavedScenarios().then(setSavedScenarios).catch(console.error);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setParams({
      production_volume_change_pct: 0,
      cleaning_frequency_change: 0,
      energy_efficiency_change_pct: 0,
      packaging_recovery_change_pct: 0,
      recycling_rate_change_pct: 0
    });
    setResult(null);
  };

  const renderDelta = (val: number) => {
    if (val > 0) return <span className="text-emerald-400 font-bold inline-flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +{val}%</span>;
    if (val < 0) return <span className="text-rose-400 font-bold inline-flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> {val}%</span>;
    return <span className="text-slate-400 inline-flex items-center gap-0.5"><Minus className="h-3 w-3" /> 0%</span>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            What-If Sustainability Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Simulate operational parameter changes and predict multi-domain environmental & cost impacts.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
            <span>Reset Scenario</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-6 border border-slate-800">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              "What Happens If...?"
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Scenario Parameter Adjuster</span>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Production Volume</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {params.production_volume_change_pct > 0 ? `+${params.production_volume_change_pct}%` : `${params.production_volume_change_pct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                value={params.production_volume_change_pct}
                onChange={(e) => setParams({ ...params, production_volume_change_pct: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Cleaning Frequency (CIP)</span>
                <span className="font-mono text-sky-400 font-bold">
                  {params.cleaning_frequency_change > 0 ? `+${params.cleaning_frequency_change} cycle/day` : `${params.cleaning_frequency_change} cycle/day`}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="4"
                step="1"
                value={params.cleaning_frequency_change}
                onChange={(e) => setParams({ ...params, cleaning_frequency_change: Number(e.target.value) })}
                className="w-full accent-sky-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Energy Efficiency Gain</span>
                <span className="font-mono text-amber-400 font-bold">
                  {params.energy_efficiency_change_pct > 0 ? `+${params.energy_efficiency_change_pct}%` : `${params.energy_efficiency_change_pct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="30"
                step="5"
                value={params.energy_efficiency_change_pct}
                onChange={(e) => setParams({ ...params, energy_efficiency_change_pct: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Packaging Recovery Target</span>
                <span className="font-mono text-purple-400 font-bold">
                  {params.packaging_recovery_change_pct > 0 ? `+${params.packaging_recovery_change_pct}%` : `${params.packaging_recovery_change_pct}%`}
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="5"
                value={params.packaging_recovery_change_pct}
                onChange={(e) => setParams({ ...params, packaging_recovery_change_pct: Number(e.target.value) })}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Recycling Conversion Rate</span>
                <span className="font-mono text-teal-400 font-bold">
                  {params.recycling_rate_change_pct > 0 ? `+${params.recycling_rate_change_pct}%` : `${params.recycling_rate_change_pct}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={params.recycling_rate_change_pct}
                onChange={(e) => setParams({ ...params, recycling_rate_change_pct: Number(e.target.value) })}
                className="w-full accent-teal-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs py-3.5 rounded-xl shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{loading ? 'RUNNING SCENARIO...' : 'SIMULATE SCENARIO'}</span>
            </button>

            {result && (
              <button
                onClick={handleSaveScenario}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-3.5 rounded-xl text-xs font-semibold transition"
              >
                <Save className="h-4 w-4 text-emerald-400" />
                <span>SAVE SCENARIO</span>
              </button>
            )}
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Scenario saved to comparison history!</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-6 border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Simulated Impact Matrix & Delta
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Current vs Simulated State
              </span>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Energy Demand</span>
                    <div className="text-base font-bold font-mono text-amber-400 mt-1">
                      {result.simulated_metrics.energy_kwh} MWh
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Delta: {renderDelta(result.predicted_energy_kwh_pct)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Packaging Waste</span>
                    <div className="text-base font-bold font-mono text-purple-400 mt-1">
                      {result.simulated_metrics.packaging_waste_kg} kg
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Delta: {renderDelta(result.predicted_waste_qty_pct)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Recovery Rate</span>
                    <div className="text-base font-bold font-mono text-emerald-400 mt-1">
                      {result.simulated_metrics.recovery_rate_pct}%
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Delta: {renderDelta(result.predicted_recovery_rate_pct)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Hygiene Risk</span>
                    <div className="text-base font-bold font-mono text-sky-400 mt-1">
                      {result.simulated_metrics.hygiene_risk_score}/100
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Delta: {renderDelta(result.predicted_hygiene_risk_pct)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Carbon Impact</span>
                    <div className="text-base font-bold font-mono text-teal-400 mt-1">
                      {result.simulated_metrics.carbon_co2e_tonnes} t CO2e
                    </div>
                    <div className="text-[11px] font-mono mt-0.5">
                      Delta: {renderDelta(result.predicted_carbon_impact_pct)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 bg-emerald-950/20">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Sustainability Score</span>
                    <div className="text-base font-black font-mono text-white mt-1">
                      {result.simulated_metrics.sustainability_score} / 100
                    </div>
                    <div className="text-[11px] font-mono font-bold mt-0.5">
                      Score Shift: {renderDelta(result.predicted_sustainability_score_change)}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Scenario Interpretation</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{result.ai_explanation}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-3 text-slate-500">
                <Sliders className="h-10 w-10 mx-auto text-slate-600" />
                <p className="text-xs font-mono">Adjust the sliders on the left and click "Simulate Scenario".</p>
              </div>
            )}
          </div>

          {/* Saved Scenarios History comparison table */}
          {savedScenarios.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Saved Comparison Scenarios ({savedScenarios.length})
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {savedScenarios.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-200">{s.name}</span>
                      <span className="text-slate-500 text-[10px] ml-2">({s.created_at})</span>
                    </div>
                    <span className={`font-mono font-bold ${s.score_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      Score Shift: {s.score_change >= 0 ? `+${s.score_change}` : s.score_change} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
