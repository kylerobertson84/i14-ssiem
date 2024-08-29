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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Visibility as ViewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import alertsData from '../data/alerts.json';

const severityColors = {
  info: 'info',
  error: 'error',
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error'
};

const AlertDetailsDialog = ({ alert, open, onClose, onAssign }) => {
  const [assignee, setAssignee] = useState(alert?.assigned_to || '');
  const [comment, setComment] = useState(alert?.comments || '');

  if (!alert) return null;

  const handleAssign = () => {
    onAssign(alert.id, assignee, comment);
    onClose();
  };

  const excludedFields = ['comments', 'assigned_to'];
  const filteredAlertEntries = Object.entries(alert).filter(([key]) => !excludedFields.includes(key));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Alert Details</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
          <TableBody>
              {filteredAlertEntries.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>
                    {key.charAt(0).toUpperCase() + key.split('_').join(' ').slice(1)}
                  </TableCell>
                  <TableCell>{value.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" gutterBottom>Assignment</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assign To</InputLabel>
          <Select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            label="Assign To"
          >
            <MenuItem value="">Unassigned</MenuItem>
            <MenuItem value="John Doe">John Doe</MenuItem>
            <MenuItem value="Jane Smith">Jane Smith</MenuItem>
            <MenuItem value="Alice Johnson">Alice Johnson</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleAssign} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AlertsPage = () => {
  const theme = useTheme();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('');
  const [orderBy, setOrderBy] = useState('event_time');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    setAlerts(alertsData);
    setFilteredAlerts(alertsData);
  }, []);

  useEffect(() => {
    const filtered = alerts.filter(
      (alert) =>
        (alert.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (severityFilter ? alert.severity === severityFilter : true)
    );
    setFilteredAlerts(filtered);
    setPage(0);
  }, [searchTerm, severityFilter, alerts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAssign = (alertId, assignee, comment) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, assigned_to: assignee, comments: comment } : alert
    ));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedAlerts = filteredAlerts.sort((a, b) => {
    if (order === 'desc') {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    }
  });

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
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            label="Severity"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="alerts table">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'event_time'}
                  direction={orderBy === 'event_time' ? order : 'asc'}
                  onClick={() => handleRequestSort('event_time')}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  Time
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'hostname'}
                  direction={orderBy === 'hostname' ? order : 'asc'}
                  onClick={() => handleRequestSort('hostname')}
                >
                  Hostname
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'severity'}
                  direction={orderBy === 'severity' ? order : 'asc'}
                  onClick={() => handleRequestSort('severity')}
                >
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Message</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAlerts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((alert) => (
                <TableRow key={alert.id} hover>
                  <TableCell>{alert.event_time}</TableCell>
                  <TableCell>{alert.hostname}</TableCell>
                  <TableCell>
                    <Chip 
                      label={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} 
                      color={severityColors[alert.severity.toLowerCase()]} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{alert.message}</TableCell>
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
        count={filteredAlerts.length}
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