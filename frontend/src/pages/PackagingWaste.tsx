import React, { useState, useEffect } from 'react';
import { 
  Recycle, 
  MapPin, 
  PackageCheck, 
  ShoppingBag,
  Building
} from 'lucide-react';
import { fetchCollectionCenters } from '../services/api';
import type { CollectionCenter } from '../types';

interface PackagingWasteProps {
  data: any;
  onNavigateConsumer: () => void;
}

export const PackagingWaste: React.FC<PackagingWasteProps> = ({ data, onNavigateConsumer }) => {
  const [centers, setCenters] = useState<CollectionCenter[]>([]);

  useEffect(() => {
    fetchCollectionCenters().then(setCenters).catch(console.error);
  }, []);

  if (!data) {
    return <div className="p-12 text-center text-slate-400 font-mono">Loading Circular Packaging Data...</div>;
  }

  const recentReturns = data.recent_consumer_returns || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Recycle className="h-5 w-5 text-purple-400" />
            Packaging Waste & Circular Economy
          </h2>
          <p className="text-xs text-slate-400">
            Circular polymer recovery tracking, collection hub performance, and consumer recycling telemetry.
          </p>
        </div>

        <button
          onClick={onNavigateConsumer}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-950/40 border border-purple-400/40 transition"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Consumer Return Portal</span>
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-purple-500/30">
          <span className="text-xs font-mono uppercase text-slate-400">Packaging Recovery Rate</span>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">
            {data.recovery_rate_pct}%
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
            GAP TO TARGET: -{data.gap_pct}%
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Monthly Produced</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {data.packaging_produced_units.toLocaleString()} <span className="text-xs text-slate-400">units</span>
          </div>
          <p className="text-xs text-slate-400">LDPE Pouches & rHDPE Bottles</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Packaging Returned</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {data.packaging_returned_units.toLocaleString()} <span className="text-xs text-slate-400">units</span>
          </div>
          <p className="text-xs text-slate-400">Diverted from municipal landfills</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">CO2e Avoided</span>
          <div className="text-3xl font-extrabold text-teal-400 font-mono">
            {data.co2e_avoided_tonnes} <span className="text-xs text-slate-400">tonnes</span>
          </div>
          <p className="text-xs text-slate-400">Polymer recycling carbon savings</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-400" />
            Collection Center Network & Hub Throughput
          </h3>
          <span className="text-xs text-slate-400 font-mono">4 Metro Collection Stations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {centers.map((center) => (
            <div
              key={center.id}
              className={`p-5 rounded-2xl border space-y-3 transition-all ${
                center.status === 'ACTIVE'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40'
                  : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-purple-400" />
                  <span className="font-bold text-xs text-slate-200">{center.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  center.recovery_pct >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {center.recovery_pct}%
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Daily Target:</span>
                  <span className="font-mono text-slate-200">{center.daily_target}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Collected Today:</span>
                  <span className="font-mono text-purple-400 font-bold">{center.collected_today}</span>
                </div>
              </div>

              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${center.recovery_pct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, center.recovery_pct)}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>Consumer Scans:</span>
                <span className="font-mono text-slate-300">{center.consumer_participants} users</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-emerald-400" />
          Live Consumer Return Audit Stream
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-2.5 px-3">Consumer</th>
                <th className="py-2.5 px-3">Packaging ID</th>
                <th className="py-2.5 px-3">Material Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Collection Center</th>
                <th className="py-2.5 px-3">Reward Points</th>
                <th className="py-2.5 px-3 text-right">CO2e Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentReturns.map((ret: any) => (
                <tr key={ret.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-3 font-semibold text-slate-200">{ret.consumer}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{ret.packaging_id}</td>
                  <td className="py-3 px-3 text-slate-300">{ret.type}</td>
                  <td className="py-3 px-3 font-mono text-purple-400 font-bold">{ret.quantity}</td>
                  <td className="py-3 px-3 text-slate-400">{ret.center}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">+{ret.points} pts</td>
                  <td className="py-3 px-3 font-mono text-teal-400 text-right">+{ret.co2e_avoided_kg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
