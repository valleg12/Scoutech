import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { CompareArrows as CompareArrowsIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import { statsService, PlayerWithStats } from '../services/stats_service';
import { analysisService, PlayerComparison } from '../services/analysis_service';
import { LEAGUES } from '../services/leagues_service';
import RadarChart from '../components/charts/RadarChart';

interface AnalysisProps {
  onError?: (message: string) => void;
}

const Analysis: React.FC<AnalysisProps> = ({ onError }) => {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithStats | null>(null);
  const [similarPlayers, setSimilarPlayers] = useState<PlayerComparison[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allPlayers: PlayerWithStats[] = [];
        
        for (const league of LEAGUES) {
          const leaguePlayers = await statsService.loadStats(league.csvFile, league.id);
          allPlayers.push(...leaguePlayers);
        }
        
        setPlayers(allPlayers);
      } catch (error) {
        console.error('Error loading players:', error);
        onError?.('Erreur lors du chargement des joueurs');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [onError]);

  const handlePlayerSelect = async (player: PlayerWithStats | null) => {
    if (!player) {
      setSelectedPlayer(null);
      setSimilarPlayers([]);
      setPerformanceData([]);
      return;
    }

    setSelectedPlayer(player);
    
    // Trouver des joueurs similaires
    const similar = analysisService.findSimilarPlayers(player, players);
    setSimilarPlayers(similar);

    // Calculer les moyennes de la ligue
    const leaguePlayers = players.filter(p => p.leagueId === player.leagueId);
    const leagueAverages = analysisService.calculateLeagueAverages(leaguePlayers);

    // Préparer les données pour le graphique radar
    const radarData = analysisService.getPerformanceData(player, leagueAverages);
    setPerformanceData(radarData);
  };

  if (loading) {
    return (
      <Layout title="Analyses">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Analyses">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sélection du joueur */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sélectionner un joueur à analyser
                </Typography>
                <Autocomplete
                  options={players}
                  getOptionLabel={(player) => `${player.name} (${player.team})`}
                  renderOption={(props, player) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">{player.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {player.team} - {player.position}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rechercher un joueur"
                      variant="outlined"
                    />
                  )}
                  onChange={(_, value) => handlePlayerSelect(value)}
                />
              </CardContent>
            </Card>
          </Grid>

          {selectedPlayer && (
            <>
              {/* Profil du joueur */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Profil du joueur
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Nom:</strong> {selectedPlayer.name}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Équipe:</strong> {selectedPlayer.team}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Position:</strong> {selectedPlayer.position}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Âge:</strong> {selectedPlayer.age} ans
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Nationalité:</strong> {selectedPlayer.nationality}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Graphique radar */}
              <Grid item xs={12} md={8}>
                <RadarChart
                  title="Analyse des performances"
                  data={performanceData}
                  color="#2196f3"
                />
              </Grid>

              {/* Joueurs similaires */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <CompareArrowsIcon sx={{ mr: 1 }} />
                      Joueurs similaires
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Joueur</TableCell>
                            <TableCell>Équipe</TableCell>
                            <TableCell>Similarité</TableCell>
                            <TableCell>Buts</TableCell>
                            <TableCell>Passes D.</TableCell>
                            <TableCell>xG</TableCell>
                            <TableCell>xA</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {similarPlayers.map((player) => (
                            <TableRow key={player.name}>
                              <TableCell>{player.name}</TableCell>
                              <TableCell>{player.team}</TableCell>
                              <TableCell>
                                <Chip
                                  label={`${player.similarity.toFixed(0)}%`}
                                  color={player.similarity > 80 ? 'success' : 'primary'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>{player.stats.goals}</TableCell>
                              <TableCell>{player.stats.assists}</TableCell>
                              <TableCell>{player.stats.xg.toFixed(2)}</TableCell>
                              <TableCell>{player.stats.xa.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Analysis; 