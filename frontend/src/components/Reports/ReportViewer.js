import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Typography,
	TextField,
	Button,
	Chip,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Box,
	Autocomplete,
	Divider,
	CircularProgress,
	Snackbar,
	Alert,
	Card,
	CardContent,
	CardActions,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import {
	Save as SaveIcon,
	Edit as EditIcon,
	Cancel as CancelIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";

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

const ReportViewer = ({ report, onUpdate, rules }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [editedReport, setEditedReport] = useState(report);
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedReport((prev) => ({ ...prev, [name]: value }));
	};

	const handleRuleChange = (event, newValue) => {
		setEditedReport((prev) => ({ ...prev, rules: newValue }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await onUpdate(editedReport);
			setSnackbar({
				open: true,
				message: "Report updated successfully",
				severity: "success",
			});
			setIsEditing(false);
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Failed to update report",
				severity: "error",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDateTime = (dateTimeString) => {
		return format(parseISO(dateTimeString), "PPP 'at' HH:mm");
	};

	return (
		<Card elevation={3} className="report-viewer">
			<CardContent>
				<Typography variant="h5" color="primary" gutterBottom>
					Report Details
				</Typography>
				<form onSubmit={handleSubmit} noValidate>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="subtitle1" color="text.secondary">
								ID: {report.id}
							</Typography>
							<Typography variant="h6">{report.title}</Typography>
							<Typography variant="body2" color="text.secondary">
								Author: {report.user.email}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Created: {formatDateTime(report.created_at)}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Last Updated: {formatDateTime(report.updated_at)}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth variant="outlined" disabled={!isEditing}>
								<InputLabel>Type</InputLabel>
								<Select
									name="type"
									value={editedReport.type}
									onChange={handleChange}
									label="Type"
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
							<FormControl fullWidth variant="outlined" disabled={!isEditing}>
								<InputLabel>Status</InputLabel>
								<Select
									name="status"
									value={editedReport.status}
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
								value={editedReport.rules}
								onChange={handleRuleChange}
								disabled={!isEditing}
								renderInput={(params) => (
									<TextField
										{...params}
										variant="outlined"
										label="Associated Rules"
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
								name="description"
								label="Description"
								value={editedReport.description}
								onChange={handleChange}
								fullWidth
								multiline
								rows={4}
								variant="outlined"
								disabled={!isEditing}
							/>
						</Grid>
					</Grid>
				</form>
			</CardContent>
			<CardActions>
				{!isEditing ? (
					<Button
						startIcon={<EditIcon />}
						onClick={() => setIsEditing(true)}
						variant="contained"
						color="primary"
					>
						Edit
					</Button>
				) : (
					<>
						<Button
							startIcon={<SaveIcon />}
							onClick={handleSubmit}
							variant="contained"
							color="primary"
							disabled={isSubmitting}
						>
							{isSubmitting ? <CircularProgress size={24} /> : "Save"}
						</Button>
						<Button
							startIcon={<CancelIcon />}
							onClick={() => setIsEditing(false)}
							variant="outlined"
							color="secondary"
						>
							Cancel
						</Button>
					</>
				)}
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

ReportViewer.propTypes = {
	report: PropTypes.object.isRequired,
	onUpdate: PropTypes.func.isRequired,
	rules: PropTypes.array.isRequired,
};

export default ReportViewer;
