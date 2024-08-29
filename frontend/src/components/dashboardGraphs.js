import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { Typography, Box } from '@mui/material';

const COLORSBAR = ['#0088FE', '#00C49F'];
const COLORSPIE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const LogsPerHourChart = ({ data }) => (
  <div>
    <Typography variant="h6" gutterBottom>
      Logs Per Hour
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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

export const LogsByDeviceChart = ({ data }) => (
    <div>
    <Typography variant="h6" gutterBottom>
      Logs By Device
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"  
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORSPIE[index % COLORSPIE.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
    
    </div>
);

export const CpuLoadChart = ({ data }) => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
  

  export const RamUsageChart = ({ data }) => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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

  export const DiskUsageChart = ({ data }) => (
    <ResponsiveContainer width="50%" height={80}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
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
