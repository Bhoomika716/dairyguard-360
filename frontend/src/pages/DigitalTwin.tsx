import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Flame, 
  Package, 
  Snowflake, 
  Truck, 
  UserCheck, 
  MapPin, 
  RotateCcw, 
  AlertTriangle,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { fetchDigitalTwinTelemetry } from '../services/api';
import type { DigitalTwinNode } from '../types';

export const DigitalTwin: React.FC = () => {
  const [nodes, setNodes] = useState<DigitalTwinNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<DigitalTwinNode | null>(null);
  const [incidentActive, setIncidentActive] = useState(false);

  useEffect(() => {
    fetchDigitalTwinTelemetry()
      .then((res) => {
        setNodes(res.nodes);
        setIncidentActive(res.incident_active);
        if (res.nodes && res.nodes.length > 0) setSelectedNode(res.nodes[0]);
      })
      .catch(console.error);
  }, []);

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'production': return Activity;
      case 'processing': return Cpu;
      case 'cleaning': return Flame;
      case 'packaging': return Package;
      case 'refrigeration': return Snowflake;
      case 'distribution': return Truck;
      case 'consumer': return UserCheck;
      case 'collection': return MapPin;
      case 'recycling': return RotateCcw;
      default: return Activity;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', glow: 'shadow-emerald-950/40' };
      case 'ATTENTION':
      case 'HIGH LOAD':
        return { border: 'border-amber-500/50', bg: 'bg-amber-950/30', text: 'text-amber-400', glow: 'shadow-amber-950/40' };
      case 'VIOLATION':
      case 'BELOW TARGET':
        return { border: 'border-rose-500/60', bg: 'bg-rose-950/40', text: 'text-rose-400', glow: 'shadow-rose-950/50' };
      default:
        return { border: 'border-slate-800', bg: 'bg-slate-900', text: 'text-slate-300', glow: '' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
            Digital Twin Industrial Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            End-to-end synchronized digital twin reflecting real-time physical plant telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>LIVE TELEMETRY SYNCHRONIZED</span>
        </div>
      </div>

      {incidentActive && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-red-900/60 to-rose-950/80 border border-rose-500/50 flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
            <div className="text-xs text-slate-100">
              <strong className="text-rose-300">CASCADING PLANT INCIDENT ACTIVE:</strong> High Production volume forced Chiller Array overload & Cleaning Area sanitation temperature violation.
            </div>
          </div>
          <span className="text-[10px] font-mono bg-rose-500 text-white px-2 py-1 rounded font-bold">CRITICAL</span>
        </div>
      )}

      {/* PIPELINE CANVAS WITH CONNECTION FLOW PATHS */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Smart Dairy Manufacturing & Circular Pipeline Topology
          </span>
          <span className="text-xs text-slate-500">Click any stage node to inspect live telemetry</span>
        </div>

        {/* Visual Stage Connection Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {nodes.map((node, idx) => {
            const Icon = getNodeIcon(node.id);
            const style = getStatusStyle(node.status);
            const isSelected = selectedNode?.id === node.id;
            const isAffectedByIncident = incidentActive && (node.id === 'refrigeration' || node.id === 'cleaning' || node.id === 'collection');

            return (
              <div key={node.id} className="relative group">
                <button
                  onClick={() => setSelectedNode(node)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 ${style.bg} ${style.border} ${
                    isSelected ? 'ring-2 ring-emerald-400 scale-105 z-10' : 'hover:scale-[1.02]'
                  } ${isAffectedByIncident ? 'animate-pulse border-rose-500/80 shadow-lg shadow-rose-950/60' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${style.text}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${style.bg} ${style.text} ${style.border}`}>
                      {node.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 font-mono">Stage 0{idx + 1}</div>
                    <h4 className="text-xs font-bold text-slate-100 leading-tight mt-0.5">
                      {node.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Inspect Node</span>
                    <ChevronRight className="h-3 w-3 text-slate-500" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED STAGE DETAIL INSPECTOR */}
      {selectedNode && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{selectedNode.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">Stage Identifier: {selectedNode.id.toUpperCase()}</p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getStatusStyle(selectedNode.status).bg} ${getStatusStyle(selectedNode.status).text} ${getStatusStyle(selectedNode.status).border}`}>
              STATUS: {selectedNode.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(selectedNode.telemetry).map(([key, val]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">{key}</span>
                <div className="text-base font-bold font-mono text-white">{val}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>AI Stage Optimization Recommendation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {selectedNode.status === 'NORMAL'
                ? `Stage ${selectedNode.title} is running within nominal operational thresholds. No immediate action required.`
                : `Stage ${selectedNode.title} is showing ${selectedNode.status}. Immediate inspection recommended for expansion valve pressures and wash cycle logs.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
