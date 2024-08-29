import React from 'react';
import { Button } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

const ReportExporter = ({ report }) => {
  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       10,
      filename:     `${report.reportName.replace(/\s+/g, '_')}_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<GetAppIcon />}
      onClick={handleExportPDF}
      disabled={!report}
      fullWidth
    >
      Export as PDF
    </Button>
  );
};

export default ReportExporter;