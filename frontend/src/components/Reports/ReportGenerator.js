import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Typography,
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Box,
	Autocomplete,
	Chip,
	CircularProgress,
	Snackbar,
	Alert,
	Card,
	CardContent,
	CardActions,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

const typeMapping = {
	security_incident: "Security Incident",
	network_traffic: "Network Traffic Analysis",
	user_activity: "User Activity",
	system_performance: "System Performance",
	compliance_audit: "Compliance Audit",
};

const statusMapping = {
	draft: "Draft",
	pending: "Pending",
	open: "Open",
	approved: "Approved",
	rejected: "Rejected",
	closed: "Closed",
	archived: "Archived",
};

const ReportGenerator = ({ onReportCreated, rules, onClose }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [reportData, setReportData] = useState({
		title: "",
		type: "",
		status: "draft",
		description: "",
		rules: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setReportData((prev) => ({ ...prev, [name]: value }));
	};

	const handleRuleChange = (event, newValue) => {
		setReportData((prev) => ({ ...prev, rules: newValue }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await onReportCreated(reportData);
			setSnackbar({
				open: true,
				message: "Report created successfully",
				severity: "success",
			});
			onClose();
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Failed to create report",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card elevation={3} className="report-generator">
			<CardContent>
				<Typography variant="h5" color="primary" gutterBottom>
					Generate New Report
				</Typography>
				<form onSubmit={handleSubmit} noValidate>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Report Title"
								name="title"
								value={reportData.title}
								onChange={handleChange}
								required
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>Report Type</InputLabel>
								<Select
									name="type"
									value={reportData.type}
									onChange={handleChange}
									label="Report Type"
								>
									{Object.entries(typeMapping).map(([value, label]) => (
										<MenuItem key={value} value={value}>
											{label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth required>
								<InputLabel>Status</InputLabel>
								<Select
									name="status"
									value={reportData.status}
									onChange={handleChange}
									label="Status"
								>
									{Object.entries(statusMapping).map(([value, label]) => (
										<MenuItem key={value} value={value}>
											{label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								multiple
								options={rules}
								getOptionLabel={(option) => `${option.id}: ${option.name}`}
								value={reportData.rules}
								onChange={handleRuleChange}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Rules"
										placeholder="Select rules"
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											variant="outlined"
											label={`${option.id}: ${option.name}`}
											{...getTagProps({ index })}
										/>
									))
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={4}
								label="Description"
								name="description"
								value={reportData.description}
								onChange={handleChange}
								required
							/>
						</Grid>
					</Grid>
				</form>
			</CardContent>
			<CardActions>
				<Button
					startIcon={<SaveIcon />}
					onClick={handleSubmit}
					variant="contained"
					color="primary"
					disabled={isSubmitting}
				>
					{isSubmitting ? <CircularProgress size={24} /> : "Generate Report"}
				</Button>
				<Button
					startIcon={<CancelIcon />}
					onClick={onClose}
					variant="outlined"
					color="secondary"
				>
					Cancel
				</Button>
			</CardActions>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Card>
	);
};

ReportGenerator.propTypes = {
	onReportCreated: PropTypes.func.isRequired,
	rules: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ReportGenerator;
