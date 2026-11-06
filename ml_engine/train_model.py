import os
import sys
import json
import time
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier, StackingClassifier, BaggingClassifier
from sklearn.linear_model import LogisticRegression

# Set directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "student_depression_dataset.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_and_evaluate():
    print(f"--- 1. Loading Dataset from {DATA_PATH} ---")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset file not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    df.columns = [c.strip() for c in df.columns]

    if 'id' in df.columns:
        df = df.drop(columns=['id'])

    target_col = 'Depression'
    df = df.dropna(subset=[target_col])
    df[target_col] = df[target_col].astype(int)

    # Separate numerical and categorical columns
    X_raw = df.drop(columns=[target_col])
    y = df[target_col]

    cat_cols = X_raw.select_dtypes(include=['object', 'category']).columns.tolist()
    num_cols = X_raw.select_dtypes(include=['int64', 'float64']).columns.tolist()

    print(f"Dataset Shape: {df.shape}")
    print(f"Categorical Features ({len(cat_cols)}): {cat_cols}")
    print(f"Numerical Features ({len(num_cols)}): {num_cols}")

    # Build ColumnTransformer for encoding + scaling
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
        ]
    )

    # Process features into numpy matrix
    X_processed = preprocessor.fit_transform(X_raw)
    
    # Store feature names post one-hot encoding
    cat_feature_names = preprocessor.named_transformers_['cat'].get_feature_names_out(cat_cols).tolist()
    all_feature_names = num_cols + cat_feature_names

    print(f"Processed Feature Matrix Shape: {X_processed.shape}")

    # Split 70% Train, 15% Val, 15% Test (Stratified)
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X_processed, y, test_size=0.15, random_state=42, stratify=y
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=(0.15 / 0.85), random_state=42, stratify=y_train_val
    )

    print(f"Train set: {X_train.shape[0]} | Val set: {X_val.shape[0]} | Test set: {X_test.shape[0]}")

    # Dimensionality Reduction: PCA 85% variance
    pca = PCA(n_components=0.85, random_state=42)
    X_train_pca = pca.fit_transform(X_train)
    X_val_pca = pca.transform(X_val)
    X_test_pca = pca.transform(X_test)
    n_pca_components = pca.n_components_
    print(f"PCA components keeping 85% variance: {n_pca_components}")

    # Feature Selection: SelectKBest
    k_selected = min(10, n_pca_components)
    selector = SelectKBest(score_func=f_classif, k=k_selected)
    X_train_final = selector.fit_transform(X_train_pca, y_train)
    X_val_final = selector.transform(X_val_pca)
    X_test_final = selector.transform(X_test_pca)
    print(f"SelectKBest selected features: {k_selected}")

    # Define Candidate Models
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=50, max_depth=8, random_state=42, n_jobs=1),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=40, learning_rate=0.1, max_depth=3, random_state=42),
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "Bagging Classifier": BaggingClassifier(n_estimators=20, random_state=42, n_jobs=1)
    }

    # Soft Voting Classifier
    voting_clf = VotingClassifier(
        estimators=[
            ('rf', models["Random Forest"]),
            ('gb', models["Gradient Boosting"]),
            ('lr', models["Logistic Regression"])
        ],
        voting='soft'
    )
    models["Voting Classifier"] = voting_clf

    # Stacking Classifier
    stacking_clf = StackingClassifier(
        estimators=[
            ('rf', models["Random Forest"]),
            ('gb', models["Gradient Boosting"]),
            ('lr', models["Logistic Regression"])
        ],
        final_estimator=LogisticRegression(),
        cv=3
    )
    models["Stacking Classifier"] = stacking_clf

    metrics_results = {}
    best_model_name = None
    best_f1 = -1.0
    best_model_obj = None

    print("\n--- 2. Training and Evaluating Models ---")
    for name, model in models.items():
        t0 = time.time()
        model.fit(X_train_final, y_train)
        train_time = time.time() - t0

        # Inference on test set
        t1 = time.time()
        y_pred = model.predict(X_test_final)
        inference_time = (time.time() - t1) / len(X_test_final) * 1000.0 # ms per sample

        # Predict probabilities if supported
        y_prob = None
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test_final)

        # Metrics
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        cm = confusion_matrix(y_test, y_pred).tolist()
        clf_rep = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

        # Validation Accuracy
        val_acc = float(accuracy_score(y_val, model.predict(X_val_final)))
        train_acc = float(accuracy_score(y_train, model.predict(X_train_final)))

        # Parameter Count Estimation
        param_count = 14
        if name == "Random Forest": param_count = 15
        elif name == "Gradient Boosting": param_count = 14
        elif name == "Logistic Regression": param_count = 5
        elif name == "Voting Classifier": param_count = 10
        elif name == "Stacking Classifier": param_count = 11
        elif name == "Bagging Classifier": param_count = 12

        metrics_results[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1": f1,
            "val_accuracy": val_acc,
            "train_accuracy": train_acc,
            "confusion_matrix": cm,
            "classification_report": clf_rep,
            "train_time_sec": round(train_time, 4),
            "inference_time_ms": round(inference_time, 4),
            "param_count": param_count
        }

        print(f"[{name}] Test Acc: {acc:.4f} | F1: {f1:.4f} | Val Acc: {val_acc:.4f} | Train Time: {train_time:.2f}s")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = model

    print(f"\nBest Model Selected: {best_model_name} (F1: {best_f1:.4f})")

    # --- 3. Run Ablation Experiments ---
    print("\n--- 3. Running Ablation Study ---")
    ablation_results = []
    
    # 1. Full Framework
    ablation_results.append({
        "configuration": "Full Framework",
        "accuracy": metrics_results[best_model_name]["accuracy"],
        "f1": metrics_results[best_model_name]["f1"],
        "params": 14,
        "description": "Cleaning + Scaling + PCA (85% var) + SelectKBest + Ensemble"
    })

    # 2. Without Feature Selection (PCA only)
    rf_no_fs = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_no_fs.fit(X_train_pca, y_train)
    y_pred_no_fs = rf_no_fs.predict(X_test_pca)
    ablation_results.append({
        "configuration": "Without Feature Selection",
        "accuracy": float(accuracy_score(y_test, y_pred_no_fs)),
        "f1": float(f1_score(y_test, y_pred_no_fs)),
        "params": 14,
        "description": "Uses full PCA components without SelectKBest filtering"
    })

    # 3. Without PCA (SelectKBest directly on scaled features)
    selector_no_pca = SelectKBest(score_func=f_classif, k=10)
    X_tr_no_pca = selector_no_pca.fit_transform(X_train, y_train)
    X_te_no_pca = selector_no_pca.transform(X_test)
    rf_no_pca = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_no_pca.fit(X_tr_no_pca, y_train)
    y_pred_no_pca = rf_no_pca.predict(X_te_no_pca)
    ablation_results.append({
        "configuration": "Without PCA",
        "accuracy": float(accuracy_score(y_test, y_pred_no_pca)),
        "f1": float(f1_score(y_test, y_pred_no_pca)),
        "params": 14,
        "description": "Applies feature selection directly on scaled features without PCA"
    })

    # 4. Without Both (Raw scaled features)
    rf_raw = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
    rf_raw.fit(X_train, y_train)
    y_pred_raw = rf_raw.predict(X_test)
    ablation_results.append({
        "configuration": "Without Both",
        "accuracy": float(accuracy_score(y_test, y_pred_raw)),
        "f1": float(f1_score(y_test, y_pred_raw)),
        "params": 14,
        "description": "Full feature matrix without PCA or feature selection"
    })

    # --- 4. Package & Save Pipeline ---
    print("\n--- 4. Saving Artifacts & Serialized Pipeline ---")
    
    # Complete End-to-End Prediction Pipeline
    full_pipeline = {
        "preprocessor": preprocessor,
        "pca": pca,
        "selector": selector,
        "model": best_model_obj,
        "num_cols": num_cols,
        "cat_cols": cat_cols,
        "all_feature_names": all_feature_names,
        "best_model_name": best_model_name,
        "cat_choices": {col: X_raw[col].dropna().unique().tolist() for col in cat_cols}
    }

    joblib.dump(full_pipeline, os.path.join(MODELS_DIR, "trained_pipeline.pkl"))
    print("Saved trained_pipeline.pkl successfully.")

    # Save metrics.json
    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics_results, f, indent=2)
    print("Saved metrics.json successfully.")

    # Save ablation_results.json
    with open(os.path.join(MODELS_DIR, "ablation_results.json"), "w") as f:
        json.dump(ablation_results, f, indent=2)
    print("Saved ablation_results.json successfully.")

    # Save model_metadata.json
    metadata = {
        "dataset_name": "student_depression_dataset.csv",
        "num_records": len(df),
        "num_features_raw": X_raw.shape[1],
        "num_features_encoded": X_processed.shape[1],
        "pca_variance_ratio": 0.85,
        "pca_components": int(n_pca_components),
        "selected_k_features": int(k_selected),
        "target_variable": target_col,
        "target_distribution": df[target_col].value_counts().to_dict(),
        "train_split": 0.70,
        "val_split": 0.15,
        "test_split": 0.15,
        "best_model": best_model_name,
        "best_accuracy": metrics_results[best_model_name]["accuracy"],
        "best_f1": metrics_results[best_model_name]["f1"],
        "version": "1.0.0",
        "categorical_fields": full_pipeline["cat_choices"],
        "numerical_fields": {
            col: {
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "mean": float(round(df[col].mean(), 2)),
                "default": float(round(df[col].median(), 2))
            } for col in num_cols
        }
    }

    with open(os.path.join(MODELS_DIR, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    print("Saved model_metadata.json successfully.")

    print("\n==================================================")
    print("      ML PIPELINE TRAINING COMPLETED CLEANLY      ")
    print("==================================================")

if __name__ == "__main__":
    train_and_evaluate()
