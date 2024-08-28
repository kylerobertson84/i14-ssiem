import React, { useState } from 'react';
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
  TextField
} from '@mui/material';
import { Search, CheckCircle, Error } from '@mui/icons-material';
import '../Design/Investigation.css'

const mockAlerts = [
  { id: 1, device: 'WDT-01', type: 'Failed Login Attempt', status: 'Open', timestamp: '2024-08-28 10:15:23' },
  { id: 2, device: 'WDT-01', type: 'New User Account Created', status: 'In Progress', timestamp: '2024-08-28 11:30:45' },
  { id: 3, device: 'WDT-03', type: 'Failed Login Attempt', status: 'Closed', timestamp: '2024-08-28 12:45:12' },
  { id: 4, device: 'WDT-04', type: 'Windows Defender Detected Malware', status: 'Open', timestamp: '2024-08-28 14:20:37' },
];

const InvestigationPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

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

  return (
    <Container maxWidth="lg" className="investigation-page">
      <Typography variant="h4" component="h1" gutterBottom>
        Investigation
      </Typography>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Alert Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAlerts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.id}</TableCell>
                    <TableCell>{alert.device}</TableCell>
                    <TableCell>{alert.type}</TableCell>
                    <TableCell>
                      {alert.status === 'Open' && <Error color="error" />}
                      {alert.status === 'In Progress' && <Search color="warning" />}
                      {alert.status === 'Closed' && <CheckCircle color="success" />}
                      {' '}{alert.status}
                    </TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
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
        <DialogTitle>Investigate Alert</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <>
              <Typography variant="h6" gutterBottom>
                Alert Details
              </Typography>
              <Typography><strong>ID:</strong> {selectedAlert.id}</Typography>
              <Typography><strong>Device:</strong> {selectedAlert.device}</Typography>
              <Typography><strong>Type:</strong> {selectedAlert.type}</Typography>
              <Typography><strong>Status:</strong> {selectedAlert.status}</Typography>
              <Typography><strong>Timestamp:</strong> {selectedAlert.timestamp}</Typography>
              <TextField
                label="Investigation Notes"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          <Button onClick={handleCloseDialog} color="primary" variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvestigationPage;