import pandas as pd
import numpy as np

df = pd.read_csv("dataset/cardio_train.csv",sep=";")

df = df.drop_duplicates()

df = df[df["age"]>0]

if df["age"].mean() > 100:
    df["age_years"] = (df["age"]/365).round(1)
else:
    df["age_years"] = df["age"]

df = df.fillna(df.median(numeric_only=True))

df = df[(df["ap_hi"]>50)&(df["ap_hi"]<250)]
df = df[(df["ap_lo"]>30)&(df["ap_lo"]<200)]

df["height_m"] = df["height"]/100
df["bmi"] = df["weight"] / (df["height_m"] ** 2)

df["pulse_pressure"] = df["ap_hi"] - df["ap_lo"]

df.to_csv("dataset/cleaned_cardio_data.csv", index=False)

print("Done")

