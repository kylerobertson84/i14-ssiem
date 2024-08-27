
import React from 'react';
import html2pdf from 'html2pdf.js';

const ReportExporter = ({ report }) => {
    const handleExportPDF = () => {
        const element = document.getElementById('report-content');
        html2pdf().from(element).save(`${report.name}_Report.pdf`);
    };

    return (
        <button onClick={handleExportPDF}>
            Export as PDF
        </button>
    );
};

export default ReportExporter;