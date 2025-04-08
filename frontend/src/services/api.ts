import axios from 'axios';

interface Player {
  id: number;
  name: string;
  position: string;
  current_team: string;
  market_value: number;
  predicted_performance?: number;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const playerService = {
  getPlayers: async (page = 1, limit = 10): Promise<Player[]> => {
    const response = await api.get(`/players/?skip=${(page-1)*limit}&limit=${limit}`);
    return response.data;
  },

  getPlayerById: async (id: number): Promise<Player> => {
    const response = await api.get(`/players/${id}`);
    return response.data;
  },
};

export default api;
export type { Player }; 