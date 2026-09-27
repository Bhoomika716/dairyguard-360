const VITE_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE = VITE_API_URL ? `${VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

export async function fetchDashboardOverview() {
  const res = await fetch(`${API_BASE}/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard');
  return res.json();
}

export async function fetchRisksAndOpportunities() {
  const res = await fetch(`${API_BASE}/risks-and-opportunities`);
  if (!res.ok) throw new Error('Failed to fetch risks and opportunities');
  return res.json();
}

export async function fetchIncidentTimeline() {
  const res = await fetch(`${API_BASE}/incident/timeline`);
  if (!res.ok) throw new Error('Failed to fetch incident timeline');
  return res.json();
}

export async function fetchRootCauseAnalysis() {
  const res = await fetch(`${API_BASE}/incident/root-cause`);
  if (!res.ok) throw new Error('Failed to fetch root-cause analysis');
  return res.json();
}

export async function fetchCenterExplanation(centerId: number) {
  const res = await fetch(`${API_BASE}/waste/collection-centers/${centerId}/explanation`);
  if (!res.ok) throw new Error('Failed to fetch collection center explanation');
  return res.json();
}

export async function fetchEnergyIntelligence() {
  const res = await fetch(`${API_BASE}/energy`);
  if (!res.ok) throw new Error('Failed to fetch energy intelligence');
  return res.json();
}

export async function fetchHygieneData() {
  const res = await fetch(`${API_BASE}/hygiene`);
  if (!res.ok) throw new Error('Failed to fetch hygiene compliance data');
  return res.json();
}

export async function createCorrectiveAction(payload: { issue: string; area: string; severity: string; assigned_to: string; due_date: string; status: string }) {
  const res = await fetch(`${API_BASE}/hygiene/corrective-actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create corrective action');
  return res.json();
}

export async function fetchPackagingWaste() {
  const res = await fetch(`${API_BASE}/waste`);
  if (!res.ok) throw new Error('Failed to fetch packaging waste metrics');
  return res.json();
}

export async function fetchCollectionCenters() {
  const res = await fetch(`${API_BASE}/waste/collection-centers`);
  if (!res.ok) throw new Error('Failed to fetch collection centers');
  return res.json();
}

export async function submitConsumerReturn(payload: { consumer_name: string; packaging_id: string; packaging_type: string; quantity: number; collection_center: string }) {
  const res = await fetch(`${API_BASE}/consumer/returns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit consumer return');
  return res.json();
}

export async function fetchDigitalTwinTelemetry() {
  const res = await fetch(`${API_BASE}/digital-twin`);
  if (!res.ok) throw new Error('Failed to fetch digital twin telemetry');
  return res.json();
}

export async function runSimulation(params: {
  production_volume_change_pct: number;
  cleaning_frequency_change: number;
  energy_efficiency_change_pct: number;
  packaging_recovery_change_pct: number;
  recycling_rate_change_pct: number;
}) {
  const res = await fetch(`${API_BASE}/simulations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
}

export async function saveSimulationScenario(params: {
  production_volume_change_pct: number;
  cleaning_frequency_change: number;
  energy_efficiency_change_pct: number;
  packaging_recovery_change_pct: number;
  recycling_rate_change_pct: number;
}) {
  const res = await fetch(`${API_BASE}/simulations/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to save scenario');
  return res.json();
}

export async function fetchSavedScenarios() {
  const res = await fetch(`${API_BASE}/simulations/saved`);
  if (!res.ok) throw new Error('Failed to fetch saved scenarios');
  return res.json();
}

export async function fetchAIInsights() {
  const res = await fetch(`${API_BASE}/insights`);
  if (!res.ok) throw new Error('Failed to fetch AI insights');
  return res.json();
}

export async function fetchAlerts(severity?: string) {
  const url = severity ? `${API_BASE}/alerts?severity=${severity}` : `${API_BASE}/alerts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function postAlertAction(alertId: number, action: string, assignedTo?: string) {
  const res = await fetch(`${API_BASE}/alerts/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alert_id: alertId, action, assigned_to: assignedTo })
  });
  if (!res.ok) throw new Error('Failed to update alert');
  return res.json();
}

export async function askAIAdvisor(question: string) {
  const res = await fetch(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Failed to get answer from AI advisor');
  return res.json();
}

export async function fetchEquipmentIntelligence() {
  const res = await fetch(`${API_BASE}/equipment`);
  if (!res.ok) throw new Error('Failed to fetch equipment intelligence');
  return res.json();
}

export async function fetchWasteLogs() {
  const res = await fetch(`${API_BASE}/waste/logs`);
  if (!res.ok) throw new Error('Failed to fetch waste logs');
  return res.json();
}

export async function logWasteItem(payload: { type: string; qty: number; unit?: string; processing_method?: string }) {
  const res = await fetch(`${API_BASE}/waste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to log waste item');
  return res.json();
}

export async function acknowledgeAlert(alertId: number) {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to acknowledge alert');
  return res.json();
}

export async function resolveAlert(alertId: number) {
  const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to resolve alert');
  return res.json();
}

export async function resetPlantSimulation() {
  const res = await fetch(`${API_BASE}/demo/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset plant simulation');
  return res.json();
}

export async function toggleDemoMode(enabled: boolean) {
  const res = await fetch(`${API_BASE}/demo/mode?enabled=${enabled}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle demo mode');
  return res.json();
}

export async function triggerPlantIncident(scenario: string = 'general') {
  const res = await fetch(`${API_BASE}/demo/trigger-incident?scenario=${scenario}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger plant incident');
  return res.json();
}

export async function triggerSimulatedTick() {
  const res = await fetch(`${API_BASE}/simulation/tick`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to trigger simulation tick');
  return res.json();
}

export async function fetchReports(reportType: string = 'daily') {
  const res = await fetch(`${API_BASE}/reports?report_type=${reportType}`);
  if (!res.ok) throw new Error('Failed to fetch report summary');
  return res.json();
}
