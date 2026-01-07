from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import os
import json



print("🚀 FastAPI app starting...")


app = FastAPI(title="Cardio Health Predictor API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load assets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCALER_PATH = os.path.join(BASE_DIR, "standard_scaler.joblib")
MODELS_DIR = os.path.join(BASE_DIR, "models")

scaler = None
models = {}

try:
    if os.path.exists(SCALER_PATH):
        scaler = joblib.load(SCALER_PATH)
    else:
        print(f"Warning: Scaler not found at {SCALER_PATH}")

    model_files = {
        "XGBoost": "XGBClassifier_model.joblib",
        "Random Forest": "random_forest_model.joblib",
        "Logistic Regression": "logistic_regression_model.joblib",
        "CatBoost": "CATBoostClassifier_model.joblib"

    }

    for name, filename in model_files.items():
        path = os.path.join(MODELS_DIR, filename)
        if os.path.exists(path):
            models[name] = joblib.load(path)
        else:
            print(f"Warning: Model {name} not found at {path}")

except Exception as e:
    print(f"Error loading assets: {e}")

class PredictionInput(BaseModel):
    gender: int
    age: int
    height: float
    weight: float
    ap_hi: int
    ap_lo: int
    cholesterol: int
    glucose: int
    smoke: int
    alco: int
    active: int
    model_name: str

@app.get("/")
def read_root():
    return {"message": "Cardio Health Predictor API is running"}

@app.get("/models")
def get_models():
    return {"models": list(models.keys())}

@app.get("/metrics")
def get_metrics():
    metrics_path = os.path.join(BASE_DIR, "model_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    return {"error": "Metrics not found"}

@app.get("/detailed_metrics")
def get_detailed_metrics():
    metrics_path = os.path.join(BASE_DIR, "detailed_metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    return {"error": "Detailed metrics not found"}

@app.post("/predict")
def predict(input_data: PredictionInput):
    if not scaler:
        raise HTTPException(status_code=500, detail="Scaler not loaded")
    
    if input_data.model_name not in models:
        raise HTTPException(status_code=400, detail=f"Model {input_data.model_name} not found. Available models: {list(models.keys())}")
    
    # Calculate derived features
    age_days = input_data.age * 365
    height_m = input_data.height / 100
    bmi = input_data.weight / (height_m ** 2)
    map_val = ((2 * input_data.ap_lo) + input_data.ap_hi) / 3
    pulse_pressure = input_data.ap_hi - input_data.ap_lo
    
    # Create DataFrame with correct columns matching training data
    features_dict = {
        "age": [age_days],
        "gender": [input_data.gender],
        "height": [input_data.height],
        "weight": [input_data.weight],
        "ap_hi": [input_data.ap_hi],
        "ap_lo": [input_data.ap_lo],
        "cholesterol": [input_data.cholesterol],
        "gluc": [input_data.glucose],
        "smoke": [input_data.smoke],
        "alco": [input_data.alco],
        "active": [input_data.active],
        "age_years": [float(input_data.age)],
        "height_m": [height_m],
        "bmi": [bmi],
        "MAP": [map_val],
        "Pulse_Pressure": [pulse_pressure]
    }
    
    input_df = pd.DataFrame(features_dict)
    
    try:
        # Scale
        input_scaled = scaler.transform(input_df)
        
        # Predict
        model = models[input_data.model_name]
        prediction = model.predict(input_scaled)[0]
        
        # Handle probability if available
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(input_scaled)[0][1]
        else:
            prob = float(prediction) # Fallback if no probability

        return {
            "prediction": int(prediction),
            "probability": float(prob),
            "risk": "High" if prediction == 1 else "Low"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
