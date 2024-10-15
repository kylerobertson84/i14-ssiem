import React from 'react';
import DOMPurify from 'dompurify';  // Import DOMPurify
import '../pages/Design.css';

const Alert = ({ alert }) => (
    <div className="alert-card" data-testid="alert">
        <h3>Alert #{DOMPurify.sanitize(alert.id)}</h3>
        <p><strong>Hostname:</strong> {DOMPurify.sanitize(alert.hostname)}</p>
        <p><strong>Event ID:</strong> {DOMPurify.sanitize(alert.event_id)}</p>
        <p><strong>Severity:</strong> {DOMPurify.sanitize(alert.severity)}</p>
        <p><strong>Event Time:</strong> {DOMPurify.sanitize(alert.event_time)}</p>
        <p><strong>Message:</strong> {DOMPurify.sanitize(alert.message)}</p>
        <p><strong>IP Address:</strong> {DOMPurify.sanitize(alert.ip_address)}</p>
        <p><strong>User ID:</strong> {DOMPurify.sanitize(alert.user_id)}</p>
        <p><strong>Rule Triggered:</strong> {DOMPurify.sanitize(alert.rule_triggered)}</p>
        <p><strong>Comments:</strong> {DOMPurify.sanitize(alert.comments)}</p>
        <button>Open Investigation</button>
    </div>
);

export default Alert;
