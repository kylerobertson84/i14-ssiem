import React from 'react';
import { Button } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';
import { generateReportPDF } from '../../services/apiService';

const ReportExporter = ({ report }) => {
  const handleExportPDF = () => {
    if (report && report.id) {
      generateReportPDF(report.id);
    }
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