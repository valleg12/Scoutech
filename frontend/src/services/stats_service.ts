import Papa from 'papaparse';

export interface PlayerStats {
  goals: number;
  assists: number;
  xg: number;
  xa: number;
  goals_per_90: number;
  assists_per_90: number;
  xg_per_90: number;
  xa_per_90: number;
  non_penalty_goals: number;
  non_penalty_goals_per_90: number;
  penalties_scored: number;
  penalties_attempted: number;
  yellow_cards: number;
  red_cards: number;
  progressive_passes: number;
  ball_progressions: number;
  progressive_passes_received: number;
}

export interface PlayerWithStats {
  name: string;
  team: string;
  position: string;
  age: number;
  nationality: string;
  leagueId: string;
  stats: PlayerStats;
}

interface CsvRow {
  [key: string]: string;
}

class StatsService {
  private static instance: StatsService;
  private statsMap: Map<string, PlayerWithStats> = new Map();
  private currentLeagueId: string = '';

  private constructor() {}

  public static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  private cleanColumnName(header: string): string {
    return header.trim()
      .toLowerCase()
      .replace('passes_decisives', 'passes_decisives')
      .replace('buts_passes_decisives', 'buts_passes_decisives')
      .replace('buts_hors_penaltys', 'buts_hors_penaltys')
      .replace('penaltys_marques', 'penaltys_marques')
      .replace('penaltys_tentes', 'penaltys_tentes')
      .replace('cartons_jaunes', 'cartons_jaunes')
      .replace('cartons_rouges', 'cartons_rouges')
      .replace('progressions_balle', 'progressions_balle')
      .replace('passes_progressives', 'passes_progressives')
      .replace('passes_progressives_recues', 'passes_progressives_recues');
  }

  private getPlayerKey(name: string, team: string, leagueId: string): string {
    return `${leagueId}:${name}:${team}`;
  }

  public async loadStats(csvFile: string = 'stats_processed.csv', leagueId: string = 'premier-league'): Promise<PlayerWithStats[]> {
    try {
      this.currentLeagueId = leagueId;
      const response = await fetch(`/data/${csvFile}`);
      const csvData = await response.text();

      return new Promise((resolve, reject) => {
        Papa.parse<CsvRow>(csvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => this.cleanColumnName(header),
          complete: (results) => {
            // Vider la Map avant de charger les nouvelles données
            this.statsMap.clear();
            
            if (results.data.length > 0) {
              console.log('CSV Headers:', Object.keys(results.data[0]));
              
              results.data.forEach((row) => {
                if (!row.joueur && !row.name) return;

                const name = row.joueur || row.name;
                const team = row.equipe || row.team;
                const player: PlayerWithStats = {
                  name,
                  team,
                  position: row.position,
                  age: parseInt(row.age, 10),
                  nationality: row.nationalite || row.nationality || '',
                  leagueId,
                  stats: {
                    goals: parseFloat(row.buts || row.goals) || 0,
                    assists: parseFloat(row.passes_decisives || row.assists) || 0,
                    xg: parseFloat(row.xg) || 0,
                    xa: parseFloat(row.xa) || 0,
                    goals_per_90: parseFloat(row.buts_90 || row.goals_per_90) || 0,
                    assists_per_90: parseFloat(row.passes_decisives_90 || row.assists_per_90) || 0,
                    xg_per_90: parseFloat(row.xg_90 || row.xg_per_90) || 0,
                    xa_per_90: parseFloat(row.xa_90 || row.xa_per_90) || 0,
                    non_penalty_goals: parseFloat(row.buts_hors_penaltys || row.non_penalty_goals) || 0,
                    non_penalty_goals_per_90: parseFloat(row.buts_hors_penaltys_90 || row.non_penalty_goals_per_90) || 0,
                    penalties_scored: parseFloat(row.penaltys_marques || row.penalties_scored) || 0,
                    penalties_attempted: parseFloat(row.penaltys_tentes || row.penalties_attempted) || 0,
                    yellow_cards: parseFloat(row.cartons_jaunes || row.yellow_cards) || 0,
                    red_cards: parseFloat(row.cartons_rouges || row.red_cards) || 0,
                    progressive_passes: parseFloat(row.passes_progressives || row.progressive_passes) || 0,
                    ball_progressions: parseFloat(row.progressions_balle || row.ball_progressions) || 0,
                    progressive_passes_received: parseFloat(row.passes_progressives_recues || row.progressive_passes_received) || 0
                  }
                };
                const playerKey = this.getPlayerKey(name, team, leagueId);
                this.statsMap.set(playerKey, player);
              });
            }
            
            console.log(`Loaded ${this.statsMap.size} players for league ${leagueId}`);
            resolve(Array.from(this.statsMap.values()));
          },
          error: (error: Error) => {
            console.error('Error parsing CSV:', error);
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      throw error;
    }
  }

  public getPlayerStats(playerName: string, team: string, leagueId?: string): PlayerWithStats | undefined {
    const searchLeagueId = leagueId || this.currentLeagueId;
    const playerKey = this.getPlayerKey(playerName, team, searchLeagueId);
    return this.statsMap.get(playerKey);
  }

  public getAllPlayers(): PlayerWithStats[] {
    return Array.from(this.statsMap.values());
  }

  public getPlayersByLeague(leagueId: string): PlayerWithStats[] {
    return Array.from(this.statsMap.values()).filter(player => player.leagueId === leagueId);
  }

  public clearStats(): void {
    this.statsMap.clear();
  }
}

export const statsService = StatsService.getInstance(); 