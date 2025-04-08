import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import PlayersList from './pages/PlayersList';
import PlayerAnalysis from './pages/PlayerAnalysis';
import DataImport from './pages/DataImport';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import theme from './theme';
import { AlertColor } from '@mui/material';

const App: React.FC = () => {
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard onError={handleError} />} />
          <Route path="/players" element={<PlayersList onError={handleError} />} />
          <Route path="/player/:playerName" element={<PlayerAnalysis />} />
          <Route path="/import" element={<DataImport onError={handleError} />} />
          <Route path="/analysis" element={<Analysis onError={handleError} />} />
          <Route path="/settings" element={<Settings onError={handleError} />} />
        </Routes>
      </Router>
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
    </ThemeProvider>
  );
};

export default App;
