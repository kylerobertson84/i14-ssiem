import React, { useState, useEffect } from "react";
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
	Paper,
	Box,
	Autocomplete,
	useTheme,
	Divider,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { format } from "date-fns";

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
	closed: "Approved",
	archived: "Archived",
};

const ReportViewer = ({ report, onUpdate, rules }) => {
	const [editedReport, setEditedReport] = useState({
		...report,
		type: typeMapping[report.type] || "",
		status: statusMapping[report.status] || "",
		rules: report.rules || [],
	});

	const theme = useTheme();

	useEffect(() => {
		setEditedReport({
			...report,
			type: typeMapping[report.type] || "",
			status: statusMapping[report.status] || "",
			rules: report.rules || [],
		});
	}, [report]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedReport((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleRuleChange = (event, newValue) => {
		setEditedReport((prev) => ({
			...prev,
			rules: newValue,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const updatedReport = {
			...editedReport,
			type:
				Object.keys(typeMapping).find(
					(key) => typeMapping[key] === editedReport.type
				) || editedReport.type,
			status:
				Object.keys(statusMapping).find(
					(key) => statusMapping[key] === editedReport.status
				) || editedReport.status,
			rule_ids: editedReport.rules.map((rule) => rule.id),
		};
		onUpdate(updatedReport);
	};

	return (
		<Box component="form" onSubmit={handleSubmit} noValidate>
			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant="h6" color="primary" gutterBottom>
						Report Details
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1" color="text.primary">
						ID: {report.id}
					</Typography>
					<Typography variant="h5" color="text.primary" gutterBottom>
						{report.title}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="body2" color="text.secondary">
						Last Updated: {format(new Date(report.updated_at), "PPP")}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth variant="outlined">
						<InputLabel>Type</InputLabel>
						<Select
							name="type"
							value={editedReport.type || ""}
							onChange={handleChange}
							label="Type"
						>
							{Object.values(typeMapping).map((type) => (
								<MenuItem key={type} value={type}>
									{type}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl fullWidth variant="outlined">
						<InputLabel>Status</InputLabel>
						<Select
							name="status"
							value={editedReport.status || ""}
							onChange={handleChange}
							label="Status"
						>
							{Object.values(statusMapping).map((status) => (
								<MenuItem key={status} value={status}>
									{status}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12}>
					<Autocomplete
						multiple
						id="rules-select"
						options={rules}
						getOptionLabel={(option) => `${option.id}: ${option.name}`}
						value={editedReport.rules}
						onChange={handleRuleChange}
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
						value={editedReport.description || ""}
						onChange={handleChange}
						fullWidth
						multiline
						rows={4}
						variant="outlined"
					/>
				</Grid>
				<Grid item xs={12}>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							startIcon={<SaveIcon />}
							sx={{
								mt: 2,
								px: 4,
								py: 1,
								borderRadius: 2,
								boxShadow: theme.shadows[2],
								"&:hover": {
									boxShadow: theme.shadows[4],
								},
							}}
						>
							Update Report
						</Button>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ReportViewer;
