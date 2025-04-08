from typing import Dict, List
import requests
from sqlalchemy.orm import Session
from ..models.player import Player

class DataCollector:
    def __init__(self):
        self.base_url = "http://localhost:8001/api/v1"

    async def get_players(self, db: Session) -> List[Dict]:
        """Récupère les données des joueurs depuis la base de données"""
        players = db.query(Player).all()
        return [player.__dict__ for player in players]

    async def get_player_by_id(self, player_id: int, db: Session) -> Dict:
        """Récupère un joueur spécifique"""
        player = db.query(Player).filter(Player.id == player_id).first()
        return player.__dict__ if player else None