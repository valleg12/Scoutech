import { statsService, PlayerWithStats } from './stats_service';

export interface League {
  id: string;
  name: string;
  country: string;
  flag: string;
  csvFile: string;
}

export const LEAGUES: League[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    country: 'Angleterre',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    csvFile: 'stats_processed.csv'
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Allemagne',
    flag: '🇩🇪',
    csvFile: 'stats_bundesliga_processed-1.csv'
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    country: 'France',
    flag: '🇫🇷',
    csvFile: 'stats_france_processed.csv'
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    country: 'Italie',
    flag: '🇮🇹',
    csvFile: 'stats_italia_processed.csv'
  },
  {
    id: 'la-liga',
    name: 'La Liga',
    country: 'Espagne',
    flag: '🇪🇸',
    csvFile: 'stats_spain_processed.csv'
  }
];

class LeaguesService {
  private static instance: LeaguesService;
  private currentLeague: League;
  private playersCache: Map<string, PlayerWithStats[]> = new Map();

  private constructor() {
    this.currentLeague = LEAGUES[0]; // Premier League par défaut
  }

  public static getInstance(): LeaguesService {
    if (!LeaguesService.instance) {
      LeaguesService.instance = new LeaguesService();
    }
    return LeaguesService.instance;
  }

  public async loadLeagueData(leagueId: string): Promise<PlayerWithStats[]> {
    const league = LEAGUES.find(l => l.id === leagueId);
    if (!league) {
      throw new Error('League not found');
    }

    if (this.playersCache.has(leagueId)) {
      return this.playersCache.get(leagueId)!;
    }

    this.currentLeague = league;
    const players = await statsService.loadStats(league.csvFile);
    this.playersCache.set(leagueId, Array.from(players.values()));
    return this.playersCache.get(leagueId)!;
  }

  public getCurrentLeague(): League {
    return this.currentLeague;
  }

  public getAllLeagues(): League[] {
    return LEAGUES;
  }

  public clearCache(): void {
    this.playersCache.clear();
  }
}

export const leaguesService = LeaguesService.getInstance(); 