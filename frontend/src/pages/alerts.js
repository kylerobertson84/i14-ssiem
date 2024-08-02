import React from 'react';
import Alert from '../components/Alerts';
import '../pages/Design.css';

const AlertsPage = () => {
    const alerts = [
        //This is currently using fixed data but next iteration will gather the data from the backend and then use that. This is currently only being used to help with the designing
        {
            id: 126,
            hostname: 'WDT-01',
            event_id: 4740,
            severity: 'info',
            event_time: '2024-03-12 16:05:16',
            message: 'A user account was locked out',
            ip_address: '192.168.0.196',
            user_id: 'S-1-5-18',
            rule_triggered: 'Account lockout',
            comments: ''
        },
        // Add more alert objects here as needed
    ];

    return (
        <div>
            <h1>Alerts</h1>
            <div className="alerts-container">
                {alerts.map(alert => (
                    <Alert key={alert.id} alert={alert} />
                ))}
            </div>
        </div>
    );
};

export default AlertsPage;
