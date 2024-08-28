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
  IconButton,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import LogDetails from '../components/LogDetails';

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
    ip: '',
    time: '',
    severity: '',
    process: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const tableData = [
    { device: 'Device 1', ip: '192.168.1.1', time: 'Apr 11 12:00 PM', severity: 'High', process: 'dhcpd', details: 'Log details for Device 1' },
    { device: 'Device 2', ip: '192.168.1.2', time: 'Apr 12 01:00 PM', severity: 'Medium', process: 'kern', details: 'Log details for Device 2' },
    { device: 'Device 3', ip: '192.168.1.3', time: 'Apr 13 02:00 PM', severity: 'Low', process: 'dhcpd', details: 'Log details for Device 3' },
    { device: 'Device 4', ip: '192.168.1.4', time: 'Apr 14 03:00 PM', severity: 'Critical', process: 'dhcpd', details: 'Log details for Device 4' },
    { device: 'Device 5', ip: '192.168.1.5', time: 'Apr 15 04:00 PM', severity: 'High', process: 'Windows Kernel', details: 'Log details for Device 5' },
    { device: 'Device 6', ip: '192.168.1.6', time: 'Apr 16 05:00 PM', severity: 'Medium', process: 'Windows Kernel', details: 'Log details for Device 6' },
    { device: 'Device 7', ip: '192.168.1.7', time: 'Apr 17 06:00 PM', severity: 'Low', process: 'Application Hang', details: 'Log details for Device 7' },
    { device: 'Device 8', ip: '192.168.1.8', time: 'Apr 18 07:00 PM', severity: 'Critical', process: 'Application Hang', details: 'Log details for Device 8' }
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = () => {
    const results = tableData.filter(log => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'process') {
          return value.split(',').some(p => 
            log[key].toLowerCase().includes(p.trim().toLowerCase())
          );
        }
        return log[key].toLowerCase().includes(value.toLowerCase());
      });
    });
    setSearchResults(results);
  };

  const handleClear = () => {
    setFilters({
      device: '',
      ip: '',
      time: '',
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
      {Object.entries(filters).map(([key, value]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          {key === 'severity' ? (
            <FormControl fullWidth variant="outlined">
              <InputLabel>Severity</InputLabel>
              <Select
                name="severity"
                value={value}
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
          ) : (
            <TextField
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              variant="outlined"
              fullWidth
              value={value}
              onChange={handleFilterChange}
              placeholder={`Enter ${key}`}
            />
          )}
        </Grid>
      ))}
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
                    sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                  >
                    <TableCell>{row.device}</TableCell>
                    <TableCell>{row.ip}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{row.time}</TableCell>
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