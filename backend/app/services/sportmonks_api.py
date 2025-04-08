import aiohttp
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class SportMonksAPI:
    def __init__(self):
        self.api_key = os.getenv('FOOTBALL_API_KEY')
        if not self.api_key:
            raise ValueError("FOOTBALL_API_KEY not found in environment variables")
        self.base_url = 'https://api.sportmonks.com/v3'
        self.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    async def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        params = params or {}
        params['api_token'] = self.api_key

        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, headers=self.headers) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"API request failed with status {response.status}")

    async def getLeagues(self) -> Dict[str, Any]:
        return await self._make_request('/football/leagues')

    async def getTeams(self, league_id: Optional[int] = None) -> Dict[str, Any]:
        params = {'league_id': league_id} if league_id else None
        return await self._make_request('/football/teams', params)

    async def getPlayers(self, team_id: Optional[int] = None) -> Dict[str, Any]:
        params = {'team_id': team_id} if team_id else None
        return await self._make_request('/football/players', params)

    async def getPlayerDetails(self, player_id: int) -> Dict[str, Any]:
        return await self._make_request(f'/football/players/{player_id}')

sportmonksAPI = SportMonksAPI() 