# NYC Airbnb Room Type Predictor

# 

Live demo link: https://nyc-room-type-predictor-2-tb2r.onrender.com


A machine learning web app that predicts whether a New York Airbnb listing is an **Entire home/apt**, a **Private room**, or a **Shared room**, and shows how confident the model is.

- **Backend:** FastAPI serving a trained scikit-learn pipeline (`Model_Pipeline.pkl`)
- **Frontend:** dark-themed HTML / CSS / JavaScript app with animations (no build step, no frameworks)

---

## Project structure

```
NYC_House_Type_Prediction/
├── main.py               # FastAPI backend
├── Model_Pipeline.pkl    # trained model (must sit next to main.py)
├── requirements.txt
├── index.html            # frontend page
├── style.css             # dark theme + animations
├── script.js             # frontend logic
├── nyc.ipynb             # model training notebook
└── README.md
```

## How to run

**1. Install the requirements (once)**

```bash
pip install -r requirements.txt
```

**2. Start the backend** (keep this terminal open)

```bash
python -m uvicorn main:app --reload --port 8000
```

You should see `Uvicorn running on http://127.0.0.1:8000`. API docs are at http://127.0.0.1:8000/docs.

**3. Start the frontend** (in a second terminal, same folder)

```bash
python -m http.server 5500
```

Then open **http://127.0.0.1:5500/index.html** in your browser.

## How the app works

1. **Landing + 3-step form**
   - *Location:* click a borough on the map or pick it from the list, choose a neighbourhood (filtered to that borough), coordinates are filled in automatically.
   - *Price & stay:* nightly price (with quick-pick chips), minimum nights, yearly availability slider.
   - *Activity:* total reviews, reviews per month, number of listings the host owns.
2. **Analyzing screen:** an animated loading view while the request goes to the API.
3. **Results page:** opens automatically with the predicted room type, an animated confidence ring, a probability bar for each room type, and a summary of the listing you entered. Buttons let you edit the inputs or predict another listing.

Extras: a live **API online / offline** indicator in the top bar, a **Fill example** button that cycles through three sample listings, and a settings dialog (gear icon) to change the API URL.

## API

### `POST /predict`

Request:

```json
{
  "latitude": 40.7265,
  "longitude": -73.9815,
  "price": 185,
  "minimum_nights": 3,
  "number_of_reviews": 42,
  "reviews_per_month": 1.8,
  "calculated_host_listings_count": 2,
  "availability_365": 210,
  "neighbourhood_group": "Manhattan",
  "neighbourhood": "East Village"
}
```

Response:

```json
{
  "Predicted_room_type": "Entire home/apt",
  "probability": {
    "Entire home/apt": 0.71,
    "Private room": 0.27,
    "Shared room": 0.02
  }
}
```

The frontend also accepts the older response format where `probability` is a plain list (it assumes the alphabetical class order used by scikit-learn).

## Notes

- `requirements.txt` pins `scikit-learn==1.6.1`, the version the pipeline was saved with.
- CORS is open (`allow_origins=["*"]`) for local development. Restrict it before deploying publicly.
- The neighbourhood-to-borough grouping in `script.js` is only used to filter the dropdown. The values sent to the API are exactly the names the model was trained on.
#
