import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid
} from '@mui/material';

const ReportViewer = ({ report }) => {
  if (!report) return (
    <Typography variant="body1">Select a report to view its details.</Typography>
  );


    const generatedDate = new Date().toLocaleString();

  return (
    <Paper elevation={0} id="report-content" sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: 'bold', color: 'primary.main' }}
        gutterBottom>
            {report.reportName}
        </Typography>
        <hr/>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Status</Typography>
            <Typography variant="body1" color={getStatusColor(report.status)}>
              {report.status}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Report Type</Typography>
            <Typography variant="body1">{report.reportType}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Data Source</Typography>
            <Typography variant="body1">{report.dataSource}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Rule ID</Typography>
            <Typography variant="body1">{report.ruleId}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">User ID</Typography>
            <Typography variant="body1">{report.userId}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Generated at</Typography>
            <Typography variant="body1">
              {generatedDate}
            </Typography>
          </Box>
        </Grid>
        
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Description</Typography>
        <Typography variant="body1">{report.description}</Typography>
      </Box>
    </Paper>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'draft': return 'textSecondary';
    case 'pending review': return 'warning.main';
    case 'approved': return 'success.main';
    case 'rejected': return 'error.main';
    case 'archived': return 'secondary.main';
    default: return 'textPrimary';
  }
};

export default ReportViewer;