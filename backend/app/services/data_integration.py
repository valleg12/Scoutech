from typing import List, Dict
from sqlalchemy.orm import Session
from ..models.player import Player, Team, League
from datetime import datetime

class DataIntegrationService:
    def __init__(self, db: Session):
        self.db = db

    async def integrate_leagues(self, leagues_data: List[Dict]):
        for league_data in leagues_data:
            league = League(
                id=league_data['id'],
                name=league_data['name'],
                country_id=league_data['country_id'],
                type=league_data['type'],
                image_path=league_data['image_path'],
                active=league_data['active']
            )
            self.db.merge(league)
        self.db.commit()

    async def integrate_teams(self, teams_data: List[Dict]):
        for team_data in teams_data:
            team = Team(
                id=team_data['id'],
                name=team_data['name'],
                short_code=team_data['short_code'],
                country_id=team_data['country_id'],
                venue_id=team_data['venue_id'],
                founded=team_data['founded'],
                image_path=team_data['image_path'],
                type=team_data['type']
            )
            self.db.merge(team)
        self.db.commit()

    async def integrate_players(self, players_data: List[Dict]):
        for player_data in players_data:
            player = Player(
                id=player_data['id'],
                sport_id=player_data['sport_id'],
                common_name=player_data['common_name'],
                firstname=player_data['firstname'],
                lastname=player_data['lastname'],
                name=player_data['name'],
                display_name=player_data['display_name'],
                image_path=player_data['image_path'],
                height=player_data['height'],
                weight=player_data['weight'],
                date_of_birth=datetime.strptime(player_data['date_of_birth'], '%Y-%m-%d').date(),
                nationality_id=player_data['nationality_id'],
                country_id=player_data['country_id'],
                position_id=player_data['position_id'],
                detailed_position_id=player_data['detailed_position_id'],
                type_id=player_data['type_id']
            )
            self.db.merge(player)
        self.db.commit() 