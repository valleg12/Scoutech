import { playerService } from './api';

export interface DashboardStats {
  analysesEnCours: number;
  predictions: number;
  joueursSuivis: number;
  rapports: number;
}

export const statsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const players = await playerService.getPlayers(1, 1000);
      
      return {
        analysesEnCours: Math.floor(players.length * 0.3), // 30% des joueurs en analyse
        predictions: Math.floor(players.length * 0.5),     // 50% des joueurs avec prédictions
        joueursSuivis: players.length,
        rapports: Math.floor(players.length / 10)         // Un rapport pour 10 joueurs
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        analysesEnCours: 0,
        predictions: 0,
        joueursSuivis: 0,
        rapports: 0
      };
    }
  }
}; 