import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Avatar,
  Box,
  Tooltip,
  Button,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { PlayerWithStats } from '../services/stats_service';
import { leaguesService, League, LEAGUES } from '../services/leagues_service';
import { statsService } from '../services/stats_service';

interface PlayersListProps {
  onError?: (message: string) => void;
}

type SortField = keyof PlayerWithStats | 'goals' | 'assists' | 'xg' | 'xa';

interface SortOption {
  field: SortField;
  label: string;
}

const sortOptions: SortOption[] = [
  { field: 'name', label: 'Nom' },
  { field: 'team', label: 'Équipe' },
  { field: 'position', label: 'Position' },
  { field: 'age', label: 'Âge' },
  { field: 'goals', label: 'Buts' },
  { field: 'assists', label: 'Passes décisives' },
  { field: 'xg', label: 'xG' },
  { field: 'xa', label: 'xA' },
];

const PlayersList: React.FC<PlayersListProps> = ({ onError }) => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [teams, setTeams] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>(LEAGUES[0].id);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const selectedLeagueData = LEAGUES.find(l => l.id === selectedLeague);
        if (!selectedLeagueData) {
          throw new Error('League not found');
        }

        const players = await statsService.loadStats(selectedLeagueData.csvFile, selectedLeague);
        setPlayers(players);
        
        const uniqueTeams = Array.from(new Set(players.map(p => p.team))).sort();
        const uniquePositions = Array.from(new Set(players.map(p => p.position))).sort();
        setTeams(uniqueTeams);
        setPositions(uniquePositions);
      } catch (error) {
        console.error('Error loading players:', error);
        onError?.('Erreur lors du chargement des joueurs');
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [onError, selectedLeague]);

  const handleLeagueChange = (event: React.MouseEvent<HTMLElement>, newLeague: string) => {
    if (newLeague !== null) {
      setSelectedLeague(newLeague);
      setTeamFilter('');
      setPositionFilter('');
      setPage(0);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleTeamFilter = (event: SelectChangeEvent<string>) => {
    setTeamFilter(event.target.value);
    setPage(0);
  };

  const handlePositionFilter = (event: SelectChangeEvent<string>) => {
    setPositionFilter(event.target.value);
    setPage(0);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortValue = (player: PlayerWithStats, field: SortField): any => {
    switch (field) {
      case 'goals':
        return player.stats.goals;
      case 'assists':
        return player.stats.assists;
      case 'xg':
        return player.stats.xg;
      case 'xa':
        return player.stats.xa;
      default:
        return player[field as keyof PlayerWithStats];
    }
  };

  const filteredPlayers = players
    .filter((player) => {
      const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTeam = !teamFilter || player.team === teamFilter;
      const matchesPosition = !positionFilter || player.position === positionFilter;
      
      return matchesSearch && matchesTeam && matchesPosition;
    })
    .sort((a, b) => {
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  const getPositionColor = (position: string): string => {
    switch (position.toLowerCase()) {
      case 'at':
        return '#EF4444';
      case 'mt':
        return '#3B82F6';
      case 'df':
        return '#10B981';
      case 'gb':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const handleViewDetails = (player: PlayerWithStats) => {
    navigate(`/player/${encodeURIComponent(player.name)}`, {
      state: { 
        playerName: player.name,
        team: player.team,
        leagueId: player.leagueId
      }
    });
  };

  if (loading) {
    return (
      <Layout title="Liste des joueurs">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Liste des joueurs">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {/* League selector */}
                <Box sx={{ mb: 3 }}>
                  <ToggleButtonGroup
                    value={selectedLeague}
                    exclusive
                    onChange={handleLeagueChange}
                    aria-label="league selection"
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      '& .MuiToggleButton-root': {
                        border: '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: '8px !important',
                        px: 2,
                        py: 1,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                      },
                    }}
                  >
                    {LEAGUES.map((league) => (
                      <ToggleButton
                        key={league.id}
                        value={league.id}
                        aria-label={league.name}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" component="span">
                            {league.flag}
                          </Typography>
                          <Typography variant="body2" component="span">
                            {league.name}
                          </Typography>
                        </Box>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>

                <Grid container spacing={2}>
                  {/* Barre de recherche */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Rechercher un joueur..."
                      value={searchTerm}
                      onChange={handleSearch}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Filtre par équipe */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Équipe</InputLabel>
                      <Select
                        value={teamFilter}
                        onChange={handleTeamFilter}
                        label="Équipe"
                      >
                        <MenuItem value="">Toutes les équipes</MenuItem>
                        {teams.map((team) => (
                          <MenuItem key={team} value={team}>
                            {team}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Filtre par position */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Position</InputLabel>
                      <Select
                        value={positionFilter}
                        onChange={handlePositionFilter}
                        label="Position"
                      >
                        <MenuItem value="">Toutes les positions</MenuItem>
                        {positions.map((position) => (
                          <MenuItem key={position} value={position}>
                            {position}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {sortOptions.map((option) => (
                            <TableCell
                              key={option.field}
                              sortDirection={sortField === option.field ? sortDirection : false}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleSort(option.field)}
                              >
                                {option.label}
                                {sortField === option.field && (
                                  <SortIcon
                                    sx={{
                                      ml: 0.5,
                                      transform: sortDirection === 'desc' ? 'rotate(180deg)' : 'none',
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                          ))}
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredPlayers
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((player) => (
                            <TableRow key={player.name}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ mr: 2 }}>
                                    <VisibilityIcon />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2">{player.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {player.age} ans
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>{player.team}</TableCell>
                              <TableCell>
                                <Chip
                                  label={player.position}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getPositionColor(player.position)}15`,
                                    color: getPositionColor(player.position),
                                    fontWeight: 500,
                                  }}
                                />
                              </TableCell>
                              <TableCell>{player.age}</TableCell>
                              <TableCell>{player.stats.goals}</TableCell>
                              <TableCell>{player.stats.assists}</TableCell>
                              <TableCell>{player.stats.xg.toFixed(2)}</TableCell>
                              <TableCell>{player.stats.xa.toFixed(2)}</TableCell>
                              <TableCell align="right">
                                <Tooltip title="Voir les détails">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewDetails(player)}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={filteredPlayers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Lignes par page"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default PlayersList;