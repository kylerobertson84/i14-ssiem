import React, { useState, useEffect } from 'react';
import Alert from '../components/Alerts';
import '../pages/Design.css';
import alertsData from '../data/alerts.json';  // Importing pre-saved alerts data

const AlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const alertsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load alerts from a pre-saved file
        setAlerts(alertsData);
    }, []);

    // Handle Search
    const filteredAlerts = alerts.filter(
        (alert) =>
            alert.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.severity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastAlert = currentPage * alertsPerPage;
    const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
    const currentAlerts = filteredAlerts.slice(indexOfFirstAlert, indexOfLastAlert);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Alerts</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="alerts-grid">
                {currentAlerts.map(alert => (
                    <Alert key={alert.id} alert={alert} />
                ))}
            </div>
            <div className="pagination">
                {[...Array(Math.ceil(filteredAlerts.length / alertsPerPage)).keys()].map(i => (
                    <button key={i + 1} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AlertsPage;