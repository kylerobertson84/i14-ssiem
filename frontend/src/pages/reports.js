
import React, { useState } from 'react';
import ReportGenerator from '../components/Reports/ReportGenerator';
import ReportViewer from '../components/Reports/ReportViewer';
import ReportExporter from '../components/Reports/ReportExporter';
import ReportList from '../components/Reports/ReportList';
import '../Design/Report.css';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleGenerate = (newReport) => {
    setReports([...reports, newReport]);
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
  };

  return (
    <main className="reporting-container">
      <h2>Generate and Export Report</h2>
      <ReportGenerator onGenerate={handleGenerate} />
      <div className="report-tiles-container">
        <ReportList reports={reports} onSelect={handleSelectReport} />
      </div>
      {selectedReport && (
        <div className="report-details">
          <ReportViewer report={selectedReport} />
          <ReportExporter report={selectedReport} />
        </div>
      )}
    </main>
  );
};

export default ReportsPage;