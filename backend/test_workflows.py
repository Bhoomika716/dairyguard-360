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

if __name__ == "__main__":
    seed_database()
    test_root_endpoint()
    test_dashboard_overview()
    test_risks_and_opportunities()
    test_consumer_return_workflow()
    test_whatif_simulation_workflow()
    test_alerts_endpoint()
    print("ALL WORKFLOW TESTS PASSED 100%!")
