import sys
import os

try:
    import pytest
except ImportError:
    pytest = None

from fastapi.testclient import TestClient
from main import app
from seed import seed_database

client = TestClient(app)

def setup_module(module=None):
    """Seed database before running workflow tests."""
    seed_database()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "DairyGuard 360"
    assert data["status"] == "OPERATIONAL"

def test_dashboard_overview():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "ai_summary" in data
    assert "plant_health" in data

def test_risks_and_opportunities():
    response = client.get("/api/risks-and-opportunities")
    assert response.status_code == 200
    data = response.json()
    assert "top_risks" in data
    assert "top_opportunities" in data

def test_consumer_return_workflow():
    payload = {
        "consumer_name": "Test Citizen",
        "packaging_id": "PKG-TEST-001",
        "packaging_type": "LDPE Pouch 500ml",
        "quantity": 5,
        "collection_center": "Yelahanka Hub"
    }
    response = client.post("/api/consumer/returns", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert data["points_earned"] == 25

def test_whatif_simulation_workflow():
    payload = {
        "production_volume_change_pct": 10.0,
        "cleaning_frequency_change": 0.0,
        "energy_efficiency_change_pct": -5.0,
        "packaging_recovery_change_pct": 15.0,
        "recycling_rate_change_pct": 10.0
    }
    response = client.post("/api/simulations", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_energy_kwh_pct" in data
    assert "ai_explanation" in data

def test_alerts_endpoint():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_equipment_intelligence():
    response = client.get("/api/equipment")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6

def test_hygiene_5_areas():
    response = client.get("/api/hygiene")
    assert response.status_code == 200
    data = response.json()
    assert "hygiene_compliance_score" in data
    assert "heatmap_areas" in data
    assert len(data["heatmap_areas"]) == 5

def test_waste_logging_workflow():
    payload = {
        "type": "Plastic Packaging",
        "qty": 75.5,
        "unit": "kg",
        "processing_method": "Polymer Recovery Plant"
    }
    response = client.post("/api/waste", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"

def test_alert_action_and_reset():
    # Trigger incident
    resp_inc = client.post("/api/demo/trigger-incident?scenario=energy_spike")
    assert resp_inc.status_code == 200

    # Get alert list
    alerts = client.get("/api/alerts").json()
    if alerts:
        aid = alerts[0]["id"]
        ack = client.post(f"/api/alerts/{aid}/acknowledge")
        assert ack.status_code == 200
        res = client.post(f"/api/alerts/{aid}/resolve")
        assert res.status_code == 200

    # Reset plant
    rst = client.post("/api/demo/reset")
    assert rst.status_code == 200
    assert rst.json()["status"] == "PLANT_RESET"

if __name__ == "__main__":
    seed_database()
    test_root_endpoint()
    test_dashboard_overview()
    test_risks_and_opportunities()
    test_consumer_return_workflow()
    test_whatif_simulation_workflow()
    test_alerts_endpoint()
    test_equipment_intelligence()
    test_hygiene_5_areas()
    test_waste_logging_workflow()
    test_alert_action_and_reset()
    print("ALL WORKFLOW TESTS PASSED 100%!")

