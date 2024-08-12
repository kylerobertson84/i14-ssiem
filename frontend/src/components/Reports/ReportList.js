import React from 'react';

const ReportList = ({ reports, onSelect }) => {
    return (
        <div>
            <h3>Available Reports</h3>
            <ul>
                {reports.map((report, index) => (
                    <li key={index} onClick={() => onSelect(report)}>
                        {report.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReportList;
