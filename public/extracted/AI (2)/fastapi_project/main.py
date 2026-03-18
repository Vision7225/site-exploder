from database import engine
from models import Base

Base.metadata.create_all(bind=engine)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import *
from models import *
from ai_engine import *

app = FastAPI()

# ✅ CORS (VERY IMPORTANT FOR FRONTEND)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# TEMP STORAGE (if DB not used fully)
# -------------------------------
users = [
    {"id": 1, "username": "tanuja", "password": "123"}
]

diary_entries = []
eeg_data = []

# -------------------------------
# LOGIN API
# -------------------------------
from database import SessionLocal
from models import User

@app.post("/login")
def login(data: login):
    db = SessionLocal()
    
    user = db.query(User).filter(
        User.username == data.username,
        User.password == data.password
    ).first()

    if user:
        return {"status": "success", "user_id": user.id}
    return {"status": "fail"}


# -------------------------------
# DIARY API
# -------------------------------
@app.post("/diary")
def add_diary(entry: Diary):
    diary_entries.append(entry.dict())
    return {"message": "Diary saved successfully"}


# -------------------------------
# EEG API
# -------------------------------
@app.post("/eeg")
def add_eeg(data: EEG):
    eeg_data.append(data.dict())
    return {"message": "EEG data saved successfully"}


# -------------------------------
# AI SUGGESTION API
# -------------------------------
@app.get("/suggestions/{user_id}")
def get_suggestion(user_id: int):
    user_eeg = [e for e in eeg_data if e["user_id"] == user_id]

    if not user_eeg:
        return {"suggestion": "No EEG data available"}

    last_stress = user_eeg[-1]["stress_level"]

    # ✅ USING AI ENGINE
    suggestion = generate_suggestion(last_stress)

    return {"suggestion": suggestion}


# -------------------------------
# DASHBOARD API (GRAPH DATA)
# -------------------------------
@app.get("/dashboard/{user_id}")
def dashboard(user_id: int):
    user_eeg = [e for e in eeg_data if e["user_id"] == user_id]
    user_diary = [d for d in diary_entries if d["user_id"] == user_id]

    return {
        "eeg": user_eeg,
        "diary": user_diary
    }

#-----------Register API --------------
@app.post("/register")
def register(data: login):
    db = SessionLocal()

    new_user = User(username=data.username, password=data.password)
    db.add(new_user)
    db.commit()

    return {"message": "User created"}