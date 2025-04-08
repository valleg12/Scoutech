import axios from 'axios';

interface Team {
  id: number;
  name: string;
}

export interface FootballPlayer {
  id: number;
  name: string;
  position: string;
  nationality: string;
  team: Team;
  statistics?: any[];
}

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const footballDataService = {
  getAllPlayers: async () => {
    try {
      const response = await api.get('/players');
      return response.data || [];
    } catch (error) {
      console.error('Error in getAllPlayers:', error);
      return [];
    }
  }
}; 