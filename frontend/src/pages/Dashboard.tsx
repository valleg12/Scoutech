import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  SportsSoccer as SoccerIcon,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { statsService, PlayerWithStats } from '../services/stats_service';
import { analysisService, LeagueAverages } from '../services/analysis_service';
import { LEAGUES } from '../services/leagues_service';
import PerformanceChart from '../components/charts/PerformanceChart';
import RadarChart from '../components/charts/RadarChart';

interface DashboardProps {
  onError?: (message: string) => void;
}

interface LeagueStats {
  totalPlayers: number;
  averageAge: number;
  totalGoals: number;
  averageGoalsPerGame: number;
  topScorer: {
    name: string;
    team: string;
    goals: number;
  } | null;
  topAssister: {
    name: string;
    team: string;
    assists: number;
  } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onError }) => {
  const [loading, setLoading] = useState(true);
  const [leagueStats, setLeagueStats] = useState<Map<string, LeagueStats>>(new Map());
  const [leagueAverages, setLeagueAverages] = useState<Map<string, LeagueAverages>>(new Map());
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const statsMap = new Map<string, LeagueStats>();
        const averagesMap = new Map<string, LeagueAverages>();
        const performanceData: any[] = [];

        for (const league of LEAGUES) {
          const players = await statsService.loadStats(league.csvFile, league.id);
          const validPlayers = players.filter(p => !isNaN(p.age) && p.age > 0);
          const averages = analysisService.calculateLeagueAverages(validPlayers);
          averagesMap.set(league.id, averages);

          const topScorer = players.reduce((prev, current) => 
            (prev.stats.goals > current.stats.goals) ? prev : current
          );

          const topAssister = players.reduce((prev, current) => 
            (prev.stats.assists > current.stats.assists) ? prev : current
          );

          const stats: LeagueStats = {
            totalPlayers: validPlayers.length,
            averageAge: validPlayers.reduce((sum, p) => sum + p.age, 0) / validPlayers.length,
            totalGoals: players.reduce((sum, p) => sum + p.stats.goals, 0),
            averageGoalsPerGame: players.reduce((sum, p) => sum + p.stats.goals_per_90, 0) / players.length,
            topScorer: {
              name: topScorer.name,
              team: topScorer.team,
              goals: topScorer.stats.goals
            },
            topAssister: {
              name: topAssister.name,
              team: topAssister.team,
              assists: topAssister.stats.assists
            }
          };

          statsMap.set(league.id, stats);

          // Données pour le graphique de performance
          performanceData.push({
            name: league.name,
            'Buts/90': averages.goals_per_90.toFixed(2),
            'xG/90': averages.xg_per_90.toFixed(2),
            'Passes D./90': averages.assists_per_90.toFixed(2),
            'xA/90': averages.xa_per_90.toFixed(2)
          });
        }

        setLeagueStats(statsMap);
        setLeagueAverages(averagesMap);
        setPerformanceData(performanceData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        onError?.('Erreur lors du chargement des données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [onError]);

  if (loading) {
    return (
      <Layout title="Tableau de bord">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Tableau de bord">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Statistiques par ligue */}
          {LEAGUES.map(league => {
            const stats = leagueStats.get(league.id);
            if (!stats) return null;

            return (
              <Grid item xs={12} md={6} lg={4} key={league.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        {league.flag} {league.name}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Joueurs
                        </Typography>
                        <Typography variant="h6">
                          {stats.totalPlayers}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Âge moyen
                        </Typography>
                        <Typography variant="h6">
                          {stats.averageAge.toFixed(1)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Meilleur buteur
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                            <SoccerIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {stats.topScorer?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stats.topScorer?.goals} buts
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Meilleur passeur
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                            <TimelineIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {stats.topAssister?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stats.topAssister?.assists} passes décisives
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {/* Graphique de performance */}
          <Grid item xs={12} lg={8}>
            <PerformanceChart
              title="Comparaison des performances par ligue"
              data={performanceData}
              dataKey="Buts/90"
              color="#2196f3"
            />
          </Grid>

          {/* Statistiques globales */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiques globales
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary">
                        {Array.from(leagueStats.values()).reduce((sum, stats) => sum + stats.totalPlayers, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Joueurs analysés
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="secondary">
                        {Array.from(leagueStats.values()).reduce((sum, stats) => sum + stats.totalGoals, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Buts marqués
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard; 