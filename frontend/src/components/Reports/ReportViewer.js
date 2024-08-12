import React from 'react';

const ReportViewer = ({ report }) => {
    if (!report) return <div>Select a report to view its details.</div>;

    return (
        <div id="report-content">
            <h3>{report.name}</h3>
            <p>Status: {report.status}</p>
            <p>Data Source: {report.dataSource}</p>
            <p>Rule ID: {report.ruleId}</p>
            <p>User ID: {report.userId}</p>
            <p>Description: {report.description}</p>
        </div>
    );
};

export default ReportViewer;