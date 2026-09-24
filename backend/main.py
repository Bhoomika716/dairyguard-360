import os
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
from simulation_engine import simulation_engine
from anomaly_engine import anomaly_engine
from ai_advisor import ai_advisor
from seed import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DairyGuard 360 API",
    description="Backend API for AI-Powered Dairy Plant Energy, Hygiene & Circular Packaging Intelligence Platform",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "platform": "DairyGuard 360",
        "status": "OPERATIONAL",
        "system": "Smart Dairy Command Center",
        "timestamp": datetime.utcnow().isoformat()
    }

# -------------------------------------------------------------------
# 1. EXECUTIVE DASHBOARD OVERVIEW & PLANT HEALTH SCORE
# -------------------------------------------------------------------
@app.get("/api/dashboard")
def get_dashboard_overview(db: Session = Depends(get_db)):
    latest_energy = db.query(models.EnergyReading).order_by(models.EnergyReading.timestamp.desc()).first()
    latest_hygiene = db.query(models.HygieneInspection).order_by(models.HygieneInspection.timestamp.desc()).first()
    latest_score = db.query(models.SustainabilityScore).order_by(models.SustainabilityScore.timestamp.desc()).first()
    latest_health = db.query(models.PlantHealthScore).order_by(models.PlantHealthScore.timestamp.desc()).first()

    energy_readings = db.query(models.EnergyReading).order_by(models.EnergyReading.timestamp.desc()).limit(7).all()
    energy_trend = [r.total_kwh for r in reversed(energy_readings)] if energy_readings else [80, 81, 83, 82, 85, 84, 82.4]

    summary_text = ai_advisor.generate_dashboard_summary(db)

    centers = db.query(models.CollectionCenter).all()
    if centers:
        tot_col = sum(c.collected_today_qty for c in centers)
        tot_tgt = sum(c.daily_target_qty for c in centers)
        pkg_recovery_val = round((tot_col / max(1, tot_tgt)) * 100.0, 1)
    else:
        pkg_recovery_val = 78.2

    line_statuses = [
        {"name": "Production Line A", "status": "NORMAL", "load": "78%", "zone": "Processing"},
        {"name": "Production Line B", "status": "ATTENTION", "load": "92%", "zone": "Processing"},
        {"name": "Packaging Unit 1", "status": "NORMAL", "load": "81%", "zone": "Packaging"},
        {"name": "Chiller Array A", "status": "HIGH LOAD" if (latest_energy and latest_energy.total_kwh > 90) else "NORMAL", "load": "94%" if (latest_energy and latest_energy.total_kwh > 90) else "76%", "zone": "Refrigeration"},
        {"name": "CIP Cleaning Station", "status": "VIOLATION" if simulation_engine.incident_active else "NORMAL", "load": "65%", "zone": "Cleaning"},
        {"name": "Waste Collection Network", "status": "BELOW TARGET" if pkg_recovery_val < 85 else "NORMAL", "load": f"{pkg_recovery_val}%", "zone": "Waste"}
    ]

    kpis = {
        "energy_consumption": {
            "title": "Energy Consumption",
            "value": f"{latest_energy.total_kwh:.1f} MWh" if latest_energy else "82.4 MWh",
            "numeric_value": latest_energy.total_kwh if latest_energy else 82.4,
            "unit": "MWh",
            "previous_value": "79.1 MWh",
            "change_pct": 4.1,
            "status": "ATTENTION" if latest_energy and latest_energy.is_anomaly else "NORMAL",
            "trend": energy_trend
        },
        "energy_efficiency": {
            "title": "Energy Efficiency",
            "value": f"{latest_energy.energy_per_litre:.4f} kWh/L" if latest_energy else "0.0021 kWh/L",
            "numeric_value": latest_energy.energy_per_litre if latest_energy else 0.0021,
            "unit": "kWh/L",
            "previous_value": "0.0017 kWh/L",
            "change_pct": 23.5,
            "status": "CRITICAL" if latest_energy and latest_energy.energy_per_litre > 0.0025 else "ATTENTION",
            "trend": [0.0017, 0.0018, 0.0017, 0.0019, 0.0020, 0.0022, latest_energy.energy_per_litre if latest_energy else 0.0021]
        },
        "hygiene_compliance": {
            "title": "Hygiene Compliance",
            "value": f"{latest_hygiene.overall_score:.1f}%" if latest_hygiene else "94.8%",
            "numeric_value": latest_hygiene.overall_score if latest_hygiene else 94.8,
            "unit": "%",
            "previous_value": "92.4%",
            "change_pct": 2.6,
            "status": "EXCELLENT" if (latest_hygiene and latest_hygiene.overall_score >= 90) else "ATTENTION",
            "trend": [91.0, 92.5, 93.1, 92.0, 94.2, 93.8, latest_hygiene.overall_score if latest_hygiene else 94.8]
        },
        "packaging_recovery": {
            "title": "Packaging Recovery",
            "value": f"{pkg_recovery_val:.1f}%",
            "numeric_value": pkg_recovery_val,
            "unit": "%",
            "previous_value": "72.1%",
            "change_pct": round(pkg_recovery_val - 72.1, 1),
            "status": "ATTENTION" if pkg_recovery_val < 85.0 else "EXCELLENT",
            "trend": [70.0, 71.5, 73.0, 74.2, 76.0, 77.1, pkg_recovery_val]
        },
        "sustainability_score": {
            "title": "Sustainability Score",
            "value": f"{int(latest_score.overall_score)}/100" if latest_score else "87/100",
            "numeric_value": latest_score.overall_score if latest_score else 87.0,
            "unit": "/100",
            "previous_value": "82/100",
            "change_pct": 6.1,
            "status": "EXCELLENT" if (latest_score and latest_score.overall_score > 80) else "ATTENTION",
            "trend": [80, 81, 83, 82, 85, 86, int(latest_score.overall_score) if latest_score else 87]
        },
        "carbon_impact": {
            "title": "Carbon Impact (Simulated Estimate)",
            "value": f"{latest_score.carbon_co2e_tonnes:.2f} t" if latest_score else "1.82 t",
            "numeric_value": latest_score.carbon_co2e_tonnes if latest_score else 1.82,
            "unit": "tonnes CO2e",
            "previous_value": "2.08 t",
            "change_pct": -12.4,
            "status": "EXCELLENT",
            "trend": [2.2, 2.1, 2.0, 1.95, 1.90, 1.85, latest_score.carbon_co2e_tonnes if latest_score else 1.82]
        }
    }

    plant_health = {
        "overall_health": latest_health.overall_health if latest_health else 89.0,
        "energy_health": latest_health.energy_health if latest_health else 82.0,
        "hygiene_health": latest_health.hygiene_health if latest_health else (latest_hygiene.overall_score if latest_hygiene else 94.8),
        "production_health": latest_health.production_health if latest_health else 88.0,
        "waste_health": pkg_recovery_val,
        "alert_health": latest_health.alert_health if latest_health else 85.0
    }

    return {
        "plant_status": "SYSTEM OPERATIONAL" if not simulation_engine.incident_active else "INCIDENT ATTENTION REQUIRED",
        "last_updated": datetime.utcnow().strftime("%H:%M:%S UTC"),
        "ai_summary": summary_text,
        "kpis": kpis,
        "plant_health": plant_health,
        "line_statuses": line_statuses,
        "demo_mode": simulation_engine.is_demo_mode
    }

# -------------------------------------------------------------------
# 2. TOP 3 RISKS & OPPORTUNITIES
# -------------------------------------------------------------------
@app.get("/api/risks-and-opportunities")
def get_risks_and_opportunities(db: Session = Depends(get_db)):
    risks = []

    latest_energy = db.query(models.EnergyReading).order_by(models.EnergyReading.timestamp.desc()).first()
    open_violations = db.query(models.HygieneViolation).filter(models.HygieneViolation.status == "OPEN").all()
    centers = db.query(models.CollectionCenter).all()

    # Risk 1: Energy
    if latest_energy and (latest_energy.is_anomaly or latest_energy.energy_per_litre > 0.0024):
        dev = round(((latest_energy.energy_per_litre - 0.0017) / 0.0017) * 100.0, 1)
        risks.append({
            "id": 1,
            "title": "Refrigeration Array Thermal Overload Spike",
            "severity": "CRITICAL" if latest_energy.energy_per_litre > 0.0027 else "HIGH",
            "domain": "Energy",
            "impact": f"+{dev}% kWh intensity deviation on Chiller Array A.",
            "recommended_action": "Stagger Pasteurizer Line B output by 15 mins to shed peak thermal load."
        })
    else:
        risks.append({
            "id": 1,
            "title": "Chiller Array Peak Thermal Vulnerability",
            "severity": "MEDIUM",
            "domain": "Energy",
            "impact": "Refrigeration represents 45% of daily plant energy draw.",
            "recommended_action": "Schedule CIP thermal cycles outside peak electrical tariff window."
        })

    # Risk 2: Waste / Packaging Collection
    underperforming = [c for c in centers if c.recovery_percentage < 80.0]
    if underperforming:
        worst = min(underperforming, key=lambda c: c.recovery_percentage)
        gap = round(85.0 - worst.recovery_percentage, 1)
        risks.append({
            "id": 2,
            "title": f"Packaging Recovery Below Target at {worst.name}",
            "severity": "HIGH" if worst.recovery_percentage < 65 else "MEDIUM",
            "domain": "Waste",
            "impact": f"Recovery rate sits at {worst.recovery_percentage}% vs target 85.0% (-{gap}% gap).",
            "recommended_action": f"Deploy logistics pickup to clear consumer drop box bottleneck at {worst.name}."
        })
    else:
        risks.append({
            "id": 2,
            "title": "Packaging Recovery Logistics Bottleneck",
            "severity": "LOW",
            "domain": "Waste",
            "impact": "Weekend consumer return spikes risk kiosk overflow.",
            "recommended_action": "Increase collection center pickup frequency on Saturdays."
        })

    # Risk 3: Hygiene
    if open_violations:
        v = open_violations[0]
        risks.append({
            "id": 3,
            "title": f"{v.zone} Hygiene Breach: {v.title}",
            "severity": v.severity,
            "domain": "Hygiene",
            "impact": v.description,
            "recommended_action": "Perform steam sterilization flush and complete corrective action."
        })
    else:
        risks.append({
            "id": 3,
            "title": "Filler Nozzle 3 Sanitation ATP Warning",
            "severity": "LOW",
            "domain": "Hygiene",
            "impact": "Swab ATP count reached 12 RLU (Approaching 15 RLU limit).",
            "recommended_action": "Perform preventative steam flush and inspect nozzle gasket seal."
        })

    opportunities = [
        {
            "id": 1,
            "title": "Optimize Chiller Array Thermal Schedule",
            "domain": "Energy",
            "potential_saving": "8.4% kWh Reduction",
            "description": "Shift CIP wash cycles away from 14:00-16:00 peak electrical tariff window."
        },
        {
            "id": 2,
            "title": "Expand Consumer Eco Reward Partner Outlets",
            "domain": "Waste",
            "potential_saving": "+11.0% Recovery Rate",
            "description": "Add 20 supermarket drop-off kiosks in high-density residential hubs."
        },
        {
            "id": 3,
            "title": "Stagger Pasteurization Batch Runs",
            "domain": "Operations",
            "potential_saving": "4.7% Energy intensity reduction",
            "description": "Smooth out thermal spikes between Line A and Line B."
        }
    ]

    return {"top_risks": risks, "top_opportunities": opportunities}

# -------------------------------------------------------------------
# 3. ENERGY INTELLIGENCE & ANOMALIES
# -------------------------------------------------------------------
@app.get("/api/energy")
def get_energy_intelligence(db: Session = Depends(get_db)):
    readings = db.query(models.EnergyReading).order_by(models.EnergyReading.timestamp.desc()).limit(30).all()
    readings_data = [
        {
            "id": r.id,
            "timestamp": r.timestamp.strftime("%b %d, %H:%M"),
            "total_kwh": r.total_kwh,
            "power_factor": r.power_factor,
            "peak_load_kw": r.peak_load_kw,
            "refrigeration_load_kwh": r.refrigeration_load_kwh,
            "cleaning_load_kwh": r.cleaning_load_kwh,
            "processing_load_kwh": r.processing_load_kwh,
            "energy_per_litre": r.energy_per_litre,
            "is_anomaly": r.is_anomaly
        }
        for r in reversed(readings)
    ]

    machines = db.query(models.Machine).all()
    machine_breakdown = [
        {"name": m.name, "zone": m.zone, "status": m.status, "power_kw": m.power_rating_kw, "share_pct": round((m.power_rating_kw/320.0)*100, 1)}
        for m in machines
    ]

    latest = readings[0] if readings else None

    return {
        "current_efficiency_kwh_l": latest.energy_per_litre if latest else 0.0021,
        "target_efficiency_kwh_l": 0.0017,
        "efficiency_deviation_pct": round(((latest.energy_per_litre - 0.0017)/0.0017)*100, 1) if latest else 23.5,
        "efficiency_status": "ATTENTION" if (latest and latest.energy_per_litre > 0.0020) else "NORMAL",
        "readings": readings_data,
        "machine_breakdown": machine_breakdown
    }

# -------------------------------------------------------------------
# 4. HYGIENE & COMPLIANCE
# -------------------------------------------------------------------
@app.get("/api/hygiene")
def get_hygiene_module(db: Session = Depends(get_db)):
    latest_insp = db.query(models.HygieneInspection).order_by(models.HygieneInspection.timestamp.desc()).first()
    checklists = db.query(models.HygieneChecklist).all()

    open_violations_count = db.query(models.HygieneViolation).filter(models.HygieneViolation.status != "RESOLVED").count()
    risk_score = min(100, (open_violations_count * 15) + (100 - (latest_insp.overall_score if latest_insp else 94.8)))

    heatmap_zones = [
        {"id": "processing", "name": "PROCESSING AREA", "status": "NORMAL", "risk": "LOW", "score": 96.2, "failed_checks": 0},
        {"id": "packaging", "name": "PACKAGING AREA", "status": "ATTENTION", "risk": "MEDIUM", "score": 88.5, "failed_checks": 1},
        {"id": "storage", "name": "STORAGE VAULT", "status": "NORMAL", "risk": "LOW", "score": 98.0, "failed_checks": 0},
        {"id": "cleaning", "name": "CLEANING AREA", "status": "VIOLATION" if simulation_engine.incident_active else "ATTENTION", "risk": "HIGH", "score": 78.4 if simulation_engine.incident_active else 86.0, "failed_checks": 2}
    ]

    return {
        "overall_hygiene_score": latest_insp.overall_score if latest_insp else 94.8,
        "digital_hygiene_risk": round(risk_score, 1),
        "risk_level": "LOW" if risk_score < 25 else ("MEDIUM" if risk_score < 50 else "HIGH"),
        "heatmap_zones": heatmap_zones,
        "checklists": [
            {"id": c.id, "item_name": c.item_name, "status": c.status, "notes": c.notes}
            for c in checklists
        ]
    }

