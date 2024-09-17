import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
  useTheme,
  Paper
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'open': return 'info';
    case 'pending review': return 'warning';
    case 'approved': return 'success';
    case 'rejected': return 'error';
    case 'archived': return 'default';
    case 'closed': return 'secondary';
    default: return 'default';
  }
};

const ReportList = ({ reports, onSelect }) => {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Available Reports
      </Typography>
      <List>
        {reports.map((report, index) => (
          <ListItem 
            key={index} 
            divider={index !== reports.length - 1}
            sx={{ 
              py: 2,
              '&:hover': { 
                backgroundColor: theme.palette.action.hover,
                transition: 'background-color 0.3s'
              }
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="medium">
                  {report.title}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={report.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label={report.status} 
                      size="small" 
                      color={getStatusColor(report.status)}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {format(new Date(report.updated_at), 'PPP')}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton 
                edge="end" 
                onClick={() => onSelect(report)} 
                color="primary"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText
                  }
                }}
              >
                <VisibilityIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ReportList;