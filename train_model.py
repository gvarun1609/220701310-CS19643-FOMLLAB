import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pickle
import os

# Load dataset (adjust path because script is now inside backend/)
df = pd.read_csv("C:/Users/gvaru/OneDrive/Desktop/battery-life-predictor/backend/refined_ev_battery_dataset.csv")

# Features and target
X = df[["Voltage", "Current", "Temperature", "Charge_Cycles_Completed", "Total_Cycle_Life"]]
y = df["Remaining_Cycle_Life"]

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model in the same backend folder
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved to backend/model.pkl")
