import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  maxValue?: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color, maxValue = 100 }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value.toFixed(2)}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={Math.min((value / maxValue) * 100, 100)}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: `${color}15`,
        '& .MuiLinearProgress-bar': {
          backgroundColor: color,
        },
      }}
    />
  </Box>
);

export default StatBar; 