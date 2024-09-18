import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import ReportGenerator from '../components/Reports/ReportGenerator';
import ReportList from '../components/Reports/ReportList';
import ReportViewer from '../components/Reports/ReportViewer';
import ReportExporter from '../components/Reports/ReportExporter';
import { fetchReports, createReport, updateReport, generateReportPDF, fetchRules, deleteReport } from '../services/apiService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  useEffect(() => {
    loadReports();
    loadRules();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetchReports();
      setReports(response.results || response);
    } catch (err) {
      setError('Failed to load reports');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const response = await fetchRules();
      setRules(response.results || response);
    } catch (err) {
      setError('Failed to load rules');
    }
  };

  const handleGenerate = async (newReport) => {
    try {
      const createdReport = await createReport(newReport);
      setReports([createdReport, ...reports]);
    } catch (err) {
      setError('Failed to create report');
    }
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  const handleUpdateReport = async (updatedReport) => {
    try {
      const updated = await updateReport(updatedReport.id, updatedReport);
      setReports(reports.map(r => r.id === updated.id ? updated : r));
      setSelectedReport(updated);
    } catch (err) {
      setError('Failed to update report');
    }
  };

  const handleExportPDF = async (reportId) => {
    try {
      await generateReportPDF(reportId);
      const updatedReport = await fetchReports(reportId);
      setSelectedReport(updatedReport);
    } catch (err) {
      setError('Failed to generate PDF');
    }
  };

  const handleDeleteReport = (report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReport = async () => {
    try {
      await deleteReport(reportToDelete.id);
      setReports(reports.filter(r => r.id !== reportToDelete.id));
      if (selectedReport && selectedReport.id === reportToDelete.id) {
        setSelectedReport(null);
      }
      setDeleteDialogOpen(false);
    } catch (err) {
      setError('Failed to delete report');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Reports Management
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ReportGenerator onGenerate={handleGenerate} rules={rules} />
        </Grid>
        <Grid item xs={12} md={6}>
          {reports.length > 0 && (
            <ReportList 
              reports={reports} 
              onSelect={handleSelectReport}
              onDelete={handleDeleteReport}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedReport && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                Selected Report
              </Typography>
              <ReportViewer report={selectedReport} onUpdate={handleUpdateReport} rules={rules} />
              <Box sx={{ mt: 2 }}>
                <ReportExporter report={selectedReport} onExport={() => handleExportPDF(selectedReport.id)} />
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteReport} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsPage;