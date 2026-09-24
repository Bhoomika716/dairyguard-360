import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  UserCheck, 
  Plus, 
  X,
  ChevronRight,
  Flame,
  FileCheck
} from 'lucide-react';
import { createCorrectiveAction } from '../services/api';

interface HygieneComplianceProps {
  data: any;
  onRefresh: () => void;
}

export const HygieneCompliance: React.FC<HygieneComplianceProps> = ({ data, onRefresh }) => {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    issue: '',
    area: 'Cleaning Area',
    severity: 'MEDIUM',
    assigned_to: 'Rajesh Kumar'
  });
  const [submitting, setSubmitting] = useState(false);

  if (!data) {
    return <div className="p-12 text-center text-slate-400 font-mono">Loading Hygiene Telemetry...</div>;
  }

  const heatmapZones = data.heatmap_zones || [];
  const checklists = data.checklists || [];

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCorrectiveAction({
        issue: form.issue,
        area: form.area,
        severity: form.severity,
        assigned_to: form.assigned_to,
        due_date: new Date().toISOString(),
        status: 'OPEN'
      });
      setShowModal(false);
      setForm({ issue: '', area: 'Cleaning Area', severity: 'MEDIUM', assigned_to: 'Rajesh Kumar' });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-400" />
            Hygiene & Compliance Command
          </h2>
          <p className="text-xs text-slate-400">
            Digital hygiene risk score, clickable zone heatmaps, and SLA corrective action tracking.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-950/40 border border-sky-400/40 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Corrective Action</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl space-y-2 border border-sky-500/30">
          <span className="text-xs font-mono uppercase text-slate-400">Overall Hygiene Score</span>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">
            {data.overall_hygiene_score}%
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            EXCELLENT COMPLIANCE
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Digital Hygiene Risk Index</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">
            {data.digital_hygiene_risk} <span className="text-sm text-slate-400">/100</span>
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
            RISK LEVEL: {data.risk_level}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-mono uppercase text-slate-400">Inspection Checklists</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {checklists.filter((c: any) => c.status === 'PASS').length} / {checklists.length}
          </div>
          <p className="text-xs text-slate-400">Surface ATP, PPE, Hand Wash & CIP Temps verified.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Flame className="h-4 w-4 text-sky-400" />
            Interactive Plant Hygiene Risk Heatmap
          </h3>
          <span className="text-xs text-slate-400 font-mono">Click any zone for active audit logs</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {heatmapZones.map((zone: any) => {
            const isCritical = zone.status === 'VIOLATION' || zone.risk === 'HIGH';
            const isAttention = zone.status === 'ATTENTION' || zone.risk === 'MEDIUM';

            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isCritical
                    ? 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400 shadow-lg shadow-rose-950/50'
                    : isAttention
                    ? 'bg-amber-950/40 border-amber-500/50 hover:border-amber-400'
                    : 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 tracking-wider font-mono">
                    {zone.name}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    isCritical ? 'bg-rose-500 animate-ping' : isAttention ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-2xl font-black font-mono text-white">
                    {zone.score}%
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Risk: <strong className={isCritical ? 'text-rose-400' : isAttention ? 'text-amber-400' : 'text-emerald-400'}>{zone.risk}</strong></span>
                    {zone.failed_checks > 0 && (
                      <span className="text-rose-400 font-bold">{zone.failed_checks} failed</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-sky-400 transition">
                  <span>Inspect Zone</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            Active Audit Inspection Checklists
          </h3>

          <div className="space-y-2">
            {checklists.map((item: any) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">{item.item_name}</div>
                  <p className="text-[11px] text-slate-400">{item.notes}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                  item.status === 'PASS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                  item.status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-sky-400" />
            Corrective Action SLA Workflow
          </h3>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Filler Nozzle 3 Sanitization</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                IN PROGRESS
              </span>
            </div>
            <p className="text-xs text-slate-400">Assigned To: <strong className="text-slate-200">Karan Verma (QA Lead)</strong></p>
            <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              Resolution: Steam flush initiated; replacement gasket ordered for CIP Rig 2.
            </p>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3 text-sky-400" />
              <span>SLA Target Due: 2 hours</span>
            </div>
          </div>
        </div>
      </div>

      {selectedZone && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 font-mono">{selectedZone.name}</h3>
              <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p>Current Score: <strong className="text-sky-400">{selectedZone.score}%</strong></p>
              <p>Risk Level: <strong className="text-amber-400">{selectedZone.risk}</strong></p>
              <p>Failed Checklist Items: <strong className="text-rose-400">{selectedZone.failed_checks}</strong></p>
              <p className="text-slate-400 pt-2 border-t border-slate-800">
                Last Inspected: <strong>14:30 UTC</strong> by Lead Auditor M. Rao
              </p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-xl text-xs"
            >
              Close Telemetry Modal
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateAction} className="bg-[#0B1220] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100">Create Corrective Action</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Issue Description</label>
                <input
                  type="text"
                  required
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  placeholder="e.g. CIP Wash Fluid Pressure Drop"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Area</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Cleaning Area">Cleaning Area</option>
                  <option value="Packaging Area">Packaging Area</option>
                  <option value="Processing Area">Processing Area</option>
                  <option value="Storage Vault">Storage Vault</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Technician</label>
                <input
                  type="text"
                  required
                  value={form.assigned_to}
                  onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 rounded-xl text-xs"
              >
                Submit Action
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
