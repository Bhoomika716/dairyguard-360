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

    def reset_plant(self, db: Session) -> Dict:
        """
        Resets plant to normal healthy operational baseline state.
        """
        self.incident_active = False
        self.incident_start_time = None

        # Reset machines
        machines = db.query(models.Machine).all()
        for m in machines:
            m.status = "NORMAL"
            m.anomaly_status = "NORMAL"
            m.operating_state = "RUNNING"
            if "Chiller Unit A" in m.name:
                m.current_kw = 38.0
                m.health_score = 94.0
                m.temperature_c = 3.2
            elif "Chiller Unit B" in m.name:
                m.current_kw = 42.0
                m.health_score = 89.0
                m.temperature_c = 3.6
            elif "Pasteurizer 1" in m.name:
                m.current_kw = 45.0
                m.health_score = 96.0
                m.temperature_c = 72.5
            elif "Pasteurizer 2" in m.name:
                m.current_kw = 40.0
                m.health_score = 92.0
                m.temperature_c = 72.1
            elif "Packaging Line 1" in m.name:
                m.current_kw = 28.0
                m.health_score = 95.0
                m.temperature_c = 21.0
            elif "Packaging Line 2" in m.name:
                m.current_kw = 32.0
                m.health_score = 90.0
                m.temperature_c = 21.5

        # Resolve active incident alerts
        open_alerts = db.query(models.Alert).filter(models.Alert.status.in_(["NEW", "OPEN", "ACKNOWLEDGED"])).all()
        for al in open_alerts:
            al.status = "RESOLVED"

        now = datetime.utcnow()
        health = models.PlantHealthScore(
            timestamp=now,
            overall_health=89.0,
            energy_health=88.0,
            hygiene_health=96.0,
            production_health=92.0,
            waste_health=85.0,
            alert_health=95.0
        )
        db.add(health)
        db.commit()

        return {"status": "PLANT_RESET", "message": "Plant telemetry restored to healthy operational baseline state."}

    def trigger_incident(self, db: Session, scenario: str = "general") -> Dict:
        """
        Triggers cascading plant incident timeline or specific scenario.
        """
        self.incident_active = True
        self.incident_start_time = datetime.utcnow()
        now = self.incident_start_time

        if scenario == "energy_spike" or scenario == "general":
            chiller_b = db.query(models.Machine).filter(models.Machine.name.like("%Chiller Unit B%")).first()
            if chiller_b:
                chiller_b.current_kw = 64.5
                chiller_b.status = "HIGH LOAD"
                chiller_b.anomaly_status = "ANOMALY"
                chiller_b.health_score = 54.0
                chiller_b.temperature_c = 8.4
                chiller_b.operating_state = "HIGH LOAD"
                chiller_b.recommended_action = "URGENT: Thermal expansion valve cavitation suspected. Stagger pasteurization load."

            energy_record = models.EnergyReading(
                timestamp=now,
                total_kwh=118.4,
                power_factor=0.88,
                peak_load_kw=145.0,
                refrigeration_load_kwh=64.5,
                cleaning_load_kwh=28.0,
                processing_load_kwh=25.9,
                energy_per_litre=0.0029,
                is_anomaly=True
            )
            db.add(energy_record)

            alert_energy = models.Alert(
                timestamp=now,
                category="Energy",
                severity="CRITICAL",
                title="Chiller Unit B Severe Energy Spike",
                message="Chiller Unit B energy consumption increased +53.5% above baseline (64.5 kW vs 42.0 kW normal).",
                affected_target="Chiller Unit B",
                observed_value="64.5 kW",
                expected_value="42.0 kW",
                deviation="+53.5%",
                recommended_action="Stagger Pasteurizer 2 output by 15 mins to reduce thermal load.",
                status="NEW",
                assigned_to="Plant Manager"
            )
            db.add(alert_energy)

        if scenario == "hygiene_failure" or scenario == "general":
            pkg_floor = db.query(models.Machine).filter(models.Machine.name.like("%Packaging Line 2%")).first()
            if pkg_floor:
                pkg_floor.status = "ATTENTION"
                pkg_floor.health_score = 68.0

            alert_hygiene = models.Alert(
                timestamp=now + timedelta(seconds=3),
                category="Hygiene",
                severity="HIGH",
                title="Missed Sanitation Check — Packaging Floor",
                message="Packaging Floor missed mandatory CIP sanitation check during high-volume batch.",
                affected_target="Packaging Floor",
                observed_value="0 Checks Logged",
                expected_value="1 Check Required",
                deviation="-100%",
                recommended_action="Initiate emergency thermal steam sanitation flush.",
                status="NEW",
                assigned_to="Quality Manager"
            )
            db.add(alert_hygiene)

            violation = models.HygieneViolation(
                timestamp=now,
                zone="Packaging Floor",
                title="Sanitation Temperature & CIP Duration Breach",
                description="Sanitation cycle terminated 8 minutes early with wash fluid temperature missing CIP minimum threshold.",
                severity="HIGH",
                status="OPEN"
            )
            db.add(violation)

        if scenario == "packaging_surge" or scenario == "general":
            center = db.query(models.CollectionCenter).filter(models.CollectionCenter.name.like("%Whitefield%")).first()
            if center:
                center.recovery_percentage = 58.0
                center.status = "BELOW_TARGET"

            alert_waste = models.Alert(
                timestamp=now + timedelta(seconds=6),
                category="Packaging",
                severity="MEDIUM",
                title="Collection Center Bottleneck — Whitefield Hub",
                message="Packaging collection rate dropped to 58% due to transport pickup delay.",
                affected_target="Whitefield Hub",
                observed_value="58%",
                expected_value="85%",
                deviation="-27.0%",
                recommended_action="Dispatch supplementary logistics pickup truck.",
                status="NEW",
                assigned_to="Sustainability Manager"
            )
            db.add(alert_waste)

        insight = models.AIInsight(
            timestamp=now,
            category="⚡ ENERGY & HYGIENE ANOMALY",
            severity="CRITICAL",
            title="Cascading Refrigeration Overload & Hygiene Risk Detected",
            evidence="Chiller Unit B power draw spiked to 64.5 kW (+53.5% above baseline) concurrently with a missed sanitation check on Packaging Floor.",
            possible_cause="High production throughput forced Chiller Unit B to continuous max load while sanitation pumps experienced pressure cavitation.",
            recommended_action="1. Stagger Pasteurizer Line 2 output by 15 mins.\n2. Inspect Chiller B expansion valve.\n3. Perform emergency steam sanitation on Packaging Line 2.",
            confidence_score=0.96
        )
        db.add(insight)

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
            "scenario": scenario,
            "message": f"Plant Incident scenario ({scenario}) triggered successfully. All telemetry updated.",
            "timestamp": now.isoformat()
        }

    def get_incident_timeline(self) -> List[Dict]:
        """
        Returns chronological step events for incident visualization.
        """
        return [
            {"time": "00:00", "event": "Production Demand +25% Spike", "domain": "Production", "severity": "INFO", "status": "COMPLETED"},
            {"time": "00:03", "event": "Chiller Unit B Thermal Load Peak (94%)", "domain": "Energy", "severity": "LOW", "status": "COMPLETED"},
            {"time": "00:06", "event": "Energy Consumption Exceeds Baseline (+53.5%)", "domain": "Energy", "severity": "CRITICAL", "status": "COMPLETED"},
            {"time": "00:09", "event": "Equipment Health Drop on Chiller Unit B (54%)", "domain": "Equipment", "severity": "HIGH", "status": "COMPLETED"},
            {"time": "00:12", "event": "Packaging Floor Missed Sanitation Check", "domain": "Hygiene", "severity": "HIGH", "status": "COMPLETED"},
            {"time": "00:15", "event": "Whitefield Collection Hub Performance Drop (58%)", "domain": "Waste", "severity": "MEDIUM", "status": "COMPLETED"},
            {"time": "00:18", "event": "Plant Health Index Impacted (68.5/100)", "domain": "Sustainability", "severity": "HIGH", "status": "COMPLETED"}
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

