import random
from datetime import datetime, timedelta
from database import engine, SessionLocal, Base
import models

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding DairyGuard 360 Database...")

        # 1. Plant Record
        plant = models.Plant(
            name="Alpha Dairy Plant - Sector 4",
            code="PLANT-IND-01",
            location="Bengaluru Industrial Hub",
            daily_capacity_litres=50000.0
        )
        db.add(plant)

        # 2. Machines (6 Major Plant Equipment)
        machines_data = [
            ("Chiller Unit A", "CHILL-A", "Refrigeration", "NORMAL", 38.0, 38.0, 38.0, 94.0, "RUNNING", "NORMAL", 3.2, "2026-09-12", "Normal operation; schedule oil filter check"),
            ("Chiller Unit B", "CHILL-B", "Refrigeration", "NORMAL", 42.0, 42.0, 42.0, 89.0, "RUNNING", "NORMAL", 3.6, "2026-09-10", "Monitor thermal expansion valve pressure"),
            ("Pasteurizer 1", "PAST-1", "Pasteurization Hall", "NORMAL", 45.0, 45.0, 45.0, 96.0, "RUNNING", "NORMAL", 72.5, "2026-09-15", "Optimal holding temp maintained"),
            ("Pasteurizer 2", "PAST-2", "Pasteurization Hall", "NORMAL", 40.0, 40.0, 40.0, 92.0, "RUNNING", "NORMAL", 72.1, "2026-09-14", "Clean holding tubes on next maintenance window"),
            ("Packaging Line 1", "PKG-1", "Packaging Floor", "NORMAL", 28.0, 28.0, 28.0, 95.0, "RUNNING", "NORMAL", 21.0, "2026-09-18", "Form-fill-seal sealer blades calibrated"),
            ("Packaging Line 2", "PKG-2", "Packaging Floor", "NORMAL", 32.0, 32.0, 32.0, 90.0, "RUNNING", "NORMAL", 21.5, "2026-09-16", "Inspect pouch alignment sensor")
        ]
        machines = []
        for name, code, zone, status, p_rating, c_kw, n_kw, health, op_st, anom_st, temp, maint, rec_act in machines_data:
            m = models.Machine(
                name=name, code=code, zone=zone, status=status,
                power_rating_kw=p_rating, current_kw=c_kw, normal_kw=n_kw,
                health_score=health, operating_state=op_st, anomaly_status=anom_st,
                temperature_c=temp, last_maintenance=maint, recommended_action=rec_act
            )
            db.add(m)
            machines.append(m)
        db.flush()

        # 3. 30 Days of Historical Correlated Data (Hourly points)
        start_time = datetime.utcnow() - timedelta(days=30)
        
        for day in range(30):
            current_date = start_time + timedelta(days=day)
            daily_prod_volume = random.uniform(38000, 48000) # litres
            
            # Base efficiency (kWh per litre)
            base_kwh_l = 0.0021 + random.uniform(-0.0002, 0.0003)
            
            # Day 18 anomaly
            if day == 18:
                base_kwh_l = 0.0029 # Energy anomaly day!

            total_daily_energy = daily_prod_volume * base_kwh_l

            # Energy Reading
            energy_entry = models.EnergyReading(
                timestamp=current_date,
                machine_id=machines[1].id,
                total_kwh=round(total_daily_energy, 2),
                power_factor=round(random.uniform(0.93, 0.97), 2),
                peak_load_kw=round(total_daily_energy * 0.05, 1),
                refrigeration_load_kwh=round(total_daily_energy * 0.45, 2),
                cleaning_load_kwh=round(total_daily_energy * 0.25, 2),
                processing_load_kwh=round(total_daily_energy * 0.30, 2),
                energy_per_litre=round(base_kwh_l, 4),
                is_anomaly=(day == 18)
            )
            db.add(energy_entry)

            # Production Record
            prod_entry = models.ProductionRecord(
                timestamp=current_date,
                line_name="Production Line A",
                volume_litres=round(daily_prod_volume, 1),
                batch_number=f"BATCH-2026-D{day:02d}",
                status="NORMAL" if day != 18 else "ATTENTION"
            )
            db.add(prod_entry)

            # Hygiene Inspection
            hygiene_score = 96.0 - random.uniform(0, 4.0) if day != 12 else 78.5
            hygiene_entry = models.HygieneInspection(
                timestamp=current_date,
                zone=random.choice(["Receiving Dock", "Pasteurization Hall", "Packaging Floor", "Cold Storage", "Dispatch Bay"]),
                inspector_name="Officer V. Sharma",
                overall_score=round(hygiene_score, 1),
                risk_level="LOW" if hygiene_score > 90 else ("MEDIUM" if hygiene_score > 80 else "HIGH"),
                status="PASSED" if hygiene_score > 85 else "WARNING",
                missed_checks=0 if hygiene_score > 85 else 1,
                last_check_time=current_date.strftime("%Y-%m-%d %H:%M")
            )
            db.add(hygiene_entry)

            # Packaging Record
            pkg_qty = int(daily_prod_volume * 1.8) # e.g. pouches/bottles
            rec_qty = int(pkg_qty * (0.78 + random.uniform(-0.05, 0.05)))
            pkg_entry = models.PackagingRecord(
                timestamp=current_date,
                packaging_produced_qty=pkg_qty,
                packaging_type="LDPE Pouch 500ml",
                weight_kg=round(pkg_qty * 0.012, 1),
                recovered_qty=rec_qty
            )
            db.add(pkg_entry)

            # Sustainability Score
            sust_score_val = 88.0 + random.uniform(-4, 3) if day != 18 else 74.2
            sust_entry = models.SustainabilityScore(
                timestamp=current_date,
                overall_score=round(sust_score_val, 1),
                energy_score=round(82.0 + random.uniform(-5, 5), 1),
                hygiene_score=round(hygiene_score, 1),
                waste_score=78.2,
                operations_score=91.0,
                carbon_co2e_tonnes=round(1.82 + random.uniform(-0.2, 0.3), 2)
            )
            db.add(sust_entry)

        # 4. Collection Centers
        centers_data = [
            ("Yelahanka Hub", "CTR-YEL", 12000, 9840, 82.0, 420),
            ("Hebbal Center", "CTR-HEB", 10000, 7400, 74.0, 310),
            ("Whitefield Hub", "CTR-WHI", 15000, 9150, 61.0, 510),
            ("Malleswaram Station", "CTR-MAL", 8000, 7280, 91.0, 280)
        ]
        for name, code, target, coll, rate, part in centers_data:
            c = models.CollectionCenter(
                name=name, code=code, daily_target_qty=target,
                collected_today_qty=coll, recovery_percentage=rate,
                consumer_participation_count=part,
                status="ACTIVE" if rate >= 75 else "BELOW_TARGET"
            )
            db.add(c)

        # 5. Waste Logs (Reference project waste logging concept)
        waste_logs_data = [
            ("Plastic Packaging", 120.0, "kg", "Recycled", "2026-09-27", "Mechanical Recycling", 92.0),
            ("Cardboard", 250.0, "kg", "Recycled", "2026-09-27", "Pulp Processing", 98.0),
            ("Rejected Packaging", 45.0, "kg", "Scheduled", "2026-09-28", "Sorting & Reprocessing", 75.0),
            ("Organic Waste", 180.0, "kg", "Processed", "2026-09-27", "Anaerobic Digestion", 88.0),
            ("Recyclable Material", 310.0, "kg", "Recycled", "2026-09-26", "Polymer Recovery", 90.0)
        ]
        for wtype, wqty, wunit, wst, wdate, wmeth, wrate in waste_logs_data:
            wlog = models.WasteLog(
                type=wtype, qty=wqty, unit=wunit, status=wst,
                collection_date=wdate, processing_method=wmeth, recycling_rate_pct=wrate
            )
            db.add(wlog)

        # 6. Hygiene Checklists
        checklists_data = [
            ("Surface sanitation & ATP swab", "PASS", "ATP count < 15 RLU"),
            ("PPE compliance & hairnets", "PASS", "100% staff compliant"),
            ("Hand hygiene station refill", "PASS", "Sensors functional"),
            ("CIP wash temp log (>80°C)", "PASS", "Cycle completed"),
            ("Cold room temp log (<4°C)", "WARNING", "Temp registered 4.2°C at 14:00"),
            ("Equipment sanitation visual check", "PASS", "No bio-film detected")
        ]
        insp_ref = models.HygieneInspection(
            timestamp=datetime.utcnow(),
            zone="Packaging Floor",
            inspector_name="Lead Auditor M. Rao",
            overall_score=94.8,
            risk_level="LOW",
            status="PASSED",
            missed_checks=0,
            last_check_time=datetime.utcnow().strftime("%Y-%m-%d %H:%M")
        )
        db.add(insp_ref)
        db.flush()

        for item, st, notes in checklists_data:
            chk = models.HygieneChecklist(
                inspection_id=insp_ref.id,
                item_name=item,
                status=st,
                notes=notes
            )
            db.add(chk)

        # 7. Hygiene Violation & Corrective Action
        v1 = models.HygieneViolation(
            timestamp=datetime.utcnow() - timedelta(hours=6),
            zone="Packaging Floor",
            title="Filler Nozzle Micro-Bacterial Film Warning",
            description="ATP swab test registered 45 RLU on Filler Nozzle 3 during shift change audit.",
            severity="MEDIUM",
            status="IN_PROGRESS"
        )
        db.add(v1)
        db.flush()

        a1 = models.CorrectiveAction(
            violation_id=v1.id,
            issue="Filler Nozzle 3 Sanitization",
            area="Packaging Floor",
            severity="MEDIUM",
            assigned_to="Karan Verma (QA Lead)",
            due_date=datetime.utcnow() + timedelta(hours=2),
            status="IN PROGRESS",
            resolution="Steam flush initiated; replacement gasket ordered."
        )
        db.add(a1)

        # 8. Consumer Returns Seed Data
        returns_seed = [
            ("Ananya Roy", "PKG-MILK-9041", "LDPE Pouch 500ml", 12, 144.0, "Malleswaram Station", 60, 0.22),
            ("Vikram Sethi", "PKG-BOT-1182", "HDPE Bottle 1L", 5, 210.0, "Yelahanka Hub", 50, 0.35),
            ("Deepa Patel", "PKG-MILK-3341", "LDPE Pouch 500ml", 20, 240.0, "Whitefield Hub", 100, 0.41),
            ("Rohan Gupta", "PKG-BOT-8821", "Glass Bottle 500ml", 8, 2400.0, "Hebbal Center", 80, 1.20)
        ]
        for name, pid, ptype, qty, w_g, center, pts, co2e in returns_seed:
            cr = models.ConsumerReturn(
                consumer_name=name, packaging_id=pid, packaging_type=ptype,
                quantity=qty, weight_grams=w_g, collection_center=center,
                reward_points_earned=pts, co2e_avoided_kg=co2e
            )
            db.add(cr)

        # 9. Alerts
        alerts_seed = [
            ("Energy", "CRITICAL", "Refrigeration Energy Spike - Chiller Unit B", "Chiller Unit B power draw increased 43% above normal operating baseline (62 kW vs 42 kW).", "Chiller Unit B", "62.0 kW", "42.0 kW", "+47.6%", "Inspect thermal expansion valve and stagger pasteurization load.", "NEW", "Plant Manager"),
            ("Hygiene", "WARNING", "Missed Sanitation Check — Packaging Floor", "Packaging Floor missed 1 mandatory CIP sanitation check during high volume batch.", "Packaging Floor", "0 Checks", "1 Check", "-100%", "Perform emergency steam sanitation flush.", "NEW", "Quality Manager"),
            ("Equipment", "WARNING", "Chiller Unit B High Thermal Load", "Refrigeration thermal load approaching max capacity rating.", "Chiller Unit B", "94% Load", "75% Load", "+19.0%", "Reduce Pasteurizer 2 throughput by 10%.", "ACKNOWLEDGED", "Maintenance Lead")
        ]
        for cat, sev, title, msg, aff, obs, exp, dev, rec, st, ass in alerts_seed:
            al = models.Alert(
                category=cat, severity=sev, title=title, message=msg,
                affected_target=aff, observed_value=obs, expected_value=exp, deviation=dev,
                recommended_action=rec, status=st, assigned_to=ass
            )
            db.add(al)

        # 9. AI Insights
        insights_seed = [
            ("⚡ ENERGY ANOMALY", "HIGH", "Energy consumption increased 23% faster than production output",
             "Observed 11.8 kWh vs Expected 8.2 kWh (+43.9% deviation).",
             "Chiller Array A refrigeration load combined with overlapping CIP cleaning cycles.",
             "Inspect refrigeration expansion valve and stagger CIP wash schedule.", 0.94),
            ("🧼 HYGIENE RISK", "MEDIUM", "Packaging area recorded 3 repeated compliance warnings",
             "Filler nozzle ATP swabs exceeded safety threshold on 2 consecutive audits.",
             "Gasket seal wear on Nozzle 3 causing residual organic buildup.",
             "Replace nozzle gasket assembly and perform thermal steam sterilization.", 0.91),
            ("♻️ WASTE OPPORTUNITY", "MEDIUM", "Whitefield collection center performance is 12% below target",
             "Collection rate sits at 61% vs target 85%.",
             "Consumer drop-off box capacity bottlenecks during weekend peak hours.",
             "Deploy smart bin overflow alerts and double Sunday pickup frequency.", 0.89),
            ("🌱 POSITIVE TREND", "INFO", "Packaging recovery increased 8.4% this week",
             "Overall recovery rate reached 78.2% across 4 hub locations.",
             "Increased consumer participation following reward gamification launch.",
             "Expand reward points program to partner retail supermarkets.", 0.96)
        ]
        for cat, sev, title, ev, cause, rec, conf in insights_seed:
            insight = models.AIInsight(
                category=cat, severity=sev, title=title, evidence=ev,
                possible_cause=cause, recommended_action=rec, confidence_score=conf
            )
            db.add(insight)

        db.commit()
        print("Database Seeding Completed Successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
