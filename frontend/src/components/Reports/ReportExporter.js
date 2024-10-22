import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";
import { GetApp as GetAppIcon } from "@mui/icons-material";

const ReportExporter = ({ report, onExport, isExporting }) => {
	const handleExportPDF = () => {
		if (report && report.id) {
			onExport(report.id);
		}
	};

	return (
		<Button
			variant="contained"
			color="secondary"
			startIcon={
				isExporting ? (
					<CircularProgress size={20} color="inherit" />
				) : (
					<GetAppIcon />
				)
			}
			onClick={handleExportPDF}
			disabled={!report || isExporting}
			fullWidth
		>
			{isExporting ? "Exporting..." : "Export as PDF"}
		</Button>
	);
};

ReportExporter.propTypes = {
	report: PropTypes.object,
	onExport: PropTypes.func.isRequired,
	isExporting: PropTypes.bool,
};

export default ReportExporter;
