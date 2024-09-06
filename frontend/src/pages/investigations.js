
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

const InvestigationPage = () => {
  const theme = useTheme();
  const [alertStatus, setAlertStatus] = useState('Open');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [investigations, setInvestigations] = useState({ results: [], count: 0 });

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
        const fetchedInvestigations = await fetchInvestigations();
        setInvestigations(fetchedInvestigations);
        console.log(fetchedInvestigations.results);
      } catch (error) {
        console.error('Error loading investigations data', error);
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
              {investigations.results && investigations.results.length > 0 ? (
                investigations.results
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((results) => (
                    <TableRow key={results.id}>
                      <TableCell>{results.id}</TableCell>
                      <TableCell>{results.alert.event.hostname}</TableCell>
                      <TableCell><strong>{results.alert.rule}</strong></TableCell>
                      <TableCell>
                        {results.status === 'Open' && <Error color="error" />}
                        {results.status === 'In Progress' && <Search color="warning" />}
                        {results.status === 'Closed' && <CheckCircle color="success" />}
                        {' '}{results.status}
                      </TableCell>
                      <TableCell>{results.alert.created_at}</TableCell>
                      <TableCell>{results.assigned_to?.email || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" onClick={() => handleOpenDialog(results)}>
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
        <DialogTitle>
          <Typography variant="h5" component="div" gutterBottom>
            Investigate Alert
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ mt: 2 }}>
              {/* Dialog content */}
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
