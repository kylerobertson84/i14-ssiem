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

const AlertDetailsDialog = ({ alert, open, onClose, onAssign }) => {
  const [assignee, setAssignee] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (alert) {
      setAssignee(alert.assigned_to || '');
      setComment(alert.comments || '');
    }
  }, [alert]);

  if (!alert) return null;

  const handleAssign = () => {
    onAssign(alert.id, assignee, comment);
    onClose();
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
          >
            <MenuItem value="">Unassigned</MenuItem>
            <MenuItem value="John Doe">John Doe</MenuItem>
            <MenuItem value="Jane Smith">Jane Smith</MenuItem>
            <MenuItem value="Alice Johnson">Alice Johnson</MenuItem>
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