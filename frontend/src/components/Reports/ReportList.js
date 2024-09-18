import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
  useTheme,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Grid,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { Visibility as VisibilityIcon, Delete as DeleteIcon, Search as SearchIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { fetchReports } from '../../services/apiService';

const reportTypes = [
  'Security Incident',
  'Network Traffic Analysis',
  'User Activity',
  'System Performance',
  'Compliance Audit'
];

const reportStatuses = [
  'Open',
  'Draft',
  'Pending',
  'Approved',
  'Rejected',
  'Archived'
];

const typeMapping = {
  'security_incident': 'Security Incident',
  'network_traffic': 'Network Traffic Analysis',
  'user_activity': 'User Activity',
  'system_performance': 'System Performance',
  'compliance_audit': 'Compliance Audit'
};

const statusMapping = {
  'draft': 'Draft',
  'pending': 'Pending',
  'open': 'Open',
  'approved': 'Approved',
  'rejected': 'Rejected',
  'closed': 'Approved',
  'archived': 'Archived'
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'open': return 'info';
    case 'pending': return 'primary';
    case 'approved': return 'success';
    case 'rejected': return 'error';
    case 'archived': return 'warning';
    case 'closed': return 'secondary';
    default: return 'default';
  }
};

const ReportList = ({ onSelect, onDelete }) => {
  const theme = useTheme();
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [page, search, type, status, lastUpdate]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetchReports(page, pageSize, search, type, status, lastUpdate);
      setReports(response.results);
      setTotalPages(Math.ceil(response.count / pageSize));
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleLastUpdateChange = (event) => {
    setLastUpdate(event.target.value);
    setPage(1);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Available Reports
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search Reports"
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={handleTypeChange} label="Type">
              <MenuItem value="">All Types</MenuItem>
              {Object.entries(typeMapping).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={handleStatusChange} label="Status">
              <MenuItem value="">All Statuses</MenuItem>
              {Object.entries(statusMapping).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            label="Last Update (YYYY-MM-DD)"
            type="date"
            value={lastUpdate}
            onChange={handleLastUpdateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
      <Tooltip title="Refresh">
        <IconButton onClick={handleSearchChange} color="primary">
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>Loading reports...</Typography>
        </Box>
      ) : reports.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography>No reports found.</Typography>
        </Box>
      ) : (
        <List>
          {reports.map((report, index) => (
            <ListItem
              key={report.id}
              divider={index !== reports.length - 1}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  transition: 'background-color 0.3s'
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {report.title}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={typeMapping[report.type] || report.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={statusMapping[report.status] || report.status}
                        size="small"
                        color={getStatusColor(report.status)}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {format(new Date(report.updated_at), 'PPP')}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => onSelect(report)}
                  color="primary"
                  sx={{
                    mr: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => onDelete(report)}
                  color="error"
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.contrastText
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Paper>
  );
};

export default ReportList;