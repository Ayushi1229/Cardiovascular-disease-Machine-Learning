import joblib
import numpy as np

try:
    scaler = joblib.load("backend/standard_scaler.joblib")
    print(f"Number of features: {scaler.n_features_in_}")
    if hasattr(scaler, "feature_names_in_"):
        print(f"Feature names: {list(scaler.feature_names_in_)}")
except Exception as e:
    print(f"Error: {e}")
