import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { Box, Card, CardContent, Typography } from '@mui/material';

export interface RadarData {
  subject: string;
  value: number;
  average: number;
}

interface RadarChartProps {
  title: string;
  data: RadarData[];
  color: string;
}

const RadarChart: React.FC<RadarChartProps> = ({
  title,
  data,
  color
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Joueur"
                dataKey="value"
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
              <Radar
                name="Moyenne du championnat"
                dataKey="average"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RadarChart; 