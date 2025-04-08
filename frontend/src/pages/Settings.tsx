import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { LEAGUES } from '../services/leagues_service';
import { statsService } from '../services/stats_service';

interface SettingsProps {
  onError?: (message: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onError }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr',
    autoUpdate: true,
    dataRetention: 30,
    defaultLeague: LEAGUES[0].id,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    setSnackbar({
      open: true,
      message: 'Paramètres mis à jour avec succès',
      severity: 'success',
    });
  };

  const handleClearData = async () => {
    try {
      statsService.clearStats();
      setSnackbar({
        open: true,
        message: 'Données effacées avec succès',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      onError?.('Erreur lors de la suppression des données');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Layout title="Paramètres">
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Paramètres généraux */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Paramètres généraux</Typography>
                </Box>
                <List>
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.darkMode}
                          onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        />
                      }
                      label="Mode sombre"
                    />
                  </ListItem>
                  <ListItem>
                    <FormControl fullWidth>
                      <InputLabel>Langue</InputLabel>
                      <Select
                        value={settings.language}
                        label="Langue"
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                      >
                        <MenuItem value="fr">Français</MenuItem>
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Español</MenuItem>
                      </Select>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <FormControl fullWidth>
                      <InputLabel>Championnat par défaut</InputLabel>
                      <Select
                        value={settings.defaultLeague}
                        label="Championnat par défaut"
                        onChange={(e) => handleSettingChange('defaultLeague', e.target.value)}
                      >
                        {LEAGUES.map((league) => (
                          <MenuItem key={league.id} value={league.id}>
                            {league.flag} {league.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <NotificationsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Notifications</Typography>
                </Box>
                <List>
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications}
                          onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        />
                      }
                      label="Activer les notifications"
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoUpdate}
                          onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
                        />
                      }
                      label="Mise à jour automatique des données"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Gestion des données */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Gestion des données</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Durée de conservation des données (jours)"
                      value={settings.dataRetention}
                      onChange={(e) => handleSettingChange('dataRetention', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearData}
                    >
                      Effacer toutes les données
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Settings; 