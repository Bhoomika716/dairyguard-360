import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Recycle, 
  Activity, 
  BrainCircuit, 
  Sliders, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  return (
    <div className="space-y-16 pb-12">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#07111F] to-[#0B1220] border border-slate-800 p-8 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full">
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300 font-mono tracking-wider uppercase">
              Next-Gen Dairy Plant Intelligence
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            One Plant. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              One Intelligence Layer.
            </span> <br />
            Complete Dairy Sustainability.
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            Monitor energy consumption, enforce hygiene compliance, track circular packaging recovery, and simulate what-if scenarios from a single intelligent digital command center.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onLaunchDashboard}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/50 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Plant Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onLaunchDashboard}
              className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm px-6 py-3.5 rounded-2xl transition"
            >
              <span>Explore Interactive Demo</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-black text-amber-400 font-mono">82.4 MWh</div>
            <div className="text-xs text-slate-400 mt-1">Real-Time Energy Monitored</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-black text-sky-400 font-mono">94.8%</div>
            <div className="text-xs text-slate-400 mt-1">Hygiene Compliance Score</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-black text-purple-400 font-mono">78.2%</div>
            <div className="text-xs text-slate-400 mt-1">Packaging Circularity Rate</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-2xl font-black text-emerald-400 font-mono">87/100</div>
            <div className="text-xs text-slate-400 mt-1">Composite Sustainability Score</div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            The Three Intelligence Pillars
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            DairyGuard 360 unifies traditionally siloed factory domains into a single correlated AI engine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">1. Energy Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Machine-level kWh telemetry, refrigeration load analysis, peak load optimization, and real-time ML anomaly detection.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> kWh per Litre Efficiency Tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-amber-400" /> Refrigeration & CIP Load Isolation</li>
            </ul>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">2. Hygiene & Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital hygiene risk score (0-100), zone-based interactive heatmaps, CIP wash temperature verification, and SLA corrective action tracking.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-sky-400" /> Clickable Plant Heatmap Zones</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-sky-400" /> Automated Compliance Audits</li>
            </ul>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Recycle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">3. Packaging Circularity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track packaging produced vs recovered, collection center performance network, and gamified consumer packaging return rewards.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Collection Hub Recovery Maps</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-purple-400" /> Consumer Eco Points & Badges</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-panel p-8 rounded-3xl space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-400" />
          Enterprise Differentiators
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h4 className="font-bold text-sm text-slate-200">Industrial Digital Twin</h4>
            <p className="text-xs text-slate-400">Visual pipeline flow from raw intake to consumer recycling with real-time node status indicators.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            <h4 className="font-bold text-sm text-slate-200">What-If Simulator</h4>
            <p className="text-xs text-slate-400">Multi-slider scenario builder predicting energy, waste, carbon CO2e, and score outcomes instantly.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h4 className="font-bold text-sm text-slate-200">DairyGuard AI Advisor</h4>
            <p className="text-xs text-slate-400">Data-grounded conversational analyst answering queries anchored to live plant database telemetry.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <h4 className="font-bold text-sm text-slate-200">Consumer Eco Portal</h4>
            <p className="text-xs text-slate-400">Gamified return registry diverting plastic waste, awarding Eco Points, and computing CO2e avoided.</p>
          </div>
        </div>
      </section>

      <div className="text-center pt-4">
        <button
          onClick={onLaunchDashboard}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-950/50 hover:from-emerald-400 hover:to-teal-400 transition transform hover:scale-105"
        >
          <span>Enter Mission Control Dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
