import React, { useState } from 'react';
import ReportList from '../components/Reports/ReportList';
import ReportGenerator from '../components/Reports/ReportGenerator';
import ReportViewer from '../components/Reports/ReportViewer';
import ReportExporter from '../components/Reports/ReportExporter';

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
    <div className="reporting-container">
      <h2>Generate and Export Report</h2>
      <ReportGenerator onGenerate={handleGenerate} />
      {selectedReport && (
        <>
          <ReportViewer report={selectedReport} />
          <ReportExporter report={selectedReport} />
        </>
      )}
      <ReportList reports={reports} onSelect={handleSelectReport} />
    </div>
  );
};

export default ReportsPage;