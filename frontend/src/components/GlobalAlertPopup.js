import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const GlobalAlertPopup = () => {
    const [alert, setAlert] = useState(null);
    /* This was a test with simulated data and it works
    // Mock the backend response to simulate an alert popup
    const fetchLatestAlert = async () => {
        // Simulate a delay
        setTimeout(() => {
            // Simulate a hardcoded response
            setAlert({
                hostname: "Test Server",  // Simulated hostname
                message: "This is a test alert",  // Simulated message
                severity: "warning"  // Simulated severity level
            });

            // Automatically remove the alert after 5 seconds
            setTimeout(() => setAlert(null), 5000);
        }, 15000);  // Mock delay of 15 seconds
    };
    */

    //Using Backend Data, needs to be tested
    const fetchLatestAlert = async () => {
        try {
            const response = await fetch('/alerts/get-latest-alert/');
            const data = await response.json();
            if (data.has_alert) {
                setAlert({
                    hostname: data.hostname,
                    message: data.alert_message,
                    severity: data.alert_level,
                });

                // Automatically remove the alert after 5 seconds
                setTimeout(() => setAlert(null), 5000);
            }
        } catch (error) {
            console.error('Error fetching latest alert:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchLatestAlert, 10000); // Poll every 10 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    if (!alert) return null;

    // Determine background color based on severity level
    const backgroundColor = alert.severity === 'Critical'
        ? '#d9534f'  // Red for critical
        : alert.severity === 'High'
            ? '#f0ad4e'  // Orange for High
            : '#5bc0de';  // Blue for other levels

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                padding: '15px',
                backgroundColor: backgroundColor,
                color: 'white',
                borderRadius: '5px',
                zIndex: 1000,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            {/* Display the hostname, message, and severity */}
            <strong>Hostname:</strong> {alert.hostname} <br />
            <strong>Message:</strong> {alert.message} <br />
            <strong>Severity:</strong> {alert.severity}
        </Box>
    );
};

export default GlobalAlertPopup;