# -------------------------------------------------------------------
# 5. PACKAGING WASTE & COLLECTION CENTER EXPLANATIONS
# -------------------------------------------------------------------
@app.get("/api/waste")
def get_packaging_waste(db: Session = Depends(get_db)):
    returns = db.query(models.ConsumerReturn).order_by(models.ConsumerReturn.timestamp.desc()).limit(10).all()
    centers = db.query(models.CollectionCenter).all()

    if centers:
        tot_col = sum(c.collected_today_qty for c in centers)
        tot_tgt = sum(c.daily_target_qty for c in centers)
        recovery_rate = (tot_col / max(1, tot_tgt)) * 100.0
    else:
        tot_col = 35190
        tot_tgt = 45000
        recovery_rate = 78.2

    total_produced = 450000
    total_recovered = int(total_produced * (recovery_rate / 100.0))
    total_co2e_kg = sum(r.co2e_avoided_kg for r in db.query(models.ConsumerReturn).all()) if db.query(models.ConsumerReturn).first() else 5420.0
    co2e_avoided_tonnes = round(max(5.42, total_co2e_kg / 1000.0), 2)

    return {
        "recovery_rate_pct": round(recovery_rate, 1),
        "target_rate_pct": 85.0,
        "gap_pct": round(85.0 - recovery_rate, 1),
        "packaging_produced_units": total_produced,
        "packaging_sold_units": 442000,
        "packaging_returned_units": total_recovered,
        "co2e_avoided_tonnes": co2e_avoided_tonnes,
        "recent_consumer_returns": [
            {
                "id": r.id,
                "consumer": r.consumer_name,
                "packaging_id": r.packaging_id,
                "type": r.packaging_type,
                "quantity": r.quantity,
                "center": r.collection_center,
                "points": r.reward_points_earned,
                "co2e_avoided_kg": r.co2e_avoided_kg,
                "timestamp": r.timestamp.strftime("%b %d, %H:%M")
            }
            for r in returns
        ]
    }

@app.get("/api/waste/collection-centers")
def get_collection_centers(db: Session = Depends(get_db)):
    centers = db.query(models.CollectionCenter).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "code": c.code,
            "daily_target": c.daily_target_qty,
            "collected_today": c.collected_today_qty,
            "recovery_pct": c.recovery_percentage,
            "consumer_participants": c.consumer_participation_count,
            "status": c.status
        }
        for c in centers
    ]

