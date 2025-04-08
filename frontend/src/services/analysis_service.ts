import { PlayerWithStats } from './stats_service';
import { RadarData } from '../components/charts/RadarChart';

export interface LeagueAverages {
  goals: number;
  assists: number;
  xg: number;
  xa: number;
  goals_per_90: number;
  assists_per_90: number;
  xg_per_90: number;
  xa_per_90: number;
  progressive_passes: number;
  ball_progressions: number;
}

export interface PlayerComparison {
  name: string;
  team: string;
  similarity: number;
  stats: PlayerWithStats['stats'];
}

class AnalysisService {
  private static instance: AnalysisService;

  private constructor() {}

  public static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  public calculateLeagueAverages(players: PlayerWithStats[]): LeagueAverages {
    if (players.length === 0) {
      return {
        goals: 0,
        assists: 0,
        xg: 0,
        xa: 0,
        goals_per_90: 0,
        assists_per_90: 0,
        xg_per_90: 0,
        xa_per_90: 0,
        progressive_passes: 0,
        ball_progressions: 0
      };
    }

    const sum = players.reduce(
      (acc, player) => ({
        goals: acc.goals + player.stats.goals,
        assists: acc.assists + player.stats.assists,
        xg: acc.xg + player.stats.xg,
        xa: acc.xa + player.stats.xa,
        goals_per_90: acc.goals_per_90 + player.stats.goals_per_90,
        assists_per_90: acc.assists_per_90 + player.stats.assists_per_90,
        xg_per_90: acc.xg_per_90 + player.stats.xg_per_90,
        xa_per_90: acc.xa_per_90 + player.stats.xa_per_90,
        progressive_passes: acc.progressive_passes + player.stats.progressive_passes,
        ball_progressions: acc.ball_progressions + player.stats.ball_progressions
      }),
      {
        goals: 0,
        assists: 0,
        xg: 0,
        xa: 0,
        goals_per_90: 0,
        assists_per_90: 0,
        xg_per_90: 0,
        xa_per_90: 0,
        progressive_passes: 0,
        ball_progressions: 0
      }
    );

    return {
      goals: sum.goals / players.length,
      assists: sum.assists / players.length,
      xg: sum.xg / players.length,
      xa: sum.xa / players.length,
      goals_per_90: sum.goals_per_90 / players.length,
      assists_per_90: sum.assists_per_90 / players.length,
      xg_per_90: sum.xg_per_90 / players.length,
      xa_per_90: sum.xa_per_90 / players.length,
      progressive_passes: sum.progressive_passes / players.length,
      ball_progressions: sum.ball_progressions / players.length
    };
  }

  public findSimilarPlayers(
    targetPlayer: PlayerWithStats,
    players: PlayerWithStats[],
    maxResults: number = 5
  ): PlayerComparison[] {
    const otherPlayers = players.filter(p => p.name !== targetPlayer.name);

    const similarities = otherPlayers.map(player => ({
      name: player.name,
      team: player.team,
      similarity: this.calculateSimilarity(targetPlayer.stats, player.stats),
      stats: player.stats
    }));

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }

  private calculateSimilarity(stats1: PlayerWithStats['stats'], stats2: PlayerWithStats['stats']): number {
    const weights = {
      goals: 2,
      assists: 2,
      xg: 1.5,
      xa: 1.5,
      goals_per_90: 2,
      assists_per_90: 2,
      xg_per_90: 1.5,
      xa_per_90: 1.5,
      progressive_passes: 1,
      ball_progressions: 1
    };

    const maxDifferences = {
      goals: 20,
      assists: 15,
      xg: 15,
      xa: 15,
      goals_per_90: 1,
      assists_per_90: 1,
      xg_per_90: 1,
      xa_per_90: 1,
      progressive_passes: 100,
      ball_progressions: 100
    };

    let totalSimilarity = 0;
    let totalWeight = 0;

    for (const [key, weight] of Object.entries(weights)) {
      const diff = Math.abs(stats1[key as keyof PlayerWithStats['stats']] - stats2[key as keyof PlayerWithStats['stats']]);
      const maxDiff = maxDifferences[key as keyof typeof maxDifferences];
      const similarity = Math.max(0, 1 - (diff / maxDiff));
      totalSimilarity += similarity * weight;
      totalWeight += weight;
    }

    return (totalSimilarity / totalWeight) * 100;
  }

  public getPerformanceData(player: PlayerWithStats, average: LeagueAverages): RadarData[] {
    return [
      { subject: 'Buts', value: this.normalizeValue(player.stats.goals, 0, 30), average: this.normalizeValue(average.goals, 0, 30) },
      { subject: 'Passes D.', value: this.normalizeValue(player.stats.assists, 0, 20), average: this.normalizeValue(average.assists, 0, 20) },
      { subject: 'xG', value: this.normalizeValue(player.stats.xg, 0, 25), average: this.normalizeValue(average.xg, 0, 25) },
      { subject: 'xA', value: this.normalizeValue(player.stats.xa, 0, 15), average: this.normalizeValue(average.xa, 0, 15) },
      { subject: 'Prog. Passes', value: this.normalizeValue(player.stats.progressive_passes, 0, 200), average: this.normalizeValue(average.progressive_passes, 0, 200) },
      { subject: 'Prog. Balle', value: this.normalizeValue(player.stats.ball_progressions, 0, 150), average: this.normalizeValue(average.ball_progressions, 0, 150) }
    ];
  }

  private normalizeValue(value: number, min: number, max: number): number {
    return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  }
}

export const analysisService = AnalysisService.getInstance(); 