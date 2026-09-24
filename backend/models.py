from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Alpha Dairy Plant - Sector 4")
    code = Column(String, default="PLANT-IND-01")
    location = Column(String, default="Bengaluru Industrial Hub")
    daily_capacity_litres = Column(Float, default=50000.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    zone = Column(String)
    status = Column(String, default="NORMAL")
    power_rating_kw = Column(Float, default=45.0)

class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    line_name = Column(String, default="Production Line A")
    volume_litres = Column(Float)
    batch_number = Column(String)
    status = Column(String, default="NORMAL")

class EnergyReading(Base):
    __tablename__ = "energy_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=True)
    total_kwh = Column(Float)
    power_factor = Column(Float, default=0.95)
    peak_load_kw = Column(Float)
    refrigeration_load_kwh = Column(Float)
    cleaning_load_kwh = Column(Float)
    processing_load_kwh = Column(Float)
    energy_per_litre = Column(Float)
    is_anomaly = Column(Boolean, default=False)

    machine = relationship("Machine")

class HygieneInspection(Base):
    __tablename__ = "hygiene_inspections"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone = Column(String)
    inspector_name = Column(String)
    overall_score = Column(Float)
    risk_level = Column(String, default="LOW")
    status = Column(String, default="PASSED")

class HygieneChecklist(Base):
    __tablename__ = "hygiene_checklists"

    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("hygiene_inspections.id"))
    item_name = Column(String)
    status = Column(String)
    notes = Column(Text, nullable=True)

    inspection = relationship("HygieneInspection")

class HygieneViolation(Base):
    __tablename__ = "hygiene_violations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone = Column(String)
    title = Column(String)
    description = Column(Text)
    severity = Column(String, default="MEDIUM")
    status = Column(String, default="OPEN")

class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"

    id = Column(Integer, primary_key=True, index=True)
    violation_id = Column(Integer, ForeignKey("hygiene_violations.id"), nullable=True)
    issue = Column(String)
    area = Column(String)
    severity = Column(String)
    assigned_to = Column(String)
    due_date = Column(DateTime)
    status = Column(String, default="OPEN")
    resolution = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PackagingRecord(Base):
    __tablename__ = "packaging_records"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    packaging_produced_qty = Column(Integer)
    packaging_type = Column(String)
    weight_kg = Column(Float)
    recovered_qty = Column(Integer, default=0)

class ConsumerReturn(Base):
    __tablename__ = "consumer_returns"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    consumer_name = Column(String, default="Eco Citizen")
    packaging_id = Column(String)
    packaging_type = Column(String)
    quantity = Column(Integer)
    weight_grams = Column(Float)
    collection_center = Column(String)
    reward_points_earned = Column(Integer)
    co2e_avoided_kg = Column(Float)

class CollectionCenter(Base):
    __tablename__ = "collection_centers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    code = Column(String)
    daily_target_qty = Column(Integer)
    collected_today_qty = Column(Integer)
    recovery_percentage = Column(Float)
    consumer_participation_count = Column(Integer)
    status = Column(String, default="ACTIVE")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    category = Column(String)
    severity = Column(String)
    title = Column(String)
    message = Column(Text)
    observed_value = Column(String, nullable=True)
    expected_value = Column(String, nullable=True)
    deviation = Column(String, nullable=True)
    status = Column(String, default="OPEN")
    assigned_to = Column(String, nullable=True)

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    category = Column(String)
    severity = Column(String)
    title = Column(String)
    evidence = Column(Text)
    possible_cause = Column(Text)
    recommended_action = Column(Text)
    confidence_score = Column(Float, default=0.92)

class SustainabilityScore(Base):
    __tablename__ = "sustainability_scores"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    overall_score = Column(Float)
    energy_score = Column(Float)
    hygiene_score = Column(Float)
    waste_score = Column(Float)
    operations_score = Column(Float)
    carbon_co2e_tonnes = Column(Float)

class PlantHealthScore(Base):
    __tablename__ = "plant_health_scores"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    overall_health = Column(Float) # 0 - 100
    energy_health = Column(Float)
    hygiene_health = Column(Float)
    production_health = Column(Float)
    waste_health = Column(Float)
    alert_health = Column(Float)

class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    name = Column(String, default="Custom Scenario")
    production_volume_change_pct = Column(Float)
    cleaning_frequency_change = Column(Float)
    energy_efficiency_change_pct = Column(Float)
    packaging_recovery_change_pct = Column(Float)
    recycling_rate_change_pct = Column(Float)
    
    predicted_energy_kwh_pct = Column(Float)
    predicted_waste_qty_pct = Column(Float)
    predicted_recovery_rate_pct = Column(Float)
    predicted_hygiene_risk_pct = Column(Float)
    predicted_carbon_impact_pct = Column(Float)
    predicted_sustainability_score_change = Column(Float)
    ai_explanation = Column(Text)
