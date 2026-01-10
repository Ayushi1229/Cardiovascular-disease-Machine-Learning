
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
import json
import os
import sys
import traceback

# Define constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "new_cleaned_cardio_data.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
METRICS_PATH = os.path.join(BASE_DIR, "detailed_metrics.json")
MODEL_METRICS_PATH = os.path.join(BASE_DIR, "model_metrics.json")

def load_data():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Data file not found at {DATA_PATH}")
        sys.exit(1)
        
    df = pd.read_csv(DATA_PATH)
    target = "cardio"
    
    if "id" in df.columns:
        df = df.drop(columns=["id"])
        
    x = df.drop(columns=[target]).select_dtypes(include=[np.number])
    y = df[target]
    
    # Split
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.1, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    scaler.fit(x_train) # Fit on train
    x_test_scaled = scaler.transform(x_test)
    
    return x_test_scaled, y_test

def get_metrics(y_true, y_pred):
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred, zero_division=0)),
        "recall": float(recall_score(y_true, y_pred, zero_division=0)),
        "f1": float(f1_score(y_true, y_pred, zero_division=0))
    }

def main():
    print("Loading data...", flush=True)
    x_test_scaled, y_test = load_data()
    
    # Complete list of models based on directory listing
    # User requested to remove Decision Tree but include all others from model_train.ipynb
    model_files = {
        "XGBoost": "XGBClassifier_model.joblib",
        "Random Forest": "random_forest_model.joblib",
        "Logistic Regression": "logistic_regression_model.joblib",
        "CatBoost": "CATBoostClassifier_model.joblib",
        "KNN": "knn_model.joblib",
        "SVC": "svc_model.joblib"
    }
    
    all_metrics = []
    simple_metrics = {}
    
    print("Evaluating models...", flush=True)
    for name, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        if not os.path.exists(path):
            print(f"Warning: Model {name} not found at {path}, skipping.", flush=True)
            continue
            
        try:
            print(f"Loading {name}...", flush=True)
            model = joblib.load(path)
            print(f"Predicting with {name}...", flush=True)
            y_pred = model.predict(x_test_scaled)
            
            # Detailed metrics
            metrics = get_metrics(y_test, y_pred)
            metrics["name"] = name
            all_metrics.append(metrics)
            
            # Simple accuracy for model_metrics.json
            simple_metrics[name] = metrics["accuracy"]
            
            print(f"Computed metrics for {name}: {metrics['accuracy']}", flush=True)
        except Exception as e:
            print(f"Error evaluating {name}: {e}", flush=True)
            traceback.print_exc()
            
    print(f"All collected metrics: {simple_metrics}", flush=True)

    # Load existing detailed metrics to preserve other keys (confusion_matrix, etc of primary model)
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            data = json.load(f)
    else:
        data = {}
        
    data["all_models_metrics"] = all_metrics
    data["model_comparison"] = simple_metrics
    
    # Save detailed_metrics.json
    print(f"Saving to {METRICS_PATH}...", flush=True)
    with open(METRICS_PATH, "w") as f:
        json.dump(data, f, indent=2)
        
    # Save model_metrics.json
    print(f"Saving to {MODEL_METRICS_PATH}...", flush=True)
    with open(MODEL_METRICS_PATH, "w") as f:
        json.dump(simple_metrics, f, indent=2)
        
    print("Successfully updated metrics files.", flush=True)

if __name__ == "__main__":
    main()
