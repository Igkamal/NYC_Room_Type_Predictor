from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel, Field
import joblib

app = FastAPI(
    title="NYC Airbnb Room Type Predictor",
    description="Predicts whether a NYC Airbnb listing is an Entire home/apt, "
                 "Private room, or Shared room based on its listing details.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Column order the trained pipeline expects
COLUMNS = [
    "latitude", "longitude", "price", "minimum_nights",
    "number_of_reviews", "reviews_per_month",
    "calculated_host_listings_count", "availability_365",
    "neighbourhood_group", "neighbourhood",
]

model = joblib.load("Model_Pipeline.pkl")  # Load the pre-trained model pipeline


# Pydantic model = the input validation
class Features(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    price: float = Field(..., gt=0, description="Price per night, must be positive")
    minimum_nights: int = Field(..., ge=1, le=365, description="Minimum nights required for booking")
    number_of_reviews: int = Field(..., ge=0, description="Total number of reviews")
    reviews_per_month: float = Field(..., ge=0, description="Average reviews per month")
    calculated_host_listings_count: int = Field(..., ge=0, description="Number of listings by this host")
    availability_365: int = Field(..., ge=0, le=365, description="Days available out of 365")
    neighbourhood_group: str = Field(..., min_length=1, description="Borough or neighbourhood group")
    neighbourhood: str = Field(..., min_length=1, description="Specific neighbourhood name")


@app.get("/")
def greet():
    return {"message": "NYC Airbnb Room Type Predictor API is running"}


@app.post("/predict")
def predict(features: Features):
    try:
        row = pd.DataFrame([features.model_dump()], columns=COLUMNS)
        prediction = model.predict(row)
        probability = model.predict_proba(row)[0]

        probabilities = {
            str(label): float(prob)
            for label, prob in zip(model.classes_, probability)
        }

        return {
            "Predicted_room_type": prediction[0],
            "probability": probabilities,
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")
