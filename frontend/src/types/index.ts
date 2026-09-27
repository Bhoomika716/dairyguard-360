export type RoleType = 'Plant Manager' | 'Sustainability Manager' | 'Quality Manager' | 'Maintenance Manager' | 'Consumer';

export interface KPICardData {
  title: string;
  value: string;
  numeric_value: number;
  unit: string;
  previous_value: string;
  change_pct: number;
  status: 'EXCELLENT' | 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  trend: number[];
}

export interface PlantHealthData {
  overall_health: number;
  energy_health: number;
  hygiene_health: number;
  production_health: number;
  waste_health: number;
  alert_health: number;
}

export interface LineStatusData {
  name: string;
  status: string;
  load: string;
  zone: string;
}

export interface DashboardOverview {
  plant_status: string;
  last_updated: string;
  ai_summary: string;
  kpis: Record<string, KPICardData>;
  plant_health?: PlantHealthData;
  line_statuses: LineStatusData[];
  demo_mode: boolean;
}

export interface RiskItem {
  id: number;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  domain: string;
  impact: string;
  recommended_action: string;
}

export interface OpportunityItem {
  id: number;
  title: string;
  domain: string;
  potential_saving: string;
  description: string;
}

export interface EquipmentItem {
  id: number;
  name: string;
  code: string;
  zone: string;
  current_kw: number;
  normal_kw: number;
  deviation_pct: number;
  health_score: number;
  operating_state: string;
  anomaly_status: string;
  status: string;
  temperature_c?: number;
  last_maintenance: string;
  recommended_action: string;
  trend: number[];
}

export interface HygieneArea {
  id: string;
  name: string;
  score: number;
  missed_checks: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
  compliance: 'Compliant' | 'Needs attention' | 'Non-compliant';
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  corrective_action: string;
  last_inspection: string;
}

export interface WasteLogItem {
  id: number;
  type: string;
  qty: number;
  unit: string;
  status: string;
  collection_date?: string;
  processing_method?: string;
  recycling_rate_pct?: number;
  created_at?: string;
}

export interface IncidentStep {
  time: string;
  event: string;
  domain: string;
  severity: string;
  status: string;
}

export interface RootCauseData {
  what_happened: string;
  why_did_it_happen: string;
  what_was_affected: string[];
  recommended_actions: string[];
  supporting_metrics: Record<string, string>;
}

export interface EnergyReading {
  id: number;
  timestamp: string;
  total_kwh: number;
  power_factor: number;
  peak_load_kw: number;
  refrigeration_load_kwh: number;
  cleaning_load_kwh: number;
  processing_load_kwh: number;
  energy_per_litre: number;
  is_anomaly: boolean;
}

export interface MachineBreakdown {
  name: string;
  zone: string;
  status: string;
  power_kw: number;
  share_pct: number;
}

export interface HeatmapZone {
  id: string;
  name: string;
  status: string;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  failed_checks: number;
}

export interface CorrectiveAction {
  id: number;
  issue: string;
  area: string;
  severity: string;
  assigned_to: string;
  due_date: string;
  status: string;
  resolution?: string;
}

export interface ConsumerReturn {
  id: number;
  consumer: string;
  packaging_id: string;
  type: string;
  quantity: number;
  center: string;
  points: number;
  co2e_avoided_kg: number;
  timestamp: string;
}

export interface CollectionCenter {
  id: number;
  name: string;
  code: string;
  daily_target: number;
  collected_today: number;
  recovery_pct: number;
  consumer_participants: number;
  status: string;
}

export interface DigitalTwinNode {
  id: string;
  title: string;
  status: 'NORMAL' | 'ATTENTION' | 'HIGH LOAD' | 'VIOLATION' | 'BELOW TARGET';
  telemetry: Record<string, string>;
}

export interface AIInsightItem {
  id: number;
  category: string;
  severity: string;
  title: string;
  evidence: string;
  possible_cause: string;
  recommended_action: string;
  confidence_score: number;
  timestamp: string;
}

export interface AlertItem {
  id: number;
  category: string;
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  affected_target?: string;
  observed_value?: string;
  expected_value?: string;
  deviation?: string;
  recommended_action?: string;
  status: 'NEW' | 'OPEN' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'RESOLVED';
  assigned_to?: string;
  timestamp: string;
}

export interface SavedScenario {
  id: number;
  name: string;
  created_at: string;
  prod_change: number;
  recovery_change: number;
  score_change: number;
  ai_explanation: string;
}
