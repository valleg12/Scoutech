import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface PerformanceChartProps {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  title,
  data,
  dataKey,
  color
}) => {
  // Extraire tous les noms de métriques sauf 'name'
  const metrics = Object.keys(data[0] || {}).filter(key => key !== 'name');
  const colors = ['#2196f3', '#f50057', '#00bcd4', '#ff9800'];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={colors[index % colors.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart; 