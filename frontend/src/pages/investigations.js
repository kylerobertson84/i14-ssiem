import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Divider,
  Box
} from '@mui/material';
import { Search, CheckCircle, Error } from '@mui/icons-material';
import '../Design/Investigation.css'

import { fetchInvestigations } from '../services/apiService';

const mockAlerts = [
  { id: 1, device: 'WDT-01', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-08-28 10:15:23', assignedTo: 'John Doe' },
  { id: 2, device: 'WDT-01', type: 'New User Account Created', status: 'In Progress', timestamp: '2024-08-28 11:30:45', assignedTo: 'Jane Smith' },
  { id: 3, device: 'WDT-03', type: 'Failed Login Attempt', status: 'Closed', timestamp: '2024-08-28 12:45:12', assignedTo: 'John Doe' },
  { id: 4, device: 'WDT-04', type: 'Windows Defender Detected Malware', status: 'Open', timestamp: '2024-08-28 14:20:37', assignedTo: 'Jane Smith' },
  { id: 5, device: 'WDT-05', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-08-28 15:55:59', assignedTo: 'David B' },
  { id: 6, device: 'WDT-06', type: 'Failed Login Attempt', status: 'Closed', timestamp: '2024-08-28 17:10:22', assignedTo: 'Alice C' },
  { id: 7, device: 'WDT-07', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-08-28 18:35:44', assignedTo: 'Charlie D' },
];

const InvestigationPage = () => {
  const theme = useTheme();
  const [alertStatus, setAlertStatus] = useState('Open');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [investigations, setInvestigations] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusChange = (event) => {
    setAlertStatus(event.target.value);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ fetchedInvestigations ] = await Promise.all([
          fetchInvestigations(),

        ]);

        setInvestigations(fetchedInvestigations);

        console.log(fetchedInvestigations.results)
        
      } catch (error) {
        console.error('Error loading dashboard data', error);
      }
    };

    loadData();
  }, []);



  return (
    <Container maxWidth="xlg" className="investigation-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Investigations
      </Typography>
      <Paper elevation={3}>
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main}}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Device</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Alert Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Timestamp</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAlerts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.id}</TableCell>
                    <TableCell>{alert.device}</TableCell>
                    <TableCell><strong>{alert.type}</strong></TableCell>
                    <TableCell>
                      {alert.status === 'Open' && <Error color="error" />}
                      {alert.status === 'In Progress' && <Search color="warning" />}
                      {alert.status === 'Closed' && <CheckCircle color="success" />}
                      {' '}{alert.status}
                    </TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell>{alert.assignedTo || 'Unassigned'}
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleOpenDialog(alert)}>
                        Investigate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockAlerts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" gutterBottom>
            Investigate Alert
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Alert Information</Typography>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">ID</Typography>
                        <Typography variant="body1">{selectedAlert.id}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Device</Typography>
                        <Typography variant="body1">{selectedAlert.device}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Type</Typography>
                        <Typography variant="body1">{selectedAlert.type}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Time Stamp</Typography>
                        <Typography variant="body1">{selectedAlert.timestamp}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Status & Assignment</Typography>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Status</Typography>
                        <FormControl fullWidth size="small">
                          <Select
                            value={alertStatus}
                            onChange={handleStatusChange}
                          >
                            <MenuItem value="Open">Open</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Assigned To</Typography>
                        <Typography variant="body1">{selectedAlert.assignedTo || 'Unassigned'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight='bold' gutterBottom>Investigation Notes</Typography>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your investigation notes here..."
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvestigationPage;