import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, roc_curve, auc, precision_score, recall_score, f1_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib
import json

df = pd.read_csv("new_cleaned_cardio_data.csv")
target = "cardio"

# Drop id as it's not a feature
if "id" in df.columns:
    df = df.drop(columns=["id"])

x = df.drop(columns=[target]).select_dtypes(include=[np.number])
y = df[target]

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.1, random_state=42, stratify=y)

scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.transform(x_test)

joblib.dump(scaler, "standard_scaler.joblib")

# smote balanceing
smote = SMOTE(random_state=42)
x_train_res,y_train_res = smote.fit_resample(x_train_scaled,y_train)
print("Before:", len(y_train), "After:", len(y_train_res))

# ------------------------------Models-----------------------------
logreg = LogisticRegression(max_iter=5000, random_state=42)
logreg.fit(x_train_res,y_train_res)

logref_pred = logreg.predict(x_test_scaled)

print("Logistic Regression Model Performance:")
print("Accuracy:", accuracy_score(y_test, logref_pred))
print("--------------------------------------------------")

rf = RandomForestClassifier(n_estimators=300,max_depth=12,min_samples_split=4, random_state=42)
rf.fit(x_train_res, y_train_res)

rf_pred = rf.predict(x_test_scaled)

print("Random Forest Model Performance:")
print("Accuracy:", accuracy_score(y_test, rf_pred))
print("--------------------------------------------------")

dt = DecisionTreeClassifier(random_state=42)
dt.fit(x_train_res, y_train_res)

dt_pred = dt.predict(x_test_scaled)

print("Decision Tree Model Performance:")
print("Accuracy:", accuracy_score(y_test, dt_pred))
print("--------------------------------------------------")

xgb = XGBClassifier(
    n_estimators=300,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="binary:logistic",
    eval_metric="logloss"
)

xgb.fit(x_train_res, y_train_res)

xgb_pred = xgb.predict(x_test_scaled)
xgb_probs = xgb.predict_proba(x_test_scaled)[:, 1]
acc_xgb = accuracy_score(y_test, xgb_pred)

print("XGBoost Model Performance:")
print("Accuracy:", acc_xgb)

cm = confusion_matrix(y_test, xgb_pred)
tn, fp, fn, tp = cm.ravel()

fpr, tpr, _ = roc_curve(y_test, xgb_probs)
roc_auc = auc(fpr, tpr)

indices = np.linspace(0, len(fpr) - 1, 20).astype(int)
roc_data = [{"x": float(fpr[i]), "y": float(tpr[i])} for i in indices]

precision = precision_score(y_test, xgb_pred)
recall = recall_score(y_test, xgb_pred)
f1 = f1_score(y_test, xgb_pred)

feature_names = x.columns.tolist()
importances = xgb.feature_importances_
feature_importance_data = [
    {"name": name, "value": float(imp)} 
    for name, imp in zip(feature_names, importances)
]
feature_importance_data.sort(key=lambda x: x["value"], reverse=True)

metrics = {
    "Logistic Regression": accuracy_score(y_test, logref_pred),
    "Random Forest": accuracy_score(y_test, rf_pred),
    "Decision Tree": accuracy_score(y_test, dt_pred),
    "XGBoost": acc_xgb
}

detailed_metrics = {
    "accuracy": float(acc_xgb),
    "precision": float(precision),
    "recall": float(recall),
    "f1_score": float(f1),
    "roc_auc": float(roc_auc),
    "confusion_matrix": {
        "tn": int(tn),
        "fp": int(fp),
        "fn": int(fn),
        "tp": int(tp)
    },
    "roc_curve": roc_data,
    "feature_importance": feature_importance_data,
    "model_comparison": metrics
}

with open("detailed_metrics.json", "w") as f:
    json.dump(detailed_metrics, f, indent=2)

with open("model_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

joblib.dump(logreg, "models/logistic_regression_model.joblib")
joblib.dump(rf, "models/random_forest_model.joblib")
joblib.dump(dt, "models/decision_tree_model.joblib")
joblib.dump(xgb, "models/XGBClassifier_model.joblib")
# joblib.dump(rf, "models/random_forest_model.joblib")
# joblib.dump(dt, "models/decision_tree_model.joblib")
# joblib.dump(xgb, "models/XGBClassifier_model.joblib")
# print("Models have been trained and saved successfully.")


