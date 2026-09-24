import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Sparkles
} from 'lucide-react';
import { fetchReports } from '../services/api';

export const AnalyticsReports: React.FC = () => {
  const [reportType, setReportType] = useState('daily');
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchReports(reportType).then(setReportData).catch(console.error);
  }, [reportType]);

  const handleExportCSV = () => {
    if (!reportData) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Production Litres,${reportData.summary.total_production_litres}\n`
      + `Total Energy MWh,${reportData.summary.total_energy_mwh}\n`
      + `Hygiene Compliance Score,${reportData.summary.avg_hygiene_score}%\n`
      + `Packaging Recovery Rate,${reportData.summary.packaging_recovery_rate}%\n`
      + `Overall Sustainability Score,${reportData.summary.overall_sustainability_score}/100\n`
      + `Carbon Avoided Tonnes,${reportData.summary.carbon_avoided_tonnes}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DairyGuard_Report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            Analytics & Exportable Plant Reports
          </h2>
          <p className="text-xs text-slate-400">
            Generate executive compliance summaries, energy efficiency metrics, and sustainability reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-mono overflow-x-auto">
        {[
          { id: 'daily', label: 'Daily Plant Report' },
          { id: 'weekly', label: 'Weekly Sustainability' },
          { id: 'monthly', label: 'Monthly Compliance' },
          { id: 'waste', label: 'Waste Recovery Report' },
          { id: 'energy', label: 'Energy Efficiency Report' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
              reportType === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {reportData && (
        <div className="glass-panel p-8 rounded-3xl space-y-6 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <h3 className="font-bold text-lg text-white">{reportData.report_title}</h3>
              <p className="text-xs text-slate-400">{reportData.plant} | Generated: {reportData.generated_at}</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              OFFICIAL COMPLIANCE REPORT
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Production</span>
              <div className="text-lg font-bold font-mono text-white">{reportData.summary.total_production_litres.toLocaleString()} L</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Energy</span>
              <div className="text-lg font-bold font-mono text-amber-400">{reportData.summary.total_energy_mwh} MWh</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Hygiene</span>
              <div className="text-lg font-bold font-mono text-sky-400">{reportData.summary.avg_hygiene_score}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Recovery</span>
              <div className="text-lg font-bold font-mono text-purple-400">{reportData.summary.packaging_recovery_rate}%</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Sust. Score</span>
              <div className="text-lg font-bold font-mono text-emerald-400">{reportData.summary.overall_sustainability_score}/100</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">CO2e Saved</span>
              <div className="text-lg font-bold font-mono text-teal-400">{reportData.summary.carbon_avoided_tonnes} t</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Executive AI Operational Recommendation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{reportData.top_ai_recommendation}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
