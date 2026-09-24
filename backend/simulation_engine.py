import random
from datetime import datetime, timedelta
from typing import Dict, List
from sqlalchemy.orm import Session
import models
from anomaly_engine import anomaly_engine

class SimulationEngine:
    def __init__(self):
        self.is_demo_mode = False
        self.incident_active = False
        self.incident_start_time = None
        self.tick_count = 0
        self.guided_demo_step = 0

    def toggle_demo_mode(self, enabled: bool) -> bool:
        self.is_demo_mode = enabled
        return self.is_demo_mode

    def trigger_incident(self, db: Session) -> Dict:
        """
        Triggers a cascading plant incident timeline:
        00:00 Production demand +25%
        00:03 Refrigeration load +45%
        00:06 Energy consumption exceeds baseline (+52.8%)
        00:09 AI Anomaly Detector triggered
        00:12 Packaging waste generation spikes
        00:15 Collection center performance drops (61%)
        00:18 Sustainability score & Plant Health drop
        """
        self.incident_active = True
        self.incident_start_time = datetime.utcnow()
        now = self.incident_start_time

        # 1. Create Anomaly Energy Reading
        energy_record = models.EnergyReading(
            timestamp=now,
            total_kwh=118.4,
            power_factor=0.88,
            peak_load_kw=145.0,
            refrigeration_load_kwh=62.0,
            cleaning_load_kwh=31.4,
            processing_load_kwh=25.0,
            energy_per_litre=0.0029,
            is_anomaly=True
        )
        db.add(energy_record)

        # 2. Update Machines
        chiller = db.query(models.Machine).filter(models.Machine.name.like("%Chiller%")).first()
        if chiller:
            chiller.status = "HIGH LOAD"

        cleaning_rig = db.query(models.Machine).filter(models.Machine.zone == "Cleaning Area").first()
        if cleaning_rig:
            cleaning_rig.status = "VIOLATION"

        # 3. Create Critical Alerts
        alert_energy = models.Alert(
            timestamp=now,
            category="Energy",
            severity="CRITICAL",
            title="Severe Energy Anomaly Detected",
            message="Energy consumption increased by +52.8% faster than production output. Refrigeration array thermal overload suspected.",
            observed_value="118.4 kWh",
            expected_value="77.5 kWh",
            deviation="+52.8%",
            status="OPEN",
            assigned_to="Plant Manager"
        )
        db.add(alert_energy)

        alert_hygiene = models.Alert(
            timestamp=now + timedelta(seconds=3),
            category="Hygiene",
            severity="HIGH",
            title="Cleaning Cycle Bypass & Temperature Log Deviation",
            message="Cleaning Area recorded incomplete sanitation cycle during high-volume production batch.",
            observed_value="Temp: 14.2°C",
            expected_value="Temp: <4.0°C",
            deviation="+10.2°C",
            status="OPEN",
            assigned_to="QA Lead"
        )
        db.add(alert_hygiene)

        alert_waste = models.Alert(
            timestamp=now + timedelta(seconds=6),
            category="Waste",
            severity="MEDIUM",
            title="Collection Center Bottleneck - Whitefield Hub",
            message="Packaging collection rate dropped to 61% due to logistics transport delay.",
            observed_value="61%",
            expected_value="85%",
            deviation="-24.0%",
            status="OPEN",
            assigned_to="Sustainability Officer"
        )
        db.add(alert_waste)

        # 4. Create AI Insights
        insight = models.AIInsight(
            timestamp=now,
            category="⚡ ENERGY ANOMALY",
            severity="CRITICAL",
            title="Cascading Refrigeration Overload & Hygiene Risk Detected",
            evidence="Energy consumption spiked to 118.4 kWh (+52.8% above baseline) concurrently with a temperature drift to 14.2°C in the Cleaning Area.",
            possible_cause="High production throughput forced Chiller Array A to continuous max load while sanitation pumps experienced pressure cavitation.",
            recommended_action="1. Stagger Pasteurizer Line B output by 15 mins.\n2. Inspect Chiller A expansion valve.\n3. Re-run sanitation cycle on Cleaning Rig 1.",
            confidence_score=0.96
        )
        db.add(insight)

        # 5. Create Hygiene Violation
        violation = models.HygieneViolation(
            timestamp=now,
            zone="Cleaning Area",
            title="Sanitation Temperature & CIP Duration Breach",
            description="Sanitation cycle terminated 8 minutes early with wash fluid temperature missing CIP minimum threshold.",
            severity="HIGH",
            status="OPEN"
        )
        db.add(violation)
        db.flush()

        action = models.CorrectiveAction(
            violation_id=violation.id,
            issue="CIP Sanitation Cycle Pressure & Temperature Drop",
            area="Cleaning Area",
            severity="HIGH",
            assigned_to="Rajesh Kumar (Hygiene Tech)",
            due_date=now + timedelta(hours=4),
            status="OPEN",
            resolution=None
        )
        db.add(action)

        # 6. Recalculate Sustainability & Plant Health Scores
        score = models.SustainabilityScore(
            timestamp=now,
            overall_score=72.4,
            energy_score=64.0,
            hygiene_score=71.0,
            waste_score=76.2,
            operations_score=85.0,
            carbon_co2e_tonnes=2.15
        )
        db.add(score)

        health = models.PlantHealthScore(
            timestamp=now,
            overall_health=68.5,
            energy_health=60.0,
            hygiene_health=65.0,
            production_health=82.0,
            waste_health=72.0,
            alert_health=55.0
        )
        db.add(health)

        db.commit()

        return {
            "status": "INCIDENT_TRIGGERED",
            "message": "Cascading Plant Incident initiated: High Production -> Energy Spike -> Refrigeration Overload -> Hygiene Breach -> Waste Drop",
            "timestamp": now.isoformat()
        }

    def get_incident_timeline(self) -> List[Dict]:
        """
        Returns chronological step events for incident visualization.
        """
        return [
            {"time": "00:00", "event": "Production Demand +25% Spike", "domain": "Production", "severity": "INFO", "status": "COMPLETED"},
            {"time": "00:03", "event": "Chiller Array A Thermal Load Peak (94%)", "domain": "Energy", "severity": "LOW", "status": "COMPLETED"},
            {"time": "00:06", "event": "Energy Consumption Exceeds Baseline (+52.8%)", "domain": "Energy", "severity": "CRITICAL", "status": "COMPLETED"},
            {"time": "00:09", "event": "ML IsolationForest Anomaly Triggered", "domain": "AI Intelligence", "severity": "HIGH", "status": "COMPLETED"},
            {"time": "00:12", "event": "Packaging Area Sanitation Temp Log Breach (14.2°C)", "domain": "Hygiene", "severity": "HIGH", "status": "COMPLETED"},
            {"time": "00:15", "event": "Whitefield Collection Hub Performance Drop (61%)", "domain": "Waste", "severity": "MEDIUM", "status": "COMPLETED"},
            {"time": "00:18", "event": "Plant Health Score Impacted (-18.5 pts)", "domain": "Sustainability", "severity": "HIGH", "status": "COMPLETED"}
        ]

    def generate_tick_data(self, db: Session) -> Dict:
        """
        Calculates connected physical data chain:
        Higher Production -> Higher Energy & Packaging -> Higher Cleaning Demand -> Higher Waste -> Score Adjustments
        """
        self.tick_count += 1
        now = datetime.utcnow()

        base_production = 42500.0 + random.uniform(-200, 300)
        base_kwh_per_l = 0.0017 + random.uniform(-0.0001, 0.0002)

        if (self.tick_count % 15 == 0) and not self.incident_active:
            base_kwh_per_l *= 1.25

        total_kwh = (base_production * base_kwh_per_l) + random.uniform(0.5, 2.0)
        refrig_kwh = total_kwh * 0.45
        clean_kwh = total_kwh * 0.25
        proc_kwh = total_kwh * 0.30

        anom_res = anomaly_engine.detect_energy_anomaly(base_production, total_kwh)

        # Connected Physics Calculations
        hygiene_score_val = 94.8 - (2.5 if anom_res["is_anomaly"] else 0.0)
        packaging_recovery_val = 78.2 + random.uniform(-0.5, 0.5)

        # Dynamic Sustainability & Health Scores
        sust_val = max(50.0, min(100.0, 100.0 - ((total_kwh / base_production - 0.0017) * 25000) - (100 - hygiene_score_val) * 0.5 - (85.0 - packaging_recovery_val) * 0.8))
        health_val = max(40.0, min(100.0, (sust_val * 0.5) + (hygiene_score_val * 0.3) + (85.0 if not anom_res["is_anomaly"] else 60.0) * 0.2))

        energy_entry = models.EnergyReading(
            timestamp=now,
            total_kwh=round(total_kwh, 2),
            power_factor=round(random.uniform(0.92, 0.98), 2),
            peak_load_kw=round(total_kwh * 1.3, 1),
            refrigeration_load_kwh=round(refrig_kwh, 2),
            cleaning_load_kwh=round(clean_kwh, 2),
            processing_load_kwh=round(proc_kwh, 2),
            energy_per_litre=round(total_kwh / base_production, 4),
            is_anomaly=anom_res["is_anomaly"]
        )
        db.add(energy_entry)

        prod_entry = models.ProductionRecord(
            timestamp=now,
            line_name="Production Line A",
            volume_litres=round(base_production, 1),
            batch_number=f"BATCH-202609-{self.tick_count:04d}",
            status="NORMAL" if not anom_res["is_anomaly"] else "ATTENTION"
        )
        db.add(prod_entry)

        sust_entry = models.SustainabilityScore(
            timestamp=now,
            overall_score=round(sust_val, 1),
            energy_score=round(81.0 if not anom_res["is_anomaly"] else 64.0, 1),
            hygiene_score=round(hygiene_score_val, 1),
            waste_score=round(packaging_recovery_val, 1),
            operations_score=91.0,
            carbon_co2e_tonnes=round(1.82 + (0.2 if anom_res["is_anomaly"] else 0.0), 2)
        )
        db.add(sust_entry)

        health_entry = models.PlantHealthScore(
            timestamp=now,
            overall_health=round(health_val, 1),
            energy_health=round(82.0 if not anom_res["is_anomaly"] else 60.0, 1),
            hygiene_health=round(hygiene_score_val, 1),
            production_health=88.0,
            waste_health=round(packaging_recovery_val, 1),
            alert_health=85.0 if not anom_res["is_anomaly"] else 55.0
        )
        db.add(health_entry)

        db.commit()

        return {
            "tick": self.tick_count,
            "timestamp": now.isoformat(),
            "production_litres": round(base_production, 1),
            "total_kwh": round(total_kwh, 2),
            "sustainability_score": round(sust_val, 1),
            "plant_health_score": round(health_val, 1),
            "is_anomaly": anom_res["is_anomaly"],
            "demo_mode": self.is_demo_mode
        }

simulation_engine = SimulationEngine()
