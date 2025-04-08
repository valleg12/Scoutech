from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class PlayerBase(BaseModel):
    name: str
    birth_date: date
    position: str
    current_team: str
    market_value: float

class PlayerCreate(PlayerBase):
    pass

class PlayerResponse(PlayerBase):
    id: int
    created_at: date
    updated_at: date

    class Config:
        orm_mode = True 