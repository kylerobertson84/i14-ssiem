// __mocks__/AlertDetailsDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const MockAlertDetailsDialog = ({ alert, open, onClose, onAssign, users }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Mock Alert Details</DialogTitle>
            <DialogContent>
                <p>Severity: {alert.severity}</p>
                <p>Event ID: {alert.event.EventID}</p>
                <p>Hostname: {alert.event.hostname}</p>
                <p>{alert.rule.name}</p> {/* This should be set to "Unauthorized Access" in the test */}
                {/* Render the user list or any additional details */}
                {users && users.map((user) => (
                    <div key={user.id}>{user.email}</div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={onAssign}>Assign</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MockAlertDetailsDialog;
