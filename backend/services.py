import os
import json
import time
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_PATH = os.path.join(BASE_DIR, "data", "student_depression_dataset.csv")

class MLService:
    def __init__(self):
        self.pipeline = None
        self.metrics = None
        self.metadata = None
        self.ablation = None
        self.global_importance = None
        self.load_artifacts()

    def load_artifacts(self):
        try:
            pipeline_path = os.path.join(MODELS_DIR, "trained_pipeline.pkl")
            if os.path.exists(pipeline_path):
                self.pipeline = joblib.load(pipeline_path)

            metrics_path = os.path.join(MODELS_DIR, "metrics.json")
            if os.path.exists(metrics_path):
                with open(metrics_path, "r") as f:
                    self.metrics = json.load(f)

            meta_path = os.path.join(MODELS_DIR, "model_metadata.json")
            if os.path.exists(meta_path):
                with open(meta_path, "r") as f:
                    self.metadata = json.load(f)

            ablation_path = os.path.join(MODELS_DIR, "ablation_results.json")
            if os.path.exists(ablation_path):
                with open(ablation_path, "r") as f:
                    self.ablation = json.load(f)
        except Exception as e:
            print(f"Error loading artifacts: {e}")

    def _prepare_frame(self, input_data: Dict[str, Any]) -> pd.DataFrame:
        df_input = pd.DataFrame([input_data])
        num_cols = self.pipeline.get("num_cols", [])
        cat_cols = self.pipeline.get("cat_cols", [])

        for col in num_cols:
            if col in df_input.columns:
                df_input[col] = df_input[col].astype(float)

        for col in cat_cols:
            if col in df_input.columns:
                df_input[col] = df_input[col].astype(str)

        return df_input[num_cols + cat_cols]

    def _high_risk_probability(self, input_data: Dict[str, Any]) -> float:
        df_input = self._prepare_frame(input_data)
        preprocessor = self.pipeline["preprocessor"]
        pca = self.pipeline["pca"]
        selector = self.pipeline["selector"]
        model = self.pipeline["model"]
        X_proc = preprocessor.transform(df_input)
        X_final = selector.transform(pca.transform(X_proc))
        probabilities = model.predict_proba(X_final)[0]
        return float(probabilities[1])

    def _baseline_input(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        baseline = dict(input_data)
        numerical_fields = self.metadata.get("numerical_fields", {}) if self.metadata else {}
        categorical_fields = self.metadata.get("categorical_fields", {}) if self.metadata else {}

        for field, info in numerical_fields.items():
            baseline[field] = info.get("default", input_data.get(field))
        for field, choices in categorical_fields.items():
            if choices:
                baseline[field] = choices[0]
        return baseline

    def _model_explanations(self, input_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        baseline = self._baseline_input(input_data)
        actual_probability = self._high_risk_probability(input_data)
        explanations = []

        for field in self.pipeline.get("num_cols", []) + self.pipeline.get("cat_cols", []):
            if field not in input_data or field not in baseline:
                continue
            counterfactual = dict(input_data)
            counterfactual[field] = baseline[field]
            impact = actual_probability - self._high_risk_probability(counterfactual)
            explanations.append({
                "feature": field,
                "impact": round(impact, 4),
                "description": f"Changing this feature to the dataset baseline changes high-risk probability by {impact:+.4f}."
            })

        return sorted(explanations, key=lambda item: abs(item["impact"]), reverse=True)[:6]

    def get_global_importance(self) -> List[Dict[str, Any]]:
        if self.global_importance is not None:
            return self.global_importance
        if not self.pipeline or not os.path.exists(DATA_PATH):
            return []

        df = pd.read_csv(DATA_PATH).drop(columns=["id"], errors="ignore")
        target_col = "Depression"
        feature_columns = self.pipeline.get("num_cols", []) + self.pipeline.get("cat_cols", [])
        sample = df[feature_columns].sample(n=min(250, len(df)), random_state=42)
        baseline_frame = sample.to_dict(orient="records")
        base_probabilities = np.array([self._high_risk_probability(row) for row in baseline_frame])
        importance = []

        for field in feature_columns:
            shuffled = sample[field].sample(frac=1, random_state=42).to_numpy()
            changed_probabilities = []
            for index, row in enumerate(baseline_frame):
                counterfactual = dict(row)
                counterfactual[field] = shuffled[index]
                changed_probabilities.append(self._high_risk_probability(counterfactual))
            value = float(np.mean(np.abs(base_probabilities - np.array(changed_probabilities))))
            importance.append({"feature": field, "importance": round(value, 6)})

        self.global_importance = sorted(importance, key=lambda item: item["importance"], reverse=True)
        return self.global_importance

    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.pipeline:
            raise ValueError("ML Pipeline model not loaded. Please ensure training script ran.")

        t0 = time.time()

        df_input = self._prepare_frame(input_data)

        preprocessor = self.pipeline["preprocessor"]
        pca = self.pipeline["pca"]
        selector = self.pipeline["selector"]
        model = self.pipeline["model"]

        X_proc = preprocessor.transform(df_input)
        X_pca = pca.transform(X_proc)
        X_final = selector.transform(X_pca)

        prediction_raw = int(model.predict(X_final)[0])
        
        probabilities = {}
        confidence = 0.85
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_final)[0]
            confidence = float(np.max(probs))
            probabilities = {
                "Low Risk (Healthy)": float(probs[0]),
                "High Risk (Depression)": float(probs[1])
            }
        else:
            probabilities = {
                "Low Risk (Healthy)": 1.0 if prediction_raw == 0 else 0.0,
                "High Risk (Depression)": 1.0 if prediction_raw == 1 else 0.0
            }

        inference_time_ms = round((time.time() - t0) * 1000.0, 2)

        explanations = self._model_explanations(input_data)

        label = "High Risk (Student Depression)" if prediction_raw == 1 else "Low Risk (Healthy Student)"

        return {
            "prediction": prediction_raw,
            "prediction_label": label,
            "confidence": round(confidence, 4),
            "probabilities": probabilities,
            "model_used": self.pipeline.get("best_model_name", "Ensemble Model"),
            "inference_time_ms": inference_time_ms,
            "explanations": explanations
        }

    def get_dataset_info(self) -> Dict[str, Any]:
        if not os.path.exists(DATA_PATH):
            return {}

        df = pd.read_csv(DATA_PATH)
        df.columns = [c.strip() for c in df.columns]

        if 'id' in df.columns:
            df = df.drop(columns=['id'])

        target_col = 'Depression'
        df[target_col] = df[target_col].astype(int)

        cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        num_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        if target_col in num_cols:
            num_cols.remove(target_col)

        sample = df.head(10).to_dict(orient="records")

        return {
            "total_rows": len(df),
            "total_columns": df.shape[1],
            "target_column": target_col,
            "target_distribution": df[target_col].value_counts().to_dict(),
            "numerical_features": num_cols,
            "categorical_features": cat_cols,
            "missing_values": df.isnull().sum().to_dict(),
            "distributions": {
                "academic_pressure": df["Academic Pressure"].value_counts().sort_index().to_dict(),
                "sleep_duration": df["Sleep Duration"].value_counts().to_dict()
            },
            "sample_records": sample
        }

ml_service = MLService()
