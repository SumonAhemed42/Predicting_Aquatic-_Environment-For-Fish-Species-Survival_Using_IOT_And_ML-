from fastapi import FastAPI, HTTPException, BackgroundTasks, Path
import secrets
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.middleware.cors import CORSMiddleware
import MySQLdb
from pydantic import BaseModel
import bcrypt
from sklearn.linear_model import LinearRegression
import pickle
import uvicorn
from datetime import datetime, timedelta
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import numpy as np
from imblearn.over_sampling import RandomOverSampler

# *****


# *****

db_config = {
    'host': 'localhost',
    'user': 'root',
    'passwd': '',
    'db': '1801042',
}

conn = MySQLdb.connect(**db_config)
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Insert single data into database
# Internal access: http://127.0.0.1:8000/sensor-data/create?ph=5.6&&temp=32.4&&turb=13.4
@app.get("/sensor-data/create")
def newWeatherData(
        ph: float = None,
        temp: float = None,
        turb: float = None,
):
    # Handle oprional params value
    ph = ph if ph is not None else 0
    temp = temp if temp is not None else 0
    turb = turb if turb is not None else 0

    cursor = conn.cursor()
    query = "INSERT INTO sensor_data(ph, temp, turbidity) VALUES (%s, %s, %s)"
    cursor.execute(query, (ph, temp, turb))
    cursor.close()
    conn.commit()

    return {"status": 200}


# *******

# Read last sensor data
# Internal access: http://127.0.0.1:8000/sensor-data/get/last
@app.get("/sensor-data/get/last")
def getLastSensorData():
    cursor = conn.cursor()
    query = "SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1"
    cursor.execute(query, )
    row = cursor.fetchone()
    cursor.close()
    conn.commit()

    print(row);

    if row:
        return {
            "id": row[0],
            "ph": row[1],
            "temp": row[2],
            "turbidity": row[3],
            "timestamp": row[4],
        }
    else:
        return {}


# *******

@app.get("/get-min-max")
def get_min_max():
    df = pd.read_csv("dataset-1.csv")
    ph_min = df['ph'].min()
    ph_max = df['ph'].max()
    temperature_min = df['temperature'].min()
    temperature_max = df['temperature'].max()
    turbidity_min = df['turbidity'].min()
    turbidity_max = df['turbidity'].max()

    return {
        "phMin": ph_min,
        "phMax": ph_max,
        "tempMin": temperature_min,
        "tempMax": temperature_max,
        "turbidityMin": turbidity_min,
        "turbidityMax": turbidity_max,
    }


# *******


@app.get("/get-fish-name")
def get_fish_name():
    df = pd.read_csv("dataset-1.csv")
    distinct_fish_species = df['fish'].unique()
    data = "";
    for fish_species in distinct_fish_species:
        data += fish_species + "-"
    return data;


# *******

# Define the Pydantic model for input data
class PredictionParams(BaseModel):
    ph: float
    temp: float
    turbidity: float


@app.post("/predict")
def predict(params: PredictionParams):
    # Print params for debugging
    print(params)

    # Extract values from the Pydantic model instance
    ph = params.ph
    temp = params.temp
    turb = params.turbidity


    # load saved model
    with open('dt_model_pkl', 'rb') as f:
        dt_model = pickle.load(f)

    features = [[ph, temp, turb]]

    # Predict the values
    predicted_values = dt_model.predict(features)

    # Find possible species from the balanced dataset --->
    data2 = pd.read_csv('dataset-1.csv')

    # Get all possible fish species for the given pH value
    possible_species1 = set(data2[data2['ph'] == ph]['fish'])
    possible_species2 = set(data2[data2['temperature'] == temp]['fish'])
    possible_species3 = set(data2[data2['turbidity'] == turb]['fish'])

    # Combine multiple sets and convert to a list
    combined_species = list(possible_species1 | possible_species2 | possible_species3)
    # <--- Find possible species from the balanced dataset

    return {
        "single": predicted_values[0],
        "other": combined_species
    }


# *******
class PredictFishName(BaseModel):
    name: str


@app.post("/get-value-for-a-fish")
def predict(params: PredictFishName):
    # Print params for debugging
    print(params)

    fish_name = params.name;

    data = pd.read_csv("dataset-1.csv")

    suitable_data = data[data['fish'] == fish_name]

    # Calculate the pH range for the selected fish
    min_ph = suitable_data['ph'].min()
    max_ph = suitable_data['ph'].max()

    # Calculate the temperature range for the selected fish
    min_temp = suitable_data['temperature'].min()
    max_temp = suitable_data['temperature'].max()

    # Calculate the turbidity range for the selected fish
    min_turb = suitable_data['turbidity'].min()
    max_turb = suitable_data['turbidity'].max()

    return {
        "phRange": str(min_ph) + "-" + str(max_ph),
        "tempRange": str(min_temp) + "-" + str(max_temp),
        "turbRange": str(min_turb) + "-" + str(max_turb),
    }


# *******
@app.get("/chart-values")
def chart_values():
    cursor = conn.cursor()
    query = "SELECT ph FROM sensor_data ORDER BY id DESC LIMIT 10"
    cursor.execute(query, )
    rows = cursor.fetchall()

    ph = [];
    for row in rows:
        ph.append(row[0]);

    query = "SELECT temp FROM sensor_data ORDER BY id DESC LIMIT 10"
    cursor.execute(query, )
    rows = cursor.fetchall()

    temp = [];
    for row in rows:
        temp.append(row[0]);

    query = "SELECT turbidity FROM sensor_data ORDER BY id DESC LIMIT 10"
    cursor.execute(query, )
    rows = cursor.fetchall()

    turb = [];
    for row in rows:
        turb.append(row[0]);

    cursor.close()
    conn.commit()

    return {
        "ph": ph,
        "temp": temp,
        "turb": turb,
    }


# *******

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
