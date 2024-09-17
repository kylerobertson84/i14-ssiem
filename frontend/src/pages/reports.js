import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ReportGenerator from '../components/Reports/ReportGenerator';
import ReportList from '../components/Reports/ReportList';
import ReportViewer from '../components/Reports/ReportViewer';
import ReportExporter from '../components/Reports/ReportExporter';
import { fetchReports, createReport, updateReport, generateReportPDF, fetchRules } from '../services/apiService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      showSnackbar('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const response = await fetchRules();
      setRules(response.results || response);
    } catch (err) {
      showSnackbar('Failed to load rules', 'error');
    }
  };

  const handleGenerate = async (newReport) => {
    try {
      const createdReport = await createReport(newReport);
      setReports([createdReport, ...reports]);
      showSnackbar('Report created successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to create report', 'error');
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
      showSnackbar('Report updated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to update report', 'error');
    }
  };

  const handleExportPDF = async (reportId) => {
    try {
      await generateReportPDF(reportId);
      showSnackbar('PDF generated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to generate PDF', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Reports Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ReportGenerator onGenerate={handleGenerate} rules={rules} />       
        </Grid>

        <Grid item xs={12} md={6}>
          
          <ReportList reports={reports} onSelect={handleSelectReport} />
          
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            {selectedReport ? (
              <>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
                  Selected Reports
                </Typography>
                <ReportViewer report={selectedReport} onUpdate={handleUpdateReport} rules={rules} />
                <Box sx={{ mt: 2 }}>
                  <ReportExporter report={selectedReport} onExport={() => handleExportPDF(selectedReport.id)} />
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                Select a report to view details
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReportsPage;