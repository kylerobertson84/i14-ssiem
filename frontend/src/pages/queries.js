

import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LogDetails from '../components/LogDetails';
import Navbar from '../components/NavBar';

const Queries = () => {
  const [device, setDevice] = useState('');
  const [ip, setIp] = useState('');
  const [time, setTime] = useState('');
  const [severity, setSeverity] = useState('');
  const [process, setProcess] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  // Function to filter the data based on the search criteria
  const handleSearch = () => {
    const results = tableData.filter(log => {
      const matchesDevice = device ? log.device.toLowerCase().includes(device.toLowerCase()) : true;
      const matchesIp = ip ? log.ip.toLowerCase().includes(ip.toLowerCase()) : true;
      const matchesTime = time ? log.time.toLowerCase().includes(time.toLowerCase()) : true;
      const matchesSeverity = severity ? log.severity.toLowerCase() === severity.toLowerCase() : true;
      const matchesProcess = process ? process.split(',').map(p => p.trim().toLowerCase()).includes(log.process.toLowerCase()) : true;
      return matchesDevice && matchesIp && matchesTime && matchesSeverity && matchesProcess;
    });
    setSearchResults(results);
  };

  const [tableData, setTableData] = useState([
    // Sample data for demonstration
    { device: 'Device 1', ip: '192.168.1.1', time: 'Apr 11 12:00 PM', severity: 'High', process: 'dhcpd', details: 'Log details for Device 1' },
    { device: 'Device 2', ip: '192.168.1.2', time: 'Apr 12 01:00 PM', severity: 'Medium', process: 'kern', details: 'Log details for Device 2' },
    { device: 'Device 3', ip: '192.168.1.3', time: 'Apr 13 02:00 PM', severity: 'Low', process: 'dhcpd', details: 'Log details for Device 3' },
    { device: 'Device 4', ip: '192.168.1.4', time: 'Apr 14 03:00 PM', severity: 'Critical', process: 'dhcpd', details: 'Log details for Device 4' },
    { device: 'Device 5', ip: '192.168.1.5', time: 'Apr 15 04:00 PM', severity: 'High', process: 'Windows Kernel', details: 'Log details for Device 5' },
    { device: 'Device 6', ip: '192.168.1.6', time: 'Apr 16 05:00 PM', severity: 'Medium', process: 'Windows Kernel', details: 'Log details for Device 6' },
    { device: 'Device 7', ip: '192.168.1.7', time: 'Apr 17 06:00 PM', severity: 'Low', process: 'Application Hang', details: 'Log details for Device 7' },
    { device: 'Device 8', ip: '192.168.1.8', time: 'Apr 18 07:00 PM', severity: 'Critical', process: 'Application Hang', details: 'Log details for Device 8' }
  ]);

  const handleRowClick = (log) => {
    setSelectedLog(log);
  };

  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + searchResults.map(e => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "log_search_results.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Container maxWidth="lg">
      <Navbar />
      <Typography variant="h3" component="h1" gutterBottom>
        Queries
      </Typography>

      <TextField
        label="Device"
        variant="outlined"
        fullWidth
        placeholder="Enter device name"
        value={device}
        onChange={(e) => setDevice(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="IP"
        variant="outlined"
        fullWidth
        placeholder="Enter IP address"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Time"
        variant="outlined"
        fullWidth
        placeholder="Enter time (e.g., Apr 11 12:00 PM)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Severity"
        variant="outlined"
        fullWidth
        placeholder="Enter severity (e.g., High, Medium, Low, Critical)"
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        label="Process"
        variant="outlined"
        fullWidth
        placeholder="Enter processes (comma-separated)"
        value={process}
        onChange={(e) => setProcess(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSearch}
        sx={{ mb: 4 }}
      >
        Search
      </Button>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Process</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.map((row, index) => (
              <TableRow key={index} onClick={() => handleRowClick(row)} hover>
                <TableCell>{row.device}</TableCell>
                <TableCell>{row.ip}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.severity}</TableCell>
                <TableCell>{row.process}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={exportResults}
        sx={{ mt: 3 }}
      >
        Export Results
      </Button>

      <LogDetails log={selectedLog} />
    </Container>
  );
};

export default Queries;