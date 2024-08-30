import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import LogDetails from '../components/LogDetails';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

const severityOptions = [
  { value: 'Low', color: 'success' },
  { value: 'Medium', color: 'warning' },
  { value: 'High', color: 'error' },
  { value: 'Critical', color: 'error' }
];

const Queries = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filters, setFilters] = useState({
    device: '',
    host: '',
    startTime: null,
    endTime: null,
    severity: '',
    process: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const tableData = [
    { device: 'Device 1', ip: '192.168.1.1', time: '2024-04-11T12:00:00', severity: 'High', process: 'dhcpd', details: 'Log details for Device 1' },
    { device: 'Device 2', ip: '192.168.1.2', time: '2024-04-12T13:00:00', severity: 'Medium', process: 'kern', details: 'Log details for Device 2' },
    { device: 'Device 3', ip: '192.168.1.3', time: '2024-04-13T14:00:00', severity: 'Low', process: 'dhcpd', details: 'Log details for Device 3' },
    { device: 'Device 4', ip: '192.168.1.4', time: '2024-04-14T15:00:00', severity: 'Critical', process: 'dhcpd', details: 'Log details for Device 4' },
    { device: 'Device 5', ip: '192.168.1.5', time: '2024-04-15T16:00:00', severity: 'High', process: 'Windows Kernel', details: 'Log details for Device 5' },
    { device: 'Device 6', ip: '192.168.1.6', time: '2024-04-16T17:00:00', severity: 'Medium', process: 'Windows Kernel', details: 'Log details for Device 6' },
    { device: 'Device 7', ip: '192.168.1.7', time: '2024-04-17T18:00:00', severity: 'Low', process: 'Application Hang', details: 'Log details for Device 7' },
    { device: 'Device 8', ip: '192.168.1.8', time: '2024-04-18T19:00:00', severity: 'Critical', process: 'Application Hang', details: 'Log details for Device 8' }
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleTimeChange = (name, value) => {
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSearch = () => {
    // This function here should be handled by the backend
    const results = tableData.filter(log => {
      const logTime = new Date(log.time);
      return Object.entries(filters).every(([key, value]) => {
        if (key === 'startTime' && value) {
          // Filter logs with time greater than or equal to the start time
          return logTime >= new Date(value);
        }
        if (key === 'endTime' && value) {
          // Filter logs with time less than or equal to the end time
          return logTime <= new Date(value);
        }
        if (!value) return true;
        if (key === 'process') {
          return value.split(',').some(p => 
            log[key].toLowerCase().includes(p.trim().toLowerCase())
          );
        }
        // Filter logs with case-insensitive match
        if (key === 'device' || key === 'ip' || key === 'severity') {
          return log[key].toLowerCase().includes(value.toLowerCase());
        }
        return true;
      });
    });
    setSearchResults(results);
  };

  const handleClear = () => {
    setFilters({
      device: '',
      IP: '',
      startTime: null,
      endTime: null,
      severity: '',
      process: ''
    });
    setSearchResults([]);
  };

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

  const renderSearchFields = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          name="device"
          label="Device"
          variant="outlined"
          fullWidth
          value={filters.device}
          onChange={handleFilterChange}
          placeholder="Enter device"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          name="host"
          label="Host"
          variant="outlined"
          fullWidth
          value={filters.host}
          onChange={handleFilterChange}
          placeholder="Enter host"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Severity</InputLabel>
          <Select
            name="severity"
            value={filters.severity}
            onChange={handleFilterChange}
            label="Severity"
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {severityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Chip 
                  label={option.value}
                  size="small"
                  color={option.color}
                  sx={{ mr: 1 }}
                />
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="process"
          label="Process"
          variant="outlined"
          fullWidth
          value={filters.process}
          onChange={handleFilterChange}
          placeholder="Enter process"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2}>
            <DateTimePicker
              label="Start Time"
              value={filters.startTime}
              onChange={(newValue) => handleTimeChange('startTime', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DateTimePicker
              label="End Time"
              value={filters.endTime}
              onChange={(newValue) => handleTimeChange('endTime', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Stack>
        </LocalizationProvider>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Log Queries
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        {renderSearchFields()}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            sx={{ borderRadius: 2 }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{ borderRadius: 2 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      {searchResults.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Search Results ({searchResults.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={exportResults}
              sx={{ borderRadius: 2 }}
            >
              Export
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Device</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IP</TableCell>
                  {!isMobile && (
                    <>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Severity</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Process</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((row, index) => (
                  <TableRow 
                    key={index} 
                    onClick={() => handleRowClick(row)} 
                    hover 
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover }, cursor: 'pointer' }}
                  >
                    <TableCell>{row.device}</TableCell>
                    <TableCell>{row.ip}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{formatDate(row.time)}</TableCell>
                        <TableCell>
                          <Chip
                            label={row.severity}
                            color={
                              row.severity === 'High' || row.severity === 'Critical'
                                ? 'error'
                                : row.severity === 'Medium'
                                ? 'warning'
                                : 'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{row.process}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {selectedLog && <LogDetails log={selectedLog} />}
    </Container>
  );
};

export default Queries;