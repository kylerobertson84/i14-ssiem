import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography, Box } from '@mui/material';

// Sample data for the charts
const dataBar = [
  { name: 'Jan 1', Computer: 300, Networking: 100 },
  { name: 'Jan 2', Computer: 400, Networking: 300 },
  { name: 'Jan 3', Computer: 200, Networking: 500 },
  { name: 'Jan 4', Computer: 278, Networking: 200 },
  { name: 'Jan 5', Computer: 189, Networking: 600 },
  { name: 'Jan 6', Computer: 239, Networking: 400 },
  { name: 'Jan 7', Computer: 349, Networking: 300 },
];

const dataPie = [
  { name: 'Windows OS', value: 50, color: '#0088FE' },
  { name: 'Networking Devices', value: 25, color: '#00C49F' },
  { name: 'Linux OS', value: 15, color: '#FFBB28' },
  { name: 'MacOS', value: 10, color: '#FF8042' },
];

const COLORSBAR = ['#0088FE', '#00C49F'];

const COLORSPIE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const LogsPerDayChart = () => (
  <div>
    <Typography variant="h6" gutterBottom>
      Logs Per Day
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dataBar} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Computer" fill={COLORSBAR[0]} />
        <Bar dataKey="Networking" fill={COLORSBAR[1]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const LogsByDeviceChart = () => (
    <div>
    <Typography variant="h6" gutterBottom>
      Logs By Device
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={dataPie}
          cx="50%"
          cy="50%"  
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {dataPie.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORSPIE[index % COLORSPIE.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    
    </div>
);