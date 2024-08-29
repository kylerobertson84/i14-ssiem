import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const reportTypes = [
  'Security Incident',
  'Network Traffic Analysis',
  'User Activity',
  'System Performance',
  'Compliance Audit'
];

const reportStatuses = [
  'Draft',
  'Pending Review',
  'Approved',
  'Rejected',
  'Archived'
];

const ReportGenerator = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    reportName: '',
    reportType: '',
    status: '',
    dataSource: '',
    ruleId: '',
    userId: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(reportData);
    setReportData({
      reportName: '',
      reportType: '',
      status: '',
      dataSource: '',
      ruleId: '',
      userId: '',
      description: ''
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
          Generate New Report
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Report Name"
                name="reportName"
                value={reportData.reportName}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Report Type</InputLabel>
                <Select
                  name="reportType"
                  value={reportData.reportType}
                  onChange={handleChange}
                  label="Report Type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={reportData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {reportStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data Source"
                name="dataSource"
                value={reportData.dataSource}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rule ID"
                name="ruleId"
                value={reportData.ruleId}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="User ID"
                name="userId"
                value={reportData.userId}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={reportData.description}
                onChange={handleChange}
                required
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              sx={{ borderRadius: 2 }}
            >
              Generate Report
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ReportGenerator;