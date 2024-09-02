import React, { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Pagination,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  Search as SearchIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';
import { fetchComputerLogs, fetchRouterLogs, exportPDF } from '../services/apiService';

const LogQueries = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [searchParams, setSearchParams] = useState({
    query: '',
    startTime: null,
    endTime: null,
  });
  const [computerLogs, setComputerLogs] = useState([]);
  const [routerLogs, setRouterLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async () => {
    try {
      if (activeTab === 0) {
        const response = await fetchComputerLogs(searchParams, page, pageSize);
        setComputerLogs(response.results);
        setTotalResults(response.count);
      } else {
        const response = await fetchRouterLogs(searchParams, page, pageSize);
        setRouterLogs(response.results);
        setTotalResults(response.count);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportPDF(activeTab === 0 ? 'computer' : 'router', searchParams);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab === 0 ? 'computer' : 'router'}_logs.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  useEffect(() => {
    if (searchParams.query || searchParams.startTime || searchParams.endTime) {
      handleSearch();
    }
  }, [activeTab, page, pageSize]);

  const renderComputerLogsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Hostname</TableCell>
            <TableCell>Event Type</TableCell>
            <TableCell>Event ID</TableCell>
            <TableCell>Account Name</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {computerLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.iso_timestamp}</TableCell>
              <TableCell>{log.hostname}</TableCell>
              <TableCell>{log.EventType}</TableCell>
              <TableCell>{log.EventID}</TableCell>
              <TableCell>{log.AccountName}</TableCell>
              <TableCell>
                <Typography noWrap>
                  {log.message ? log.message.substring(0, 100) + '...' : 'N/A'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderRouterLogsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Hostname</TableCell>
            <TableCell>Process</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routerLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.date_time}</TableCell>
              <TableCell>{log.hostname}</TableCell>
              <TableCell>{log.process}</TableCell>
              <TableCell>
                <Typography noWrap>
                  {log.message ? log.message.substring(0, 100) + '...' : 'N/A'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Log Queries
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Computer Logs" />
        <Tab label="Router Logs" />
      </Tabs>

      <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Logs"
            name="query"
            value={searchParams.query}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Time"
              value={searchParams.startTime}
              onChange={(newValue) => handleDateChange('startTime', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="End Time"
              value={searchParams.endTime}
              onChange={(newValue) => handleDateChange('endTime', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {(computerLogs.length > 0 || routerLogs.length > 0) && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Typography variant="h6">
              Search Results ({totalResults})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
            >
              Export PDF
            </Button>
          </Box>

          {activeTab === 0 ? renderComputerLogsTable() : renderRouterLogsTable()}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(totalResults / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default LogQueries;