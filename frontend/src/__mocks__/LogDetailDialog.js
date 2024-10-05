// __mocks__/LogDetailDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Box } from '@mui/material';

const MockLogDetailDialog = ({ log, open, onClose }) => {
    if (!open) return null; // If the dialog is not open, return nothing

    return (
        <Box data-testid="log-detail-dialog" sx={{ padding: '20px', backgroundColor: 'white' }}>
            <Typography variant="h6">Log Details</Typography>
            <Typography variant="subtitle2">Log ID: {log?.id || "N/A"}</Typography>
            <Typography variant="subtitle2">Timestamp: {log?.iso_timestamp || log?.date_time || "N/A"}</Typography>
            <Typography variant="subtitle2">Hostname: {log?.hostname || "N/A"}</Typography>
            <Typography variant="subtitle2">Message: {log?.message || "N/A"}</Typography>
            <Button onClick={onClose} color="primary" data-testid="close-button">Close</Button>
        </Box>
    );
};

MockLogDetailDialog.propTypes = {
    log: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        iso_timestamp: PropTypes.string,
        date_time: PropTypes.string,
        hostname: PropTypes.string,
        message: PropTypes.string,
    }),
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default MockLogDetailDialog;
