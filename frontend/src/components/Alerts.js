import React from 'react';
import '../pages/Design.css';

///This is for future use when i want to connect to open investigation
///const handleInvestigationClick = () => {
/// alert(`Investigating alert ID: ${alert.id}`);
///}

const Alert = ({ alert }) => (
    <div className="alert-card">
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
    </div>
);

export default Alert;
