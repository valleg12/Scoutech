import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  SportsSoccer as SoccerIcon,
  Speed as SpeedIcon,
  FitnessCenter as FitnessIcon,
  Psychology as PsychologyIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { statsService, PlayerWithStats } from '../services/stats_service';
import StatBar from '../components/StatBar';

interface LocationState {
  playerName: string;
  team: string;
  leagueId: string;
}

const PlayerAnalysis: React.FC = () => {
  const { playerName } = useParams<{ playerName: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState<PlayerWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const state = location.state as LocationState;
        if (!state) {
          setError("Informations du joueur non disponibles");
          return;
        }

        const player = statsService.getPlayerStats(
          state.playerName,
          state.team,
          state.leagueId
        );

        if (!player) {
          setError("Joueur non trouvé");
          return;
        }

        setPlayerData(player);
      } catch (err) {
        console.error('Error loading player data:', err);
        setError("Erreur lors du chargement des données du joueur");
      } finally {
        setLoading(false);
      }
    };

    if (playerName) {
      loadPlayerData();
    }
  }, [playerName, location.state]);

  if (loading) {
    return (
      <Layout title="Analyse du joueur">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error || !playerData) {
    return (
      <Layout title="Analyse du joueur">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography color="error">{error || "Données non disponibles"}</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Analyse du Joueur" subtitle={`Profil détaillé de ${playerData.name}`}>
      <Grid container spacing={3}>
        {/* En-tête du profil */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/players')} sx={{ mr: 2 }}>
                  <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                  <SoccerIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" gutterBottom>
                    {playerData.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={playerData.team}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={playerData.position}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques principales */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StatBar
                    label="xG par 90 min"
                    value={playerData.stats.xg_per_90}
                    color="#3B82F6"
                    maxValue={1}
                  />
                  <StatBar
                    label="xA par 90 min"
                    value={playerData.stats.xa_per_90}
                    color="#10B981"
                    maxValue={1}
                  />
                  <StatBar
                    label="Buts par 90 min"
                    value={playerData.stats.goals_per_90}
                    color="#8B5CF6"
                    maxValue={1}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatBar
                    label="Passes progressives"
                    value={playerData.stats.progressive_passes}
                    color="#F59E0B"
                    maxValue={200}
                  />
                  <StatBar
                    label="Progressions avec la balle"
                    value={playerData.stats.ball_progressions}
                    color="#EC4899"
                    maxValue={100}
                  />
                  <StatBar
                    label="Passes progressives reçues"
                    value={playerData.stats.progressive_passes_received}
                    color="#6366F1"
                    maxValue={200}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Informations détaillées */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Position
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {playerData.position}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Âge
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {playerData.age} ans
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Équipe
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {playerData.team}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Nationalité
                </Typography>
                <Typography variant="body1">
                  {playerData.nationality}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tableau des statistiques détaillées */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques détaillées
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Statistique</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Par 90 min</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Buts (hors penalties)</TableCell>
                      <TableCell align="right">{playerData.stats.non_penalty_goals}</TableCell>
                      <TableCell align="right">{playerData.stats.non_penalty_goals_per_90.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Penalties (marqués/tentés)</TableCell>
                      <TableCell align="right">{playerData.stats.penalties_scored}/{playerData.stats.penalties_attempted}</TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Passes décisives</TableCell>
                      <TableCell align="right">{playerData.stats.assists}</TableCell>
                      <TableCell align="right">{playerData.stats.assists_per_90.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>xG</TableCell>
                      <TableCell align="right">{playerData.stats.xg.toFixed(2)}</TableCell>
                      <TableCell align="right">{playerData.stats.xg_per_90.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>xA</TableCell>
                      <TableCell align="right">{playerData.stats.xa.toFixed(2)}</TableCell>
                      <TableCell align="right">{playerData.stats.xa_per_90.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cartons (jaunes/rouges)</TableCell>
                      <TableCell align="right">{playerData.stats.yellow_cards}/{playerData.stats.red_cards}</TableCell>
                      <TableCell align="right">-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PlayerAnalysis; 