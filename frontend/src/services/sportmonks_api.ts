import axios from 'axios';

export interface PlayerStats {
  matches: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  goals_assists: number;
  non_penalty_goals: number;
  penalties_scored: number;
  penalties_attempted: number;
  yellow_cards: number;
  red_cards: number;
  xg: number;
  npxg: number;
  xa: number;
  npxg_xa: number;
  ball_progressions: number;
  progressive_passes: number;
  progressive_passes_received: number;
  goals_per_90: number;
  assists_per_90: number;
  goals_assists_per_90: number;
  non_penalty_goals_per_90: number;
  goals_assists_penalties_per_90: number;
  xg_per_90: number;
  xa_per_90: number;
  xg_xa_per_90: number;
  npxg_per_90: number;
  npxg_xa_per_90: number;
}

export interface Player {
  id: number;
  name: string;
  common_name: string;
  firstname: string;
  lastname: string;
  position_id: number;
  nationality_id: number;
  image_path: string;
  height?: number;
  weight?: number;
  date_of_birth: string;
  market_value?: number;
  team?: {
    id: number;
    name: string;
  };
  stats?: PlayerStats;
  age?: number;
}

export interface Team {
  id: number;
  name: string;
  short_code: string;
  country_id: number;
  image_path: string;
}

export interface League {
  id: number;
  name: string;
  country_id: number;
  type: string;
  image_path: string;
}

const SPORTMONKS_API_KEY = 'IzjYTHlZKi1huoevUykaDU3GNmKx1DrEw6vuw2aKnomwjQNdd3t4RMjJwtD4';
const BASE_URL = 'https://api.sportmonks.com/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajout du token à chaque requête
api.interceptors.request.use(config => {
  config.params = {
    ...config.params,
    api_token: SPORTMONKS_API_KEY
  };
  return config;
});

// Ajout d'un intercepteur pour logger les réponses
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const sportmonksAPI = {
  getLeagues: async (): Promise<League[]> => {
    try {
      const response = await api.get('/football/leagues');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  },

  getTeams: async (leagueId?: number): Promise<Team[]> => {
    try {
      const params = leagueId ? { league_id: leagueId } : {};
      const response = await api.get('/football/teams', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  },

  getPlayers: async (teamId?: number): Promise<Player[]> => {
    try {
      const params = teamId ? { team_id: teamId } : {};
      const response = await api.get('/football/players', {
        params: {
          ...params,
          include: 'team'
        }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  },

  getPlayerDetails: async (playerId: number): Promise<Player | null> => {
    try {
      const response = await api.get(`/football/players/${playerId}`, {
        params: {
          include: 'team'
        }
      });
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching player details:', error);
      return null;
    }
  }
};