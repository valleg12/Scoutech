import React from 'react';
import { Box, Container, Typography } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DRAWER_WIDTH = 240; // Largeur du drawer de navigation

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Espace pour le drawer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          mt: '64px', // Hauteur de la barre de navigation
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 