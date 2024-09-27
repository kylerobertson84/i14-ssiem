import React, { useEffect, useState, useCallback } from "react";
import {
	Container,
	Typography,
	Grid,
	Paper,
	Box,
	Button,
	Tooltip,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Refresh as RefreshIcon, Add as AddIcon } from "@mui/icons-material";
import ReportGenerator from "../components/Reports/ReportGenerator.js";
import ReportList from "../components/Reports/ReportList";
import ReportViewer from "../components/Reports/ReportViewer";
import ReportExporter from "../components/Reports/ReportExporter";
import SEO from "../Design/SEO.js";
import {
	fetchReports,
	createReport,
	updateReport,
	generateReportPDF,
	fetchRules,
	deleteReport,
} from "../services/apiService";

const ReportsPage = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [reports, setReports] = useState([]);
	const [selectedReport, setSelectedReport] = useState(null);
	const [rules, setRules] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showGenerator, setShowGenerator] = useState(false);

	const loadReports = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetchReports();
			setReports(response.results || response);
		} catch (err) {
			console.error("Failed to load reports:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadRules = useCallback(async () => {
		try {
			const response = await fetchRules();
			setRules(response.results || response);
		} catch (err) {
			console.error("Failed to load rules:", err);
		}
	}, []);

	useEffect(() => {
		loadReports();
		loadRules();
	}, [loadReports, loadRules]);

	const handleReportCreated = async (newReport) => {
		await loadReports();
		setShowGenerator(false);
	};

	const handleReportUpdated = async (updatedReport) => {
		await loadReports();
		setSelectedReport(updatedReport);
	};

	const handleSelectReport = (report) => {
		setSelectedReport(report);
	};

	const handleUpdateReport = async (updatedReport) => {
		try {
			const result = await updateReport(updatedReport.id, updatedReport);
			await handleReportUpdated(result);
			return result;
		} catch (err) {
			console.error("Failed to update report:", err);
			throw err;
		}
	};

	const handleDeleteReport = async (reportToDelete) => {
		try {
			await deleteReport(reportToDelete.id);
			await loadReports();
			if (selectedReport && selectedReport.id === reportToDelete.id) {
				setSelectedReport(null);
			}
		} catch (err) {
			console.error("Failed to delete report:", err);
		}
	};

	const handleRefresh = () => {
		loadReports();
		loadRules();
	};

	return (
		<>
			<SEO title="Reports Management" />
			<Container maxWidth="lg" className="main-content">
				<Box sx={{ mb: 4 }}>
					<Typography variant="h4" component="h1" gutterBottom>
						Reports Management
					</Typography>
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Button
							startIcon={<AddIcon />}
							onClick={() => setShowGenerator(true)}
							variant="contained"
							color="primary"
						>
							New Report
						</Button>
						<Button
							startIcon={<RefreshIcon />}
							onClick={handleRefresh}
							variant="outlined"
						>
							Refresh
						</Button>
					</Box>
				</Box>
				<Grid container spacing={4}>
					{showGenerator && (
						<Grid item xs={12}>
							<Paper elevation={3} sx={{ p: 3, mb: 4 }}>
								<ReportGenerator
									onReportCreated={handleReportCreated}
									rules={rules}
									onClose={() => setShowGenerator(false)}
								/>
							</Paper>
						</Grid>
					)}
					<Grid item xs={12} md={selectedReport && !isMobile ? 6 : 12}>
						<ReportList
							reports={reports}
							onSelect={handleSelectReport}
							onDelete={handleDeleteReport}
							onRefresh={handleRefresh}
							loading={loading}
						/>
					</Grid>
					{selectedReport && (
						<Grid item xs={12} md={isMobile ? 12 : 6}>
							<Paper elevation={3} sx={{ p: 3 }}>
								<ReportViewer
									report={selectedReport}
									onUpdate={handleUpdateReport}
									onReportUpdated={handleReportUpdated}
									rules={rules}
								/>
								<Box sx={{ mt: 2 }}>
									<ReportExporter
										report={selectedReport}
										onExport={() => generateReportPDF(selectedReport.id)}
									/>
								</Box>
							</Paper>
						</Grid>
					)}
				</Grid>
			</Container>
		</>
	);
};

export default ReportsPage;
