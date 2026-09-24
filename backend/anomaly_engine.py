import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, List, Tuple

class AnomalyDetector:
    def __init__(self):
        # Isolation Forest for multivariate anomaly detection
        self.model = IsolationForest(contamination=0.1, random_state=42)
        self.is_fitted = False

    def train_baseline(self, historical_energy_data: List[Tuple[float, float]]):
        """
        historical_energy_data: list of (production_volume_litres, total_kwh)
        """
        if len(historical_energy_data) >= 10:
            X = np.array(historical_energy_data)
            self.model.fit(X)
            self.is_fitted = True

    def detect_energy_anomaly(self, production_litres: float, total_kwh: float, baseline_avg_kwh_per_l: float = 0.0017) -> Dict:
        """
        Detects if energy consumption relative to production output is anomalous.
        """
        expected_kwh = production_litres * baseline_avg_kwh_per_l
        deviation_pct = ((total_kwh - expected_kwh) / max(expected_kwh, 1e-5)) * 100.0

        is_anomaly = False
        confidence = 0.85
        reasons = []

        # Statistical threshold rule
        if deviation_pct > 20.0:
            is_anomaly = True
            confidence = min(0.98, 0.70 + (deviation_pct / 100.0))
            reasons.append(f"Energy consumption increased significantly faster ({deviation_pct:+.1f}%) than production volume.")
            if total_kwh > 10.0:
                reasons.append("Refrigeration load & cleaning-cycle activity overlap suspected.")

        # ML model scoring if fitted
        if self.is_fitted:
            X_sample = np.array([[production_litres, total_kwh]])
            pred = self.model.predict(X_sample)
            if pred[0] == -1:
                is_anomaly = True
                confidence = max(confidence, 0.92)
                if "Machine runtime anomaly" not in reasons:
                    reasons.append("ML IsolationForest model flagged multivariate runtime outlier.")

        return {
            "is_anomaly": is_anomaly,
            "observed_kwh": round(total_kwh, 2),
            "expected_kwh": round(expected_kwh, 2),
            "deviation_pct": round(deviation_pct, 1),
            "confidence_score": round(confidence, 2),
            "possible_factors": reasons if reasons else ["Normal operational baseline"],
            "severity": "CRITICAL" if deviation_pct > 35 else ("HIGH" if deviation_pct > 20 else "LOW")
        }

anomaly_engine = AnomalyDetector()
