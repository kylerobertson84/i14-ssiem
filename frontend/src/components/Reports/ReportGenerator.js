import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Chip,
	Grid,
	Typography,
	Box,
	Paper,
	useTheme,
	Autocomplete,
	Stepper,
	Step,
	StepLabel,
	Card,
	CardContent,
	Tooltip,
	IconButton,
	CircularProgress,
	Fade,
	Snackbar,
	Alert,
} from "@mui/material";
import {
	Add as AddIcon,
	Help as HelpIcon,
	ArrowBack as ArrowBackIcon,
	ArrowForward as ArrowForwardIcon,
	Refresh as RefreshIcon,
} from "@mui/icons-material";
import { fetchRules } from "../../services/apiService";

const reportTypes = [
	"Security Incident",
	"Network Traffic Analysis",
	"User Activity",
	"System Performance",
	"Compliance Audit",
];

const reportStatuses = ["Draft", "Open"];

const reportTypeMapping = {
	"Security Incident": "security_incident",
	"Network Traffic Analysis": "network_traffic",
	"User Activity": "user_activity",
	"System Performance": "system_performance",
	"Compliance Audit": "compliance_audit",
};

const reportStatusMapping = {
	Draft: "draft",
	Open: "open",
};

const ReportGenerator = ({ onGenerate }) => {
	const [reportData, setReportData] = useState({
		title: "",
		type: "",
		status: "",
		description: "",
		rule_ids: [],
	});
	const [rules, setRules] = useState([]);
	const [activeStep, setActiveStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const theme = useTheme();

	useEffect(() => {
		loadRules();
	}, []);

	const loadRules = async () => {
		try {
			const response = await fetchRules();
			setRules(response.results || response);
		} catch (err) {
			console.error("Failed to load rules", err);
			showSnackbar("Failed to load rules", "error");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setReportData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleRuleChange = (event, newValue) => {
		setReportData((prevData) => ({
			...prevData,
			rule_ids: newValue.map((rule) => rule.id),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		const mappedReportData = {
			...reportData,
			type: reportTypeMapping[reportData.type],
			status: reportStatusMapping[reportData.status],
		};
		try {
			await onGenerate(mappedReportData);
			showSnackbar("Report generated successfully", "success");
			setIsRefreshing(true);
			setTimeout(() => {
				setReportData({
					title: "",
					type: "",
					status: "",
					description: "",
					rule_ids: [],
				});
				setActiveStep(0);
				setIsRefreshing(false);
				setIsSubmitting(false);
			}, 1500);
		} catch (error) {
			console.error("Error generating report:", error);
			showSnackbar("Failed to generate report", "error");
			setIsSubmitting(false);
		}
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const steps = ["Basic Information", "Rules Selection", "Description"];

	const isStepComplete = (step) => {
		switch (step) {
			case 0:
				return reportData.title && reportData.type && reportData.status;
			case 1:
				return reportData.rule_ids.length > 0;
			case 2:
				return reportData.description;
			default:
				return false;
		}
	};

	const handleRefresh = () => {
		setIsRefreshing(true);
		setTimeout(() => {
			setReportData({
				title: "",
				type: "",
				status: "",
				description: "",
				rule_ids: [],
			});
			setActiveStep(0);
			setIsRefreshing(false);
		}, 1000);
	};

	const showSnackbar = (message, severity) => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbar({ ...snackbar, open: false });
	};

	const renderStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Report Title"
								name="title"
								value={reportData.title}
								onChange={handleChange}
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined" required>
								<InputLabel>Report Type</InputLabel>
								<Select
									name="type"
									value={reportData.type}
									onChange={handleChange}
									label="Report Type"
								>
									{reportTypes.map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined" required>
								<InputLabel>Status</InputLabel>
								<Select
									name="status"
									value={reportData.status}
									onChange={handleChange}
									label="Status"
								>
									{reportStatuses.map((status) => (
										<MenuItem key={status} value={status}>
											{status}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
				);
			case 1:
				return (
					<Autocomplete
						multiple
						id="rules-select"
						options={rules}
						getOptionLabel={(option) => `${option.id}: ${option.name}`}
						value={rules.filter((rule) =>
							reportData.rule_ids.includes(rule.id)
						)}
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
				);
			case 2:
				return (
					<TextField
						name="description"
						label="Description"
						value={reportData.description}
						onChange={handleChange}
						fullWidth
						multiline
						required
						rows={6}
						variant="outlined"
					/>
				);
			default:
				return "Unknown step";
		}
	};

	return (
		<>
			<Typography
				variant="h5"
				component="h2"
				gutterBottom
				sx={{
					mb: 4,
					fontWeight: "bold",
					color: "primary.main",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				Generate New Report
				<Box>
					<Tooltip title="Refresh form">
						<IconButton
							onClick={handleRefresh}
							disabled={isRefreshing || isSubmitting}
						>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Fill in the details step by step to generate a new report">
						<IconButton>
							<HelpIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</Typography>
			<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<form onSubmit={handleSubmit}>
				<Card variant="outlined" sx={{ mb: 3 }}>
					<CardContent>{renderStepContent(activeStep)}</CardContent>
				</Card>
				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
					<Button
						color="inherit"
						disabled={activeStep === 0 || isSubmitting || isRefreshing}
						onClick={handleBack}
						startIcon={<ArrowBackIcon />}
					>
						Back
					</Button>
					<Box>
						{activeStep === steps.length - 1 ? (
							<Button
								type="submit"
								variant="contained"
								color="primary"
								startIcon={
									isSubmitting ? (
										<CircularProgress size={24} color="inherit" />
									) : (
										<AddIcon />
									)
								}
								disabled={
									!isStepComplete(activeStep) || isSubmitting || isRefreshing
								}
								sx={{
									px: 4,
									py: 1,
									borderRadius: 2,
									boxShadow: theme.shadows[2],
									"&:hover": {
										boxShadow: theme.shadows[4],
									},
								}}
							>
								{isSubmitting ? "Generating..." : "Generate Report"}
							</Button>
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
								endIcon={<ArrowForwardIcon />}
								disabled={
									!isStepComplete(activeStep) || isSubmitting || isRefreshing
								}
							>
								Next
							</Button>
						)}
					</Box>
				</Box>
			</form>
			<Fade in={isRefreshing}>
				<CircularProgress
					size={60}
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						marginTop: "-30px",
						marginLeft: "-30px",
					}}
				/>
			</Fade>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default ReportGenerator;
