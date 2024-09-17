import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Typography,
  Box,
  Paper,
  useTheme,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchRules } from '../../services/apiService';

const reportTypes = [
  'Security Incident',
  'Network Traffic Analysis',
  'User Activity',
  'System Performance',
  'Compliance Audit'
];

const reportStatuses = [
  'Open',
  'Pending Review',
  'Approved',
  'Rejected',
  'Archived',
  'Closed'
];

const reportTypeMapping = {
  'Security Incident': 'security_incident',
  'Network Traffic Analysis': 'network_traffic',
  'User Activity': 'user_activity',
  'System Performance': 'system_performance',
  'Compliance Audit': 'compliance_audit'
};

const reportStatusMapping = {
  'Open': 'open',
  'Pending Review': 'pending',
  'Approved': 'closed',
  'Rejected': 'rejected',
  'Archived': 'archived',
};

const ReportGenerator = ({ onGenerate }) => {
  const [reportData, setReportData] = useState({
    title: '',
    type: '',
    status: '',
    description: '',
    rule_ids: []
  });
  const [rules, setRules] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const response = await fetchRules();
      setRules(response.results || response);
    } catch (err) {
      console.error('Failed to load rules', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRuleChange = (event, newValue) => {
    setReportData(prevData => ({
      ...prevData,
      rule_ids: newValue.map(rule => rule.id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mappedReportData = {
      ...reportData,
      type: reportTypeMapping[reportData.type],
      status: reportStatusMapping[reportData.status]
    };
    onGenerate(mappedReportData);
    setReportData({
      title: '',
      type: '',
      status: '',
      description: '',
      rule_ids: []
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Generate New Report
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Report Title"
              name="title"
              value={reportData.title}
              onChange={handleChange}
              required
              variant="outlined"
            />
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
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Report Type</InputLabel>
              <Select
                name="type"
                value={reportData.type}
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
            <Autocomplete
              multiple
              id="rules-select"
              options={rules}
              getOptionLabel={(option) => `${option.id}: ${option.name}`}
              value={rules.filter(rule => reportData.rule_ids.includes(rule.id))}
              onChange={handleRuleChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Rules"
                  placeholder="Select rules"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={`${option.id}: ${option.name}`}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={reportData.description}
              onChange={handleChange}
              fullWidth
              multiline
              required
              rows={4}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Generate Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ReportGenerator;