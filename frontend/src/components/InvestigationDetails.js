import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const severityColors = {
  INFO: "#2196f3",
  LOW: "#4caf50",
  MEDIUM: "#ff9800",
  HIGH: "#f44336",
  CRITICAL: "#9c27b0",
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogTitle-root": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2),
    justifyContent: "flex-end",
  },
}));

const InvestigationDetails = ({ open, onClose, alert }) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Alert Details</DialogTitle>
      <DialogContent>
        {alert ? (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Rule:</strong> {alert.rule}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Hostname:</strong> {alert.event.hostname}
            </Typography>
            <Typography>
                <strong>Severity:</strong>
            </Typography>
            <Chip
              label={alert.severity}
              sx={{
                bgcolor: severityColors[alert.severity],
                color: "white",
                fontWeight: "bold",
                mt: 1,
                mb: 2,
              }}
            />
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Created At:</strong>{" "}
              {new Date(alert.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Notes:</strong> {alert.notes || "No notes"}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">No alert details available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default InvestigationDetails;

