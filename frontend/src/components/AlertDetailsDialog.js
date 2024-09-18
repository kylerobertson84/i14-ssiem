

// src/components/AlertDetailsDialog.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Box,
} from '@mui/material';

import apiRequest from '../services/apiRequest';
import API_ENDPOINTS from '../services/apiConfig';
import { assignAlert } from '../services/apiService';

const AlertDetailsDialog = ({ alert, open, onClose, onAssign }) => {
  const [assignee, setAssignee] = useState('');
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState([]); 
  const [loadingUsers, setLoadingUsers] = useState(true); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (open) {
      apiRequest(API_ENDPOINTS.auth.users) // Fetch users endpoint
        .then((response) => {
          setUsers(response);
          setLoadingUsers(false);
        })
        .catch(() => {
          setError('Failed to fetch users');
          setLoadingUsers(false);
        });
    }
  }, [open]);

  useEffect(() => {
    if (alert) {
      setAssignee(alert.assigned_to || '');
      setComment(alert.comments || '');
    }
  }, [alert]);

  if (!alert) return null;

  const handleAssign = () => {
    const selectedUser = users.find(users => users.email === assignee);
  
    const payload = {
      assigned_to: selectedUser ? selectedUser.user_id : '',
      notes: comment
    };
    
    console.log('Assign URL:', API_ENDPOINTS.alerts.assign(alert.id)); // Debug URL
    console.log('Payload:', payload); // Debug payload

    assignAlert(alert.id, payload)
      .then((response) => {
        console.log('Alert assigned successfully:', response);
        onAssign(alert.id, selectedUser ? selectedUser.user_id : '', comment);
        onClose();
      })
      .catch((error) => {
        console.error('Failed to assign alert:', error);
      });
  };

  const renderAlertDetail = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">
        {value !== null && value !== undefined && value !== "" ? value.toString() : 'N/A'}
      </Typography>
    </Box>
  );

  const renderSelectOptions = () => {
    if (loadingUsers) {
      return <MenuItem value="">Loading...</MenuItem>;
    }
    if (error) {
      return <MenuItem value="">Error fetching users</MenuItem>;
    }
    return [
      <MenuItem key="unassigned" value="">Unassigned</MenuItem>,
      ...users.map(users => (
        <MenuItem key={users.user_id} value={users.email}>
          {users.email}
        </MenuItem>
      ))
    ];
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Alert Details</DialogTitle>
      <DialogContent>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {renderAlertDetail("Alert ID", alert.id)}
              {renderAlertDetail("Created At", new Date(alert.created_at).toLocaleString())}
              {renderAlertDetail("Severity", alert.severity)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderAlertDetail("Hostname", alert.event?.hostname)}
              {renderAlertDetail("Event ID", alert.event?.EventID)}
              {renderAlertDetail("User ID", alert.event?.UserID)}
            </Grid>
            <Grid item xs={12}>
              {renderAlertDetail("Rule", alert.rule?.name || alert.rule)}
            </Grid>
          </Grid>
        </Paper>

        <Typography variant="h6" gutterBottom>Assignment</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Assign To</InputLabel>
          <Select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            label="Assign To"
            disabled={loadingUsers}
          >
            {renderSelectOptions()}
          </Select>
        </FormControl>

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleAssign} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDetailsDialog;
