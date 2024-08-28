import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Pagination,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import alertsData from '../data/alerts.json';

const severityColors = {
  info: 'info',
  error: 'error',
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error'
};

const AlertCard = ({ alert, onViewDetails }) => {
  const theme = useTheme();

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {alert.hostname}
        </Typography>
        <Chip 
          label={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} 
          color={severityColors[alert.severity.toLowerCase()]} 
          size="small" 
          sx={{ mb: 1 }} 
        />
        <Typography variant="body2" color="text.secondary">
          {alert.message}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={() => onViewDetails(alert)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const AlertDetailsDialog = ({ alert, open, onClose }) => {
  if (!alert) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Alert Details</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {Object.entries(alert).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    {key.charAt(0).toUpperCase() + key.split('_').join(' ').slice(1)}
                  </TableCell>
                  <TableCell>{value.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const alertsPerPage = 6;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setAlerts(alertsData);
  }, []);

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Alerts
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search alerts..."
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Grid container spacing={3}>
        {currentAlerts.map(alert => (
          <Grid item key={alert.id} xs={12} sm={6} md={4}>
            <AlertCard alert={alert} onViewDetails={handleViewDetails} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={Math.ceil(filteredAlerts.length / alertsPerPage)} 
          page={currentPage} 
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? "small" : "medium"}
        />
      </Box>

      <AlertDetailsDialog 
        alert={selectedAlert}
        open={openDialog}
        onClose={handleCloseDialog}
      />
    </Container>
  );
};

export default AlertsPage;