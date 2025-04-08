import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TableChart as TableChartIcon,
  Category as CategoryIcon,
  Numbers as NumbersIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import CsvDropzone from '../components/CsvDropzone';
import { customStatsService } from '../services/custom_stats_service';

interface DataImportProps {
  onError?: (message: string) => void;
}

const DataImport: React.FC<DataImportProps> = ({ onError }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  const handleCsvLoaded = (data: any[], headers: string[]) => {
    const dataType = customStatsService.detectDataType(headers);
    customStatsService.setData(data, headers, dataType);
    const analyticsData = customStatsService.getAnalytics();
    setAnalytics(analyticsData);
    setDataLoaded(true);
  };

  const renderDataTypeChip = () => {
    const dataType = customStatsService.getDataType();
    let color: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';
    let label = 'Données personnalisées';

    switch (dataType) {
      case 'player_stats':
        color = 'primary';
        label = 'Statistiques de joueurs';
        break;
      case 'match_stats':
        color = 'secondary';
        label = 'Statistiques de matchs';
        break;
      case 'scouting_data':
        color = 'success';
        label = 'Données de scouting';
        break;
    }

    return <Chip color={color} label={label} sx={{ mb: 2 }} />;
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TableChartIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total des entrées</Typography>
              </Box>
              <Typography variant="h4">{analytics.totalRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AssessmentIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Colonnes</Typography>
              </Box>
              <Typography variant="h4">{analytics.columns}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NumbersIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Colonnes numériques</Typography>
              </Box>
              <Typography variant="h4">{analytics.numericalColumns}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CategoryIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Colonnes catégoriques</Typography>
              </Box>
              <Typography variant="h4">{analytics.categoricalColumns}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Résumé des colonnes
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Colonne</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Résumé</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(analytics.summary).map(([column, summary]: [string, any]) => (
                      <TableRow key={column}>
                        <TableCell>{column}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={summary.type === 'numerical' ? 'Numérique' : 'Catégorique'}
                            color={summary.type === 'numerical' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>
                          {summary.type === 'numerical' ? (
                            <>
                              Min: {summary.min.toFixed(2)} | Max: {summary.max.toFixed(2)} |{' '}
                              Moyenne: {summary.average.toFixed(2)} | Médiane:{' '}
                              {summary.median.toFixed(2)}
                            </>
                          ) : (
                            <>
                              {summary.uniqueValues} valeurs uniques |{' '}
                              {summary.categories.slice(0, 3).join(', ')}
                              {summary.categories.length > 3 ? '...' : ''}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Layout title="Importation de données">
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Importez vos données
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Glissez et déposez votre fichier CSV pour commencer l'analyse. Le système détectera
            automatiquement le type de données et vous fournira des analyses pertinentes.
          </Typography>
        </Box>

        <CsvDropzone onCsvLoaded={handleCsvLoaded} />

        {dataLoaded && (
          <Box sx={{ mt: 4 }}>
            {renderDataTypeChip()}
            {renderAnalytics()}
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default DataImport; 