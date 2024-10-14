import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Paper,
	Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import apiRequest from "../services/apiRequest";
import API_ENDPOINTS from "../services/apiConfig";
import { assignAlert } from "../services/apiService";
import { useAuth } from "../services/AuthContext";

const StyledDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogTitle-root": {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
	},
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1, 2),
	},
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
}));

const AlertDetailsDialog = ({ alert, open, onClose, onAssign }) => {
	const [assignee, setAssignee] = useState("");
	const [comment, setComment] = useState("");
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(true);
	const [error, setError] = useState("");
	//Fetching user and roles from AuthContext
	const { user, isAdmin, isAnalyst } = useAuth();
	useEffect(() => {
		if (open) {
			apiRequest(API_ENDPOINTS.auth.users)
				.then((response) => {
					setUsers(response);
					setLoadingUsers(false);
				})
				.catch(() => {
					setError("Failed to fetch users");
					setLoadingUsers(false);
				});
		}
	}, [open]);

	useEffect(() => {
		if (alert) {
			setAssignee(alert.assigned_to || "");
			setComment(alert.comments || "");
		}
	}, [alert]);

	if (!alert) return null;

	const handleAssign = () => {
		const selectedUser = users.find((user) => user.email === assignee);
		const payload = {
			assigned_to: selectedUser ? selectedUser.user_id : "",
			notes: comment,
		};

		assignAlert(alert.id, payload)
			.then((response) => {
				console.log("Alert assigned successfully:", response);
				onAssign(alert.id, selectedUser ? selectedUser.user_id : "", comment);
				if (onClose) {
					onclose(alert.id);
				}
			})
			.catch((error) => {
				console.error("Failed to assign alert:", error);
			});
	};

	const renderAlertDetail = (label, value) => (
		<Box sx={{ mb: 2 }}>
			<Typography variant="subtitle2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body1">
				{value !== null && value !== undefined && value !== ""
					? value.toString()
					: "N/A"}
			</Typography>
		</Box>
	);

	const renderSelectOptions = () => {
		if (loadingUsers) {
			return <MenuItem value="">Loading...</MenuItem>;
		}
		if (error) {
			return <MenuItem value="">Error fetching users</MenuItem>;
		}
		if (isAdmin()) {
			// Admin can see all users
			return [
				<MenuItem key="unassigned" value="">
					Unassigned
				</MenuItem>,
				...users.map((userItem) => (
					<MenuItem key={userItem.user_id} value={userItem.email}>
						{userItem.email}
					</MenuItem>
				)),
			];
		} else if (isAnalyst()) {
			// Analysts can only see their own email
			return (
				<MenuItem key={user.user_id} value={user.email}>
					{user.email}
				</MenuItem>
			);
		}
		return null;
	};
	/*
			return [
				<MenuItem key="unassigned" value="">
					Unassigned
				</MenuItem>,
				...users.map((user) => (
					<MenuItem key={user.user_id} value={user.email}>
						{user.email}
					</MenuItem>
				)),
			];
		};
	*/
	return (
		<StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>Alert Details</DialogTitle>
			<DialogContent>
				<StyledPaper>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							{renderAlertDetail("Alert ID", alert.id)}
							{renderAlertDetail(
								"Created At",
								new Date(alert.created_at).toLocaleString()
							)}
							{renderAlertDetail("Severity", alert.severity)}
						</Grid>
						<Grid item xs={12} md={6}>
							{renderAlertDetail("Hostname", alert.event?.hostname)}
							{renderAlertDetail("Event ID", alert.event?.EventID)}
							{renderAlertDetail("User ID", alert.event?.UserID)}
						</Grid>
						<Grid item xs={12}>
							{renderAlertDetail("Rule", alert.rule?.name || alert.rule)}
						</Grid>
					</Grid>
				</StyledPaper>

				{/* Investigation Details */}
				{alert.investigation && (
					<>
						<Typography variant="h6" gutterBottom>
							Investigation Details
						</Typography>
						<StyledPaper>
							<Grid container spacing={2}>
								<Grid item xs={12} md={6}>
									{renderAlertDetail("Assigned To", alert.investigation.assigned_to.email)}
									{renderAlertDetail("Status", alert.investigation.status)}
								</Grid>
								<Grid item xs={12} md={6}>
									{renderAlertDetail("Investigation Notes", alert.investigation.notes || "N/A")}
								</Grid>
							</Grid>
						</StyledPaper>
					</>
				)}

				<Typography variant="h6" gutterBottom>
					Assignment
				</Typography>
				<FormControl fullWidth sx={{ mb: 2 }}>
					<InputLabel>Assign To</InputLabel>
					<Select
						value={assignee}
						onChange={(e) => setAssignee(e.target.value)}
						label="Assign To"
						disabled={loadingUsers}
					>
						{renderSelectOptions()}
					</Select>
				</FormControl>

				<Typography variant="h6" gutterBottom>
					Comments
				</Typography>
				<TextField
					fullWidth
					multiline
					rows={4}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Add a comment..."
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
				<Button onClick={handleAssign} color="primary" variant="contained">
					Save Changes
				</Button>
			</DialogActions>
		</StyledDialog>
	);
};

export default AlertDetailsDialog;
