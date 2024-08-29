import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box
} from '@mui/material';
import ReportGenerator from '../components/Reports/ReportGenerator';
import ReportList from '../components/Reports/ReportList';
import ReportViewer from '../components/Reports/ReportViewer';
import ReportExporter from '../components/Reports/ReportExporter';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleGenerate = (newReport) => {
    setReports([...reports, newReport]);
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Reports Management
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ReportGenerator onGenerate={handleGenerate} />
        </Grid>

        <Grid item xs={12} md={6}>
          {reports.length > 0 && (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <ReportList reports={reports} onSelect={handleSelectReport} />
          </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedReport && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Selected Report</Typography>
              <ReportViewer report={selectedReport} />
              <Box sx={{ mt: 2 }}>
                <ReportExporter report={selectedReport} />
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsPage;