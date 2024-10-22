import React, { useState } from 'react';
import '../pages/Design.css';
import AlertDetailsDialog from './AlertDetailsDialog';


const Alert = ({ alert }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleAlertClick = () => {
        setOpenDialog(true); // Open the dialog when alert is clicked
    };

    const handleAssign = (alertId) => {
        onAlertAssigned(alertId);  // Call the parent function to remove the alert
        setOpenDialog(false);  // Close the dialog after assignment
    };


    return (
        <div className="alert-card" data-testid="alert" onClick={handleAlertClick}>
            <h3>Alert #{alert.id}</h3>
            <p><strong>Hostname:</strong> {alert.hostname}</p>
            <p><strong>Event ID:</strong> {alert.event_id}</p>
            <p><strong>Severity:</strong> {alert.severity}</p>
            <p><strong>Event Time:</strong> {alert.event_time}</p>
            <p><strong>Message:</strong> {alert.message}</p>
            <p><strong>IP Address:</strong> {alert.ip_address}</p>
            <p><strong>User ID:</strong> {alert.user_id}</p>
            <p><strong>Rule Triggered:</strong> {alert.rule_triggered}</p>
            <p><strong>Comments:</strong> {alert.comments}</p>
            <button>Open Investigation</button>
            <AlertDetailsDialog
                alert={alert}
                open={openDialog}
                onClose={() => setOpenDialog(false)} // Close the dialog
            />

        </div>
    );
}
export default Alert;
