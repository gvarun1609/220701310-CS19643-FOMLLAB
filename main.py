from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

# Allow all origins (you can restrict this if deploying)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# Define expected input format
class BatteryInput(BaseModel):
    Voltage: float
    Current: float
    Temperature: float
    Charge_Cycles_Completed: int
    Total_Cycle_Life: int

@app.post("/predict")
def predict(data: BatteryInput):
    inputs = np.array([[data.Voltage, data.Current, data.Temperature,
                        data.Charge_Cycles_Completed, data.Total_Cycle_Life]])
    prediction = model.predict(inputs)
    return {"remaining_life": prediction[0]}