@app.get("/api/waste/collection-centers/{center_id}/explanation")
def get_center_explanation(center_id: int, db: Session = Depends(get_db)):
    center = db.query(models.CollectionCenter).filter(models.CollectionCenter.id == center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")

    return {
        "center_name": center.name,
        "recovery_percentage": center.recovery_percentage,
        "target_percentage": 85.0,
        "status": center.status,
        "ai_explanation": f"{center.name} is currently performing at {center.recovery_percentage}% against the 85% target. Primary bottleneck: Pickup transport frequency lag during peak weekend consumer return hours.",
        "recommended_actions": [
            "1. Deploy double pickup frequency on Saturdays between 16:00 and 19:00.",
            "2. Add smart bin fill-level sensors to alert logistics before overflow occurs.",
            "3. Partner with local retail supermarkets for additional return kiosks."
        ]
    }

@app.post("/api/consumer/returns")
def submit_consumer_return(payload: schemas.ConsumerReturnCreateSchema, db: Session = Depends(get_db)):
    weight_grams = payload.quantity * (12.0 if "Pouch" in payload.packaging_type else (42.0 if "Bottle" in payload.packaging_type else 300.0))
    points = payload.quantity * 5
    co2e_kg = round((weight_grams / 1000.0) * 1.5, 2)

    ret = models.ConsumerReturn(
        consumer_name=payload.consumer_name,
        packaging_id=payload.packaging_id,
        packaging_type=payload.packaging_type,
        quantity=payload.quantity,
        weight_grams=weight_grams,
        collection_center=payload.collection_center,
        reward_points_earned=points,
        co2e_avoided_kg=co2e_kg
    )
    db.add(ret)
    
    center = db.query(models.CollectionCenter).filter(models.CollectionCenter.name.like(f"%{payload.collection_center}%")).first()
    if center:
        center.collected_today_qty += payload.quantity
        center.consumer_participation_count += 1
        center.recovery_percentage = min(100.0, round((center.collected_today_qty / center.daily_target_qty) * 100, 1))

    db.commit()
    db.refresh(ret)

    return {
        "status": "SUCCESS",
        "message": f"{payload.quantity} packaging units successfully registered.",
        "return_id": ret.id,
        "weight_diverted_grams": weight_grams,
        "points_earned": points,
        "co2e_avoided_kg": co2e_kg
    }

# -------------------------------------------------------------------
# 6. DIGITAL TWIN PIPELINE TELEMETRY
# -------------------------------------------------------------------
@app.get("/api/digital-twin")
def get_digital_twin_telemetry(db: Session = Depends(get_db)):
    latest_energy = db.query(models.EnergyReading).order_by(models.EnergyReading.timestamp.desc()).first()

    nodes = [
        {
            "id": "production",
            "title": "Raw Intake & Pasteurization",
            "status": "NORMAL",
            "telemetry": {"Volume": "42,500 L/day", "Temp": "72.5 °C", "Flow": "1,850 L/h", "Status": "Normal"}
        },
        {
            "id": "processing",
            "title": "Processing & Homogenization",
            "status": "NORMAL",
            "telemetry": {"Pressure": "180 Bar", "Energy": "25.0 kWh", "Efficiency": "98%", "Status": "Normal"}
        },
        {
            "id": "cleaning",
            "title": "CIP Cleaning Station",
            "status": "VIOLATION" if simulation_engine.incident_active else "NORMAL",
            "telemetry": {"CIP Load": "31.4 kWh", "Wash Temp": "14.2 °C" if simulation_engine.incident_active else "82.0 °C", "Sanitation": "FAIL" if simulation_engine.incident_active else "PASS"}
        },
        {
            "id": "packaging",
            "title": "Packaging Rigs",
            "status": "NORMAL",
            "telemetry": {"Pouch Line Rate": "4,200/h", "Bottle Line": "1,800/h", "Defect Rate": "0.04%", "Status": "Normal"}
        },
        {
            "id": "refrigeration",
            "title": "Cold Storage & Refrigeration Array",
            "status": "HIGH LOAD" if (latest_energy and latest_energy.total_kwh > 90) else "ATTENTION",
            "telemetry": {"Energy": f"{latest_energy.refrigeration_load_kwh if latest_energy else 62.0:.1f} kWh", "Load": "94%", "Cold Vault Temp": "3.8 °C", "Status": "High Thermal Load"}
        },
        {
            "id": "distribution",
            "title": "Fleet Distribution",
            "status": "NORMAL",
            "telemetry": {"Active Trucks": "14 Units", "Cold Chain Compliance": "99.2%", "Status": "Normal"}
        },
        {
            "id": "consumer",
            "title": "Consumer Retail & Return Touchpoints",
            "status": "NORMAL",
            "telemetry": {"Active Retailers": "185 Outlets", "Return Scans Today": "1,420 Units", "Status": "Active"}
        },
        {
            "id": "collection",
            "title": "Collection Center Network",
            "status": "BELOW TARGET",
            "telemetry": {"Active Hubs": "4 Centers", "Recovery Rate": "78.2%", "Target Gap": "-6.8%", "Status": "Below Target"}
        },
        {
            "id": "recycling",
            "title": "Circular Polymer Recycling Facility",
            "status": "NORMAL",
            "telemetry": {"Pelletization Output": "4.2 Tonnes/wk", "Material Quality": "Grade A rHDPE", "Status": "Circular Processed"}
        }
    ]

    return {
        "plant_name": "Alpha Dairy Command Center",
        "digital_twin_status": "SYNCHRONIZED",
        "incident_active": simulation_engine.incident_active,
        "nodes": nodes
    }

# -------------------------------------------------------------------
# 7. WHAT-IF SUSTAINABILITY SIMULATOR & SAVED SCENARIOS
# -------------------------------------------------------------------
@app.post("/api/simulations")
def run_whatif_simulation(params: schemas.SimulationRequestSchema, db: Session = Depends(get_db)):
    prod_pct = params.production_volume_change_pct
    clean_pct = params.cleaning_frequency_change
    eff_pct = params.energy_efficiency_change_pct
    rec_pct = params.packaging_recovery_change_pct
    recy_pct = params.recycling_rate_change_pct

    pred_energy_pct = (prod_pct * 0.75) + (clean_pct * 4.0) - (eff_pct * 0.9)
    pred_waste_pct = prod_pct * 0.95
    pred_recovery_rate_pct = rec_pct * 1.1
    pred_hygiene_risk_pct = -(clean_pct * 8.0) + (prod_pct * 0.15)
    pred_carbon_pct = (pred_energy_pct * 0.4) - (rec_pct * 0.6) - (recy_pct * 0.3)
    pred_score_change = (-pred_energy_pct * 0.15) + (rec_pct * 0.25) + (clean_pct * 1.5)

    explanation = (
        f"Increasing production by {prod_pct:+.1f}% raises baseline energy demand by {pred_energy_pct:+.1f}% and packaging volume by {pred_waste_pct:+.1f}%. "
        f"However, boosting packaging recovery by {rec_pct:+.1f}% and adding {clean_pct:.0f} cleaning cycle/day offsets environmental impact, resulting in a net carbon change of {pred_carbon_pct:+.1f}% and a Sustainability Score change of {pred_score_change:+.1f} points."
    )

    current_metrics = {
        "energy_kwh": 82.4,
        "packaging_waste_kg": 540.0,
        "recovery_rate_pct": 78.2,
        "hygiene_risk_score": 18.0,
        "carbon_co2e_tonnes": 1.82,
        "sustainability_score": 87.0
    }

    simulated_metrics = {
        "energy_kwh": round(82.4 * (1 + pred_energy_pct/100.0), 1),
        "packaging_waste_kg": round(540.0 * (1 + pred_waste_pct/100.0), 1),
        "recovery_rate_pct": round(min(100.0, 78.2 + pred_recovery_rate_pct), 1),
        "hygiene_risk_score": round(max(0.0, 18.0 + pred_hygiene_risk_pct), 1),
        "carbon_co2e_tonnes": round(max(0.0, 1.82 * (1 + pred_carbon_pct/100.0)), 2),
        "sustainability_score": round(min(100.0, max(0.0, 87.0 + pred_score_change)), 1)
    }

    return {
        "predicted_energy_kwh_pct": round(pred_energy_pct, 1),
        "predicted_waste_qty_pct": round(pred_waste_pct, 1),
        "predicted_recovery_rate_pct": round(pred_recovery_rate_pct, 1),
        "predicted_hygiene_risk_pct": round(pred_hygiene_risk_pct, 1),
        "predicted_carbon_impact_pct": round(pred_carbon_pct, 1),
        "predicted_sustainability_score_change": round(pred_score_change, 1),
        "ai_explanation": explanation,
        "current_metrics": current_metrics,
        "simulated_metrics": simulated_metrics
    }

@app.post("/api/simulations/save")
def save_simulation_scenario(params: schemas.SimulationRequestSchema, db: Session = Depends(get_db)):
    res = run_whatif_simulation(params, db)
    scenario = models.SimulationScenario(
        name=f"Scenario (Prod {params.production_volume_change_pct:+}%, Rec {params.packaging_recovery_change_pct:+}%)",
        production_volume_change_pct=params.production_volume_change_pct,
        cleaning_frequency_change=params.cleaning_frequency_change,
        energy_efficiency_change_pct=params.energy_efficiency_change_pct,
        packaging_recovery_change_pct=params.packaging_recovery_change_pct,
        recycling_rate_change_pct=params.recycling_rate_change_pct,
        predicted_energy_kwh_pct=res["predicted_energy_kwh_pct"],
        predicted_waste_qty_pct=res["predicted_waste_qty_pct"],
        predicted_recovery_rate_pct=res["predicted_recovery_rate_pct"],
        predicted_hygiene_risk_pct=res["predicted_hygiene_risk_pct"],
        predicted_carbon_impact_pct=res["predicted_carbon_impact_pct"],
        predicted_sustainability_score_change=res["predicted_sustainability_score_change"],
        ai_explanation=res["ai_explanation"]
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    return {"status": "SUCCESS", "scenario_id": scenario.id, "name": scenario.name}

@app.get("/api/simulations/saved")
def get_saved_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(models.SimulationScenario).order_by(models.SimulationScenario.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "created_at": s.created_at.strftime("%b %d, %H:%M"),
            "prod_change": s.production_volume_change_pct,
            "recovery_change": s.packaging_recovery_change_pct,
            "score_change": s.predicted_sustainability_score_change,
            "ai_explanation": s.ai_explanation
        }
        for s in scenarios
    ]

# -------------------------------------------------------------------
# 8. INCIDENT TIMELINE & ROOT CAUSE ANALYSIS
# -------------------------------------------------------------------
@app.get("/api/incident/timeline")
def get_incident_timeline():
    return simulation_engine.get_incident_timeline()

@app.get("/api/incident/root-cause")
def get_root_cause_analysis(db: Session = Depends(get_db)):
    return ai_advisor.generate_root_cause_analysis(db)

# -------------------------------------------------------------------
# 9. AI PLANT ADVISOR ASSISTANT
# -------------------------------------------------------------------
@app.post("/api/ai/ask")
def ask_ai_advisor(payload: schemas.AIQuestionSchema, db: Session = Depends(get_db)):
    return ai_advisor.answer_question(payload.question, db)

# -------------------------------------------------------------------
# 10. ALERTS & INSIGHTS
# -------------------------------------------------------------------
@app.get("/api/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    insights = db.query(models.AIInsight).order_by(models.AIInsight.timestamp.desc()).all()
    return [
        {
            "id": i.id,
            "category": i.category,
            "severity": i.severity,
            "title": i.title,
            "evidence": i.evidence,
            "possible_cause": i.possible_cause,
            "recommended_action": i.recommended_action,
            "confidence_score": i.confidence_score,
            "timestamp": i.timestamp.strftime("%b %d, %H:%M")
        }
        for i in insights
    ]

@app.get("/api/alerts")
def get_alerts(severity: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Alert).order_by(models.Alert.timestamp.desc())
    if severity and severity != 'ALL':
        query = query.filter(models.Alert.severity == severity.upper())
    alerts = query.all()
    return [
        {
            "id": a.id,
            "category": a.category,
            "severity": a.severity,
            "title": a.title,
            "message": a.message,
            "observed_value": a.observed_value,
            "expected_value": a.expected_value,
            "deviation": a.deviation,
            "status": a.status,
            "assigned_to": a.assigned_to,
            "timestamp": a.timestamp.strftime("%b %d, %H:%M")
        }
        for a in alerts
    ]

@app.post("/api/alerts/action")
def take_alert_action(payload: schemas.AlertActionSchema, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == payload.alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    if payload.action == "ACKNOWLEDGE":
        alert.status = "ACKNOWLEDGED"
    elif payload.action == "ASSIGN":
        alert.status = "ASSIGNED"
        if payload.assigned_to:
            alert.assigned_to = payload.assigned_to
    elif payload.action == "RESOLVE":
        alert.status = "RESOLVED"
    db.commit()
    return {"status": "SUCCESS", "alert_id": alert.id, "new_status": alert.status}

# -------------------------------------------------------------------
# 11. DEMO MODE & SIMULATION TICKS
# -------------------------------------------------------------------
@app.post("/api/demo/mode")
def toggle_demo_mode(enabled: bool = Query(...)):
    res = simulation_engine.toggle_demo_mode(enabled)
    return {"demo_mode": res, "message": f"Demo mode {'enabled' if res else 'disabled'}"}

@app.post("/api/demo/trigger-incident")
def trigger_plant_incident(db: Session = Depends(get_db)):
    return simulation_engine.trigger_incident(db)

@app.post("/api/simulation/tick")
def trigger_simulated_tick(db: Session = Depends(get_db)):
    return simulation_engine.generate_tick_data(db)

@app.get("/api/reports")
def generate_report(report_type: str = "daily", db: Session = Depends(get_db)):
    return {
        "report_title": f"{report_type.capitalize()} Sustainability & Operations Report",
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "plant": "Alpha Dairy Plant - Sector 4",
        "summary": {
            "total_production_litres": 42500,
            "total_energy_mwh": 82.4,
            "avg_hygiene_score": 94.8,
            "packaging_recovery_rate": 78.2,
            "overall_sustainability_score": 87,
            "carbon_avoided_tonnes": 5.42
        },
        "top_ai_recommendation": "Optimize Chiller Array expansion valves and schedule high-volume packaging runs during off-peak tariff hours."
    }
