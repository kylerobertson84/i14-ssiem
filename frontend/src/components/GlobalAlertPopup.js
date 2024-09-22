import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const GlobalAlertPopup = () => {
    const [alert, setAlert] = useState(null);

    const fetchLatestAlert = async () => {
        try {
            const response = await fetch('/alerts/get-latest-alert/');
            const data = await response.json();
            if (data.has_alert) {
                setAlert({
                    message: data.alert_message,
                    level: data.alert_level,
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

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                padding: '15px',
                backgroundColor: alert.level === 'error' ? '#d9534f' : '#5bc0de',
                color: 'white',
                borderRadius: '5px',
                zIndex: 1000,
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            {alert.message}
        </Box>
    );
};

export default GlobalAlertPopup;
