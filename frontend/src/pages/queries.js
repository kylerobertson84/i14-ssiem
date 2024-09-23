import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Box,
  Tabs,
  Tab,
  useTheme,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { enAU } from 'date-fns/locale';
import {
  Search as SearchIcon,
  GetApp as ExportIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
} from '@mui/icons-material';
import { fetchComputerLogs, fetchRouterLogs, exportCSV } from '../services/apiService';
import SEO from '../Design/SEO.js';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  };
  const formattedDate = date.toLocaleString('en-AU', options);
  return formattedDate.replace(',', '');
};

const LogQueries = () => {
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState(0);
  const [searchParams, setSearchParams] = useState({
    query: '',
    startTime: null,
    endTime: null,
  });
  const [logs, setLogs] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState(null);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const fetchFunction = activeTab === 0 ? fetchComputerLogs : fetchRouterLogs;
      const response = await fetchFunction(searchParams, page + 1, rowsPerPage, orderBy, order);
      setLogs(response.results);
      setTotalResults(response.count);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      if (totalResults === 0) {
        setSnackbar({
          open: true,
          message: 'No data to export. Please perform a search first.',
          severity: 'warning',
        });
        return;
      }

      const response = await exportCSV(activeTab === 0 ? 'computer' : 'router', searchParams);
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

    // Set the download attribute to specify the file name
      link.href = url;
      link.setAttribute('download', `${activeTab === 0 ? 'computer' : 'router'}_logs.csv`);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      let errorMessage = 'Failed to export PDF. Please try again.';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'The requested data for export could not be found.';
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid request. Please check your search parameters.';
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
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
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (log) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchParams({
      query: '',
      startTime: null,
      endTime: null,
    });
    setPage(0);
    setOrderBy('');
    setOrder('asc');
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handleLastPage = () => {
    setPage(Math.max(0, Math.ceil(totalResults / rowsPerPage) - 1));
  };

  useEffect(() => {
    handleSearch();
  }, [activeTab, page, rowsPerPage, orderBy, order]);

  const computerColumns = [
    { id: 'iso_timestamp', label: 'Timestamp', minWidth: 170 },
    { id: 'hostname', label: 'Hostname', minWidth: 100 },
    { id: 'EventType', label: 'Event Type', minWidth: 100 },
    { id: 'EventID', label: 'EventID', minWidth: 100 },
    { id: 'AccountName', label: 'Account', minWidth: 100 },
    { id: 'message', label: 'Message', minWidth: 200 },
  ];

  const routerColumns = [
    { id: 'date_time', label: 'Timestamp', minWidth: 170 },
    { id: 'hostname', label: 'Hostname', minWidth: 100 },
    { id: 'process', label: 'Process', minWidth: 100 },
    { id: 'message', label: 'Message', minWidth: 200 },
  ];

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const LogDetailDialog = ({ log, open, onClose, isComputerLog }) => {
    const renderLogDetail = (label, value) => (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">
          {value !== null && value !== undefined && value !== "" ? value.toString() : 'N/A'}
        </Typography>
      </Box>
    );
  
    if (!log) {
      return null;
    }
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {renderLogDetail("Log ID", log.id)}
                {renderLogDetail("Timestamp", formatDate(log.iso_timestamp || log.date_time))}
                {renderLogDetail("Hostname", log.hostname)}
              </Grid>
              <Grid item xs={12} md={6}>
                {isComputerLog ? (
                  <>
                    {renderLogDetail("Event Type", log.EventType)}
                    {renderLogDetail("Event ID", log.EventID)}
                    {renderLogDetail("Account Name", log.AccountName)}
                  </>
                ) : (
                  <>
                    {renderLogDetail("Process", log.process)}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                {renderLogDetail("Message", log.message)}
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  const columns = activeTab === 0 ? computerColumns : routerColumns;

  return (
    <>
      <SEO 
				title="Queries" 
			/>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }} fontWeight="bold">
          Log Queries
        </Typography>
        <Paper elevation={3} sx={{ mb: 3, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search hostname, process or message"
                name="query"
                value={searchParams.query}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider 
                dateAdapter={AdapterDateFns}
                adapterLocale={enAU}
                >
                <DateTimePicker
                  label="Start Time"
                  value={searchParams.startTime}
                  onChange={(newValue) => handleDateChange('startTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider 
                dateAdapter={AdapterDateFns}
                adapterLocale={enAU}
              >
                <DateTimePicker
                  label="End Time"
                  value={searchParams.endTime}
                  onChange={(newValue) => handleDateChange('endTime', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ mb: 1 }}
              >
                Search
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3}>
          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Computer Logs" />
            <Tab label="Router Logs" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Results: {totalResults}
              </Typography>
              <Box>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleSearch} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Export to PDF">
                  <IconButton onClick={handleExport} color="primary">
                    <ExportIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Snackbar 
              open={snackbar.open} 
              autoHideDuration={6000} 
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="log table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{ color: 'white', fontWeight: 'bold' }}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleRequestSort(column.id)}
                          sx={{
                            color: 'white',
                            '&.MuiTableSortLabel-root:hover': {
                              color: 'white',
                            },
                            '&.MuiTableSortLabel-root.Mui-active': {
                              color: 'white',
                            },
                            '& .MuiTableSortLabel-icon': {
                              color: 'white !important',
                            },
                          }}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log.id}
                      hover
                      onClick={() => handleRowClick(log)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === 'iso_timestamp'
                            ? formatDate(log[column.id])
                            : column.id === 'message'
                            ? log[column.id].substring(0, 100) + (log[column.id].length > 100 ? '...' : '')
                            : log[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Tooltip title="First Page">
                  <IconButton onClick={handleFirstPage} disabled={page === 0}>
                    <FirstPageIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Last Page">
                  <IconButton onClick={handleLastPage} disabled={page >= Math.ceil(totalResults / rowsPerPage) - 1}>
                    <LastPageIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalResults}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Box>
        </Paper>

        <LogDetailDialog
          log={selectedLog}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          isComputerLog={activeTab === 0}
        />
      </Container>
    </>

  );
};

export default LogQueries;