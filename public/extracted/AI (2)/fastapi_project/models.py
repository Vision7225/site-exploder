from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)


class Diary(Base):
    __tablename__ = "diary"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    text = Column(String)


class EEG(Base):
    __tablename__ = "eeg"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    stress_level = Column(Integer)