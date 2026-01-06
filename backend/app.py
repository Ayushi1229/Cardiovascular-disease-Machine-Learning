import streamlit as st
import pandas as pd
import numpy as np
import joblib

# --- PAGE CONFIG ---
st.set_page_config(page_title="Cardio Health Predictor", layout="centered")

# --- LOAD ASSETS ---
@st.cache_resource 
def load_assets():
    scaler = joblib.load("standard_scaler.joblib")
    models = {
        "XGBoost": joblib.load("models/XGBClassifier_model.joblib"),
        "Random Forest": joblib.load("models/random_forest_model.joblib"),
        "Logistic Regression": joblib.load("models/logistic_regression_model.joblib")
    }
    return scaler, models

scaler, models = load_assets()

# --- UI HEADER ---
st.title("❤️ Cardiovascular Disease Prediction")

# --- INPUT SECTION ---
with st.container():
    col1, col2 = st.columns(2)
    
    with col1:
        gender_label = st.selectbox("Gender", options=["Female", "Male"])
        gender = 1 if gender_label == "Female" else 2
        
        weight = st.number_input("Weight (kg)", min_value=30.0, max_value=200.0, value=70.0)
        ap_hi = st.number_input("Systolic Blood Pressure (ap_hi)", value=120)
        ap_lo = st.number_input("Diastolic Blood Pressure (ap_lo)", value=80)

    with col2:
        # Mapping: Low -> 1, Normal -> 2, High -> 3 
        # (Ensure this matches the encoding used in your 'new_cleaned_cardio_data.csv')
        chol_label = st.selectbox("Cholesterol", options=["Low", "Normal", "High"])
        cholesterol = 1 if chol_label == "Low" else (2 if chol_label == "Normal" else 3)
        
        gluc_label = st.selectbox("Glucose", options=["Low", "Normal", "High"])
        glucose = 1 if gluc_label == "Low" else (2 if gluc_label == "Normal" else 3)
        
        smoke = st.radio("Smoker?", options=[0, 1], format_func=lambda x: "No" if x == 0 else "Yes")
        alco = st.radio("Alcohol Intake?", options=[0, 1], format_func=lambda x: "No" if x == 0 else "Yes")
        active = st.radio("Physical Activity?", options=[0, 1], format_func=lambda x: "Sedentary" if x == 0 else "Active")

# --- HANDLING THE 14 FEATURES ---
# Your model expects 14 features. 
# We fill the 5 'extra' features with 0.0 to satisfy the scaler and model requirements.
extra_features = [0.0] * 5 

# --- PREDICTION ---
selected_model_name = st.selectbox("Select Model", list(models.keys()))
if st.button("Analyze Risk"):
    # Create the full list of 14 features in order
    input_data = [
        gender, weight, ap_hi, ap_lo, cholesterol, glucose, 
        smoke, alco, active
    ] + extra_features
    
    # Scale and Predict
    input_scaled = scaler.transform([input_data])
    prediction = models[selected_model_name].predict(input_scaled)
    prob = models[selected_model_name].predict_proba(input_scaled)[0][1]

    st.divider()
    if prediction[0] == 1:
        st.error(f"### Result: High Risk ({prob*100:.1f}%)")
    else:
        st.success(f"### Result: Low Risk ({(1-prob)*100:.1f}%)")