import React, { useState, useEffect } from 'react';
import AlertDetailsDialog from '../components/AlertDetailsDialog';
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  TablePagination,
  useTheme,
  TableSortLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
const { fetchAlerts, updateAlert } = require('../services/apiService');

const severityColors = {
  info: 'info',
  error: 'error',
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error'
};

const AlertsPage = () => {
  const theme = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  
  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts(page + 1, rowsPerPage, searchTerm, severityFilter, orderBy, order);
      console.log('Fetched data:', data);
      setAlerts(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [page, rowsPerPage, searchTerm, severityFilter, orderBy, order]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (alert) => {
    // Ensure all nested objects are present
    const completeAlert = {
      ...alert,
      event: alert.event || {},
      rule: typeof alert.rule === 'object' ? alert.rule : { name: alert.rule }
    };
    setSelectedAlert(completeAlert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAssign = async (alertId, assignee, comment) => {
    try {
      const updatedAlert = await updateAlert(alertId, { assigned_to: assignee, comments: comment });
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? updatedAlert : alert
      ));
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleSeverityFilter = (event) => {
    setSeverityFilter(event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Alerts
      </Typography>

      <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search alerts..."
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          onChange={handleSearch}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={severityFilter}
            onChange={handleSeverityFilter}
            label="Severity"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="INFO">Info</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="alerts table">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleRequestSort('id')}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'created_at'}
                  direction={orderBy === 'created_at' ? order : 'asc'}
                  onClick={() => handleRequestSort('created_at')}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'event__hostname'}
                  direction={orderBy === 'event__hostname' ? order : 'asc'}
                  onClick={() => handleRequestSort('event__hostname')}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Hostname
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'severity'}
                  direction={orderBy === 'severity' ? order : 'asc'}
                  onClick={() => handleRequestSort('severity')}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rule</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} hover>
                <TableCell>{alert.id}</TableCell>
                <TableCell>{new Date(alert.created_at).toLocaleString()}</TableCell>
                <TableCell>{alert.event?.hostname || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={alert.severity} 
                    color={severityColors[alert.severity.toLowerCase()]} 
                    size="small"
                  />
                </TableCell>
                <TableCell><strong>{typeof alert.rule === 'object' ? alert.rule.name : alert.rule}</strong></TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(alert)} size="small">
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <AlertDetailsDialog 
        alert={selectedAlert}
        open={openDialog}
        onClose={handleCloseDialog}
        onAssign={handleAssign}
      />
    </Container>
  );
};

export default AlertsPage;