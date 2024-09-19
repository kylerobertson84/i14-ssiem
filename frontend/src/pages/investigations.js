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
  Box
} from '@mui/material';
import { Search, CheckCircle, Error } from '@mui/icons-material';
import '../Design/Investigation.css';
import { fetchInvestigations, updateInvestigationStatus } from '../services/apiService';

const InvestigationPage = () => {
  const theme = useTheme();
  const [investigations, setInvestigations] = useState({ results: [], count: 0 });
  const [alertStatus, setAlertStatus] = useState('OPEN');
  const [notes, setNotes] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const loadInvestigations = async () => {
      try {
        const fetchedInvestigations = await fetchInvestigations();
        console.log("Fetched Investigations: ", fetchedInvestigations.results);
        setInvestigations(fetchedInvestigations);
      } catch (error) {
        console.error('Error loading investigations data', error);
      }
    };
    loadInvestigations();
  }, []);

  useEffect(() => {
    if (selectedAlert) {
      console.log("Selected Alert:", selectedAlert);
    }
  }, [selectedAlert]);

  const handleOpenDialog = (alert) => {
    console.log('Opening Dialog with Alert:', alert);
    setSelectedAlert(alert);
    setAlertStatus(alert.status);
    setNotes(alert.notes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleStatusChange = (event) => {
    const statusValue = event.target.value;
    const mappedStatus = {
      'Open': 'OPEN',
      'In Progress': 'IN PROGRESS',
      'Closed': 'CLOSED'
    }[statusValue] || statusValue;
    setAlertStatus(mappedStatus);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateStatus = async () => {
    if (selectedAlert) {
      try {
        await updateInvestigationStatus(selectedAlert.id, { status: alertStatus, notes });
        setOpenDialog(false);
        const updatedInvestigations = await fetchInvestigations();
        setInvestigations(updatedInvestigations);
      } catch (error) {
        console.error('Error updating status', error);
      }
    }
  };

  const renderAlertDetail = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="xlg" className="investigation-page">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Investigations
      </Typography>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
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
              {investigations.results.length > 0 ? (
                investigations.results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.id}</TableCell>
                      <TableCell>{result.alert?.event?.hostname || 'N/A'}</TableCell>
                      <TableCell>{result.alert?.rule || 'N/A'}</TableCell>
                      <TableCell>
                        {result.status === 'OPEN' && <Error color="error" />}
                        {result.status === 'IN PROGRESS' && <Search color="warning" />}
                        {result.status === 'CLOSED' && <CheckCircle color="success" />}
                        {' '}{result.status}
                      </TableCell>
                      <TableCell>{new Date(result.alert?.created_at).toLocaleString()}</TableCell>
                      <TableCell>{result.assigned_to?.email || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(result)}>
                          Investigate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No investigations found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={investigations.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Dialog for investigation */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Investigate Alert</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {renderAlertDetail("Alert ID", selectedAlert?.alert?.id)}
                {renderAlertDetail("Created At", new Date(selectedAlert?.alert?.created_at).toLocaleString())}
                {renderAlertDetail("Severity", selectedAlert?.alert?.severity)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderAlertDetail("Hostname", selectedAlert?.alert?.event?.hostname)}
                {renderAlertDetail("Event ID", selectedAlert?.alert?.event?.EventID)}
                {renderAlertDetail("User ID", selectedAlert?.alert?.event?.UserID || "N/A")}
              </Grid>
              <Grid item xs={12}>
                {renderAlertDetail("Rule", selectedAlert?.alert?.rule)}
              </Grid>
            </Grid>
          </Paper>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Change Status</Typography>
            <Select value={alertStatus} onChange={handleStatusChange}>
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="IN PROGRESS">In Progress</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Notes</Typography>
            <TextField
              multiline
              minRows={3}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add investigation notes here"
            />
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleUpdateStatus} color="primary" variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvestigationPage;
