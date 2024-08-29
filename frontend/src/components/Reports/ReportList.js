import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'draft': return 'default';
    case 'pending review': return 'warning';
    case 'approved': return 'success';
    case 'rejected': return 'error';
    case 'archived': return 'secondary';
    default: return 'default';
  }
};

const ReportList = ({ reports, onSelect }) => {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
          Available Reports
      </Typography>
      <List>
        {reports.map((report, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={report.reportName}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip label={report.reportType} size="small" />
                  <Chip 
                    label={report.status} 
                    size="small" 
                    color={getStatusColor(report.status)}
                  />
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => onSelect(report)}>
                <VisibilityIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ReportList;