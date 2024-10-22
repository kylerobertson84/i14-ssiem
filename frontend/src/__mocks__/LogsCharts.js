// __mocks__/LogsCharts.js
import React from "react";
import { Typography } from "@mui/material";

export const LogsPerHourChart = ({ data }) => (
    <div>
        <Typography variant="h6" gutterBottom>
            Logs Per Hour
        </Typography>
        <div style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
            <p>Mock Bar Chart with data: {JSON.stringify(data)}</p>
        </div>
    </div>
);

export const LogsByDeviceChart = ({ data }) => (
    <div>
        <Typography variant="h6" gutterBottom>
            Logs By Device
        </Typography>
        <div style={{ width: '100%', height: '300px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
            <p>Mock Pie Chart with data: {JSON.stringify(data)}</p>
        </div>
    </div>
);

export const CpuLoadChart = ({ data }) => (
    <div style={{ width: '50%', height: '80px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
        <p>Mock CPU Load Chart with data: {JSON.stringify(data)}</p>
    </div>
);

export const RamUsageChart = ({ data }) => (
    <div style={{ width: '50%', height: '80px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
        <p>Mock RAM Usage Chart with data: {JSON.stringify(data)}</p>
    </div>
);

export const DiskUsageChart = ({ data }) => (
    <div style={{ width: '50%', height: '80px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
        <p>Mock Disk Usage Chart with data: {JSON.stringify(data)}</p>
    </div>
);
