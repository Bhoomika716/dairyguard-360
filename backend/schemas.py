from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PlantSchema(BaseModel):
    id: int
    name: str
    code: str
    location: str
    daily_capacity_litres: float
    created_at: datetime

    class Config:
        from_attributes = True

class KPICardSchema(BaseModel):
    title: str
    value: str
    numeric_value: float
    unit: str
    previous_value: str
    change_pct: float
    status: str # EXCELLENT, NORMAL, ATTENTION, CRITICAL
    trend: List[float]

class DashboardOverviewSchema(BaseModel):
    plant_status: str
    last_updated: str
    ai_summary: str
    kpis: dict
    line_statuses: List[dict]

class MachineSchema(BaseModel):
    id: int
    name: str
    zone: str
    status: str
    power_rating_kw: float

    class Config:
        from_attributes = True

class EnergyReadingSchema(BaseModel):
    id: int
    timestamp: datetime
    machine_id: Optional[int]
    total_kwh: float
    power_factor: float
    peak_load_kw: float
    refrigeration_load_kwh: float
    cleaning_load_kwh: float
    processing_load_kwh: float
    energy_per_litre: float
    is_anomaly: bool

    class Config:
        from_attributes = True

class HygieneInspectionSchema(BaseModel):
    id: int
    timestamp: datetime
    zone: str
    inspector_name: str
    overall_score: float
    risk_level: str
    status: str

    class Config:
        from_attributes = True

class HygieneChecklistSchema(BaseModel):
    id: int
    inspection_id: int
    item_name: str
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True

class CorrectiveActionCreateSchema(BaseModel):
    issue: str
    area: str
    severity: str
    assigned_to: str
    due_date: str
    status: str = "OPEN"

class CorrectiveActionSchema(BaseModel):
    id: int
    violation_id: Optional[int]
    issue: str
    area: str
    severity: str
    assigned_to: str
    due_date: datetime
    status: str
    resolution: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ConsumerReturnCreateSchema(BaseModel):
    consumer_name: str = "Eco Citizen"
    packaging_id: str
    packaging_type: str
    quantity: int
    collection_center: str

class ConsumerReturnResponseSchema(BaseModel):
    id: int
    consumer_name: str
    packaging_id: str
    packaging_type: str
    quantity: int
    weight_grams: float
    collection_center: str
    reward_points_earned: int
    co2e_avoided_kg: float
    timestamp: datetime

    class Config:
        from_attributes = True

class SimulationRequestSchema(BaseModel):
    production_volume_change_pct: float = 0.0 # e.g. +20%
    cleaning_frequency_change: float = 0.0 # e.g. +1 cycle/day
    energy_efficiency_change_pct: float = 0.0 # e.g. -5%
    packaging_recovery_change_pct: float = 0.0 # e.g. +10%
    recycling_rate_change_pct: float = 0.0 # e.g. +15%

class SimulationResultSchema(BaseModel):
    predicted_energy_kwh_pct: float
    predicted_waste_qty_pct: float
    predicted_recovery_rate_pct: float
    predicted_hygiene_risk_pct: float
    predicted_carbon_impact_pct: float
    predicted_sustainability_score_change: float
    ai_explanation: str
    current_metrics: dict
    simulated_metrics: dict

class AlertActionSchema(BaseModel):
    alert_id: int
    action: str # ACKNOWLEDGE, ASSIGN, RESOLVE
    assigned_to: Optional[str] = None

class AIQuestionSchema(BaseModel):
    question: str

class WasteLogCreateSchema(BaseModel):
    type: str
    qty: float
    unit: str = "kg"
    processing_method: Optional[str] = "Recycling Plant"

