
import React from 'react';
import '../../Design/Report.css';

const ReportList = ({ reports, onSelect }) => {
    return (
        <div className="report-tiles-container">
            <h3>Available Reports</h3>
            <div className="report-tiles">
                {reports.map((report, index) => (
                    <div key={index} className="report-tile" onClick={() => onSelect(report)}>
                        <h4>{report.reportName}</h4>
                        <button className="view-button">View Report</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportList;