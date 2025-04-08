from fastapi import BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import asyncio
from typing import Optional

from .sportmonks_api import sportmonksAPI
from .data_integration import DataIntegrationService

class AutoUpdateService:
    def __init__(self, db: Session):
        self.db = db
        self.integration_service = DataIntegrationService(db)
        self.last_update: Optional[datetime] = None
        self.update_interval = timedelta(hours=24)

    async def start_update_scheduler(self, background_tasks: BackgroundTasks):
        background_tasks.add_task(self._update_loop)

    async def _update_loop(self):
        while True:
            try:
                if self._should_update():
                    await self._perform_update()
                    self.last_update = datetime.now()
                await asyncio.sleep(3600)  # Vérifier toutes les heures
            except Exception as e:
                print(f"Erreur lors de la mise à jour automatique : {str(e)}")
                await asyncio.sleep(3600)  # Réessayer dans une heure

    def _should_update(self) -> bool:
        if not self.last_update:
            return True
        return datetime.now() - self.last_update >= self.update_interval

    async def _perform_update(self):
        print(f"Début de la mise à jour des données : {datetime.now()}")
        
        # Mise à jour des ligues
        leagues_data = await sportmonksAPI.getLeagues()
        await self.integration_service.integrate_leagues(leagues_data['data'])
        
        # Mise à jour des équipes
        teams_data = await sportmonksAPI.getTeams()
        await self.integration_service.integrate_teams(teams_data['data'])
        
        # Mise à jour des joueurs (par lots pour éviter de surcharger l'API)
        players_data = await sportmonksAPI.getPlayers()
        await self.integration_service.integrate_players(players_data['data'])
        
        print(f"Mise à jour terminée : {datetime.now()}")

    async def force_update(self):
        """Force une mise à jour immédiate des données"""
        await self._perform_update()
        self.last_update = datetime.now() 