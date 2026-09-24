import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Award, 
  Sparkles, 
  Recycle, 
  CheckCircle2, 
  Trophy,
  ArrowRight,
  Truck,
  Building,
  RotateCcw
} from 'lucide-react';
import { submitConsumerReturn } from '../services/api';

export const ConsumerPortal: React.FC = () => {
  const [form, setForm] = useState({
    consumer_name: 'Ananya Roy',
    packaging_id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
    packaging_type: 'LDPE Pouch 500ml',
    quantity: 10,
    collection_center: 'Malleswaram Station'
  });

  const [loading, setLoading] = useState(false);
  const [lastReturn, setLastReturn] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitConsumerReturn({
        consumer_name: form.consumer_name,
        packaging_id: form.packaging_id,
        packaging_type: form.packaging_type,
        quantity: Number(form.quantity),
        collection_center: form.collection_center
      });
      setLastReturn(res);
      setForm({
        ...form,
        packaging_id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const badges = [
    { title: 'First Return', icon: '♻️', description: 'Registered 1st return', earned: true },
    { title: 'Eco Starter', icon: '🌱', description: 'Diverted 500g plastic', earned: true },
    { title: 'Circular Champion', icon: '🏆', description: 'Returned 50+ packages', earned: true },
    { title: 'Carbon Guardian', icon: '💚', description: 'Saved 2.0 kg CO2e', earned: false }
  ];

  const leaderboard = [
    { rank: 1, name: 'Rohan Gupta', points: 480, returns: 96, co2e: '4.8 kg' },
    { rank: 2, name: 'Ananya Roy (You)', points: 340, returns: 68, co2e: '3.4 kg' },
    { rank: 3, name: 'Deepa Patel', points: 290, returns: 58, co2e: '2.9 kg' },
    { rank: 4, name: 'Vikram Sethi', points: 210, returns: 42, co2e: '2.1 kg' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-emerald-400" />
          Consumer Circular Packaging Return Portal
        </h2>
        <p className="text-xs text-slate-400">
          Register returned milk pouches and bottles, earn Eco Reward Points, and track your carbon impact.
        </p>
      </div>

      {/* ANIMATED CIRCULAR FLOW TOPOLOGY */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-[#0F172A] via-[#0B1220] to-[#07111F]">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono uppercase mb-3">
          <span>Circular Polymer Pipeline Journey</span>
          <span className="text-emerald-400 font-bold">100% Closed Loop</span>
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto py-2">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">1. YOU</div>
              <div className="text-[10px] text-slate-400">Consumer Return</div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 animate-pulse" />

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Building className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">2. COLLECTION</div>
              <div className="text-[10px] text-slate-400">Metro Hub Station</div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-purple-400 shrink-0 animate-pulse" />

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">3. RECYCLING</div>
              <div className="text-[10px] text-slate-400">rHDPE Pelletization</div>
            </div>
          </div>

          <ArrowRight className="h-4 w-4 text-teal-400 shrink-0 animate-pulse" />

          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-100">4. DAIRY PLANT</div>
              <div className="text-[10px] text-slate-400">Refilled Pouch</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-6 border border-slate-800">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Recycle className="h-4 w-4 text-emerald-400" />
              Register Packaging Return
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Eco Reward Enabled
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Consumer Name</label>
                <input
                  type="text"
                  required
                  value={form.consumer_name}
                  onChange={(e) => setForm({ ...form, consumer_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Packaging ID Tag</label>
                <input
                  type="text"
                  required
                  value={form.packaging_id}
                  onChange={(e) => setForm({ ...form, packaging_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Packaging Type</label>
                <select
                  value={form.packaging_type}
                  onChange={(e) => setForm({ ...form, packaging_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="LDPE Pouch 500ml">LDPE Pouch 500ml</option>
                  <option value="HDPE Bottle 1L">HDPE Bottle 1L</option>
                  <option value="Glass Bottle 500ml">Glass Bottle 500ml</option>
                  <option value="TetraPak 200ml">TetraPak 200ml</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quantity Returned</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Drop-Off Collection Hub</label>
              <select
                value={form.collection_center}
                onChange={(e) => setForm({ ...form, collection_center: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Malleswaram Station">Malleswaram Station Hub (91% Target)</option>
                <option value="Yelahanka Hub">Yelahanka Hub (82% Target)</option>
                <option value="Hebbal Center">Hebbal Center (74% Target)</option>
                <option value="Whitefield Hub">Whitefield Hub (61% Target)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs py-3.5 rounded-xl shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>{loading ? 'REGISTERING RETURN...' : 'SUBMIT PACKAGING RETURN'}</span>
            </button>
          </form>

          {lastReturn && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{lastReturn.message}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-200 pt-1 border-t border-slate-800 font-mono">
                <div>Diverted: <strong>{lastReturn.weight_diverted_grams} g</strong></div>
                <div>Points: <strong className="text-emerald-400">+{lastReturn.points_earned} pts</strong></div>
                <div>CO2e Saved: <strong className="text-teal-400">+{lastReturn.co2e_avoided_kg} kg</strong></div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Eco Milestone Badges
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((b, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border space-y-1 ${
                    b.earned
                      ? 'bg-slate-900/90 border-emerald-500/40 text-slate-100'
                      : 'bg-slate-950/50 border-slate-800 opacity-60 text-slate-500'
                  }`}
                >
                  <div className="text-xl">{b.icon}</div>
                  <div className="font-bold text-xs">{b.title}</div>
                  <p className="text-[10px] text-slate-400">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Community Circular Leaderboard
            </h3>

            <div className="space-y-2">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-amber-400 w-4">#{user.rank}</span>
                    <span className="font-semibold text-slate-200">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">{user.points} pts</span>
                    <span className="text-slate-400">{user.co2e}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
