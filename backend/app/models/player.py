from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, JSON, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class Player(BaseModel):
    __tablename__ = "players"

    # Données de base
    sport_id = Column(Integer)
    common_name = Column(String, index=True)
    firstname = Column(String)
    lastname = Column(String)
    name = Column(String)
    display_name = Column(String)
    image_path = Column(String)
    height = Column(Integer)
    weight = Column(Integer)
    date_of_birth = Column(Date)
    nationality_id = Column(Integer)
    country_id = Column(Integer)
    position_id = Column(Integer)
    detailed_position_id = Column(Integer)
    type_id = Column(Integer)
    
    # Relations
    team_id = Column(Integer, ForeignKey("teams.id"))
    team = relationship("Team", back_populates="players")
    statistics = relationship("PlayerStatistics", back_populates="player")
    
    # Données de prédiction
    market_value = Column(Float)
    predicted_value = Column(Float)
    potential_rating = Column(Integer)

class Team(BaseModel):
    __tablename__ = "teams"

    name = Column(String, index=True)
    short_code = Column(String)
    country_id = Column(Integer)
    venue_id = Column(Integer)
    founded = Column(Integer)
    image_path = Column(String)
    type = Column(String)
    
    # Relations
    players = relationship("Player", back_populates="team")
    league_id = Column(Integer, ForeignKey("leagues.id"))
    league = relationship("League", back_populates="teams")

class League(BaseModel):
    __tablename__ = "leagues"

    name = Column(String, index=True)
    country_id = Column(Integer)
    type = Column(String)
    image_path = Column(String)
    active = Column(Boolean, default=True)
    
    # Relations
    teams = relationship("Team", back_populates="league") 