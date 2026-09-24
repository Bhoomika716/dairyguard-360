import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  Recycle, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';
import { fetchAIInsights } from '../services/api';
import type { AIInsightItem } from '../types';

export const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsightItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    fetchAIInsights().then(setInsights).catch(console.error);
  }, []);

  const filtered = filterCategory === 'ALL'
    ? insights
    : insights.filter(i => i.category.includes(filterCategory));

  const getCategoryBadge = (cat: string) => {
    if (cat.includes('ENERGY')) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Zap };
    if (cat.includes('HYGIENE')) return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', icon: ShieldCheck };
    if (cat.includes('WASTE')) return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: Recycle };
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: TrendingUp };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-emerald-400" />
            AI Insights & Operational Recommendations
          </h2>
          <p className="text-xs text-slate-400">
            Automatically generated cross-domain anomaly investigations and action cards.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          {['ALL', 'ENERGY', 'HYGIENE', 'WASTE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition uppercase ${
                filterCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => {
          const badge = getCategoryBadge(item.category);
          const Icon = badge.icon;

          return (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 border border-slate-800 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl border ${badge.bg} ${badge.text} ${badge.border}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${badge.text}`}>
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-mono text-emerald-400 text-[11px]">
                    Confidence: {Math.round(item.confidence_score * 100)}%
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-[11px] font-mono">{item.timestamp}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">1. Observed Evidence</span>
                  <p className="text-xs text-slate-200">{item.evidence}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">2. Root Cause Factor</span>
                  <p className="text-xs text-slate-200">{item.possible_cause}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> 3. Recommended Action
                  </span>
                  <p className="text-xs text-slate-100 font-medium">{item.recommended_action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
