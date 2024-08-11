import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

const diskData = [
    { name: '5h ago', value: 60 },
    { name: '4h ago', value: 62 },
    { name: '3h ago', value: 65 },
    { name: '2h ago', value: 68 },
    { name: '1h ago', value: 70 },
    { name: 'Now', value: 75 },
  ];
  
  const ramData = [
    { name: '5h ago', value: 65 },
    { name: '4h ago', value: 40 },
    { name: '3h ago', value: 24 },
    { name: '2h ago', value: 55 },
    { name: '1h ago', value: 60 },
    { name: 'Now', value: 34 },
  ];
  
  const cpuData = [
    { name: '5h ago', value: 15 },
    { name: '4h ago', value: 50 },
    { name: '3h ago', value: 20 },
    { name: '2h ago', value: 25 },
    { name: '1h ago', value: 30 },
    { name: 'Now', value: 7 },
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
          outerRadius={80}
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

export const CpuLoadChart = () => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={cpuData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#ffc658" fillOpacity={1} fill="url(#colorCpu)" />
      </AreaChart>
    </ResponsiveContainer>
  );
  

  export const RamUsageChart = () => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={ramData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide />
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRam)" />
      </AreaChart>
    </ResponsiveContainer>
  );

  export const DiskUsageChart = () => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={diskData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" hide/>
        <YAxis hide />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorDisk)" />
      </AreaChart>
    </ResponsiveContainer>
  );
