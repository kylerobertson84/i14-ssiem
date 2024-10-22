import React, { useState, useEffect } from "react";
import {
	Badge,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	Typography,
	Fab,
	TextField,
	MenuItem,
	Card,
	CardContent,
	CardActions,
	Grid,
	Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../services/AuthContext";
import {
	fetchOpenInvestigations,
	updateInvestigation,
	fetchInvestigation,
} from "../services/apiService";
import { format, parseISO } from "date-fns";

const NotificationFab = styled(Fab)(({ theme }) => ({
	position: "fixed",
	bottom: theme.spacing(2),
	right: theme.spacing(2),
}));

const OpenInvestigationsNotification = () => {
	const [open, setOpen] = useState(false);
	const [investigations, setInvestigations] = useState([]);
	const [selectedInvestigation, setSelectedInvestigation] = useState(null);
	const { user, hasRole } = useAuth();

	const fetchInvestigations = () => {
		if (user && (hasRole("ANALYST") || hasRole("ADMIN"))) {
			fetchOpenInvestigations()
				.then((data) => {
					// Filter out closed investigations
					const openInvestigations = data.filter(investigation => investigation.status !== 'CLOSED');
					setInvestigations(openInvestigations);
				})
				.catch((error) =>
					console.error("Error fetching open investigations:", error)
				);
		}
	};

	useEffect(() => {
		fetchInvestigations();
		const interval = setInterval(fetchInvestigations, 300000);
		return () => clearInterval(interval);
	}, [user, hasRole]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSelectInvestigation = async (investigationId) => {
		try {
			const investigation = await fetchInvestigation(investigationId);
			setSelectedInvestigation(investigation);
		} catch (error) {
			console.error("Error fetching investigation details:", error);
		}
	};

	const handleUpdateInvestigation = async (status, notes) => {
		try {
			await updateInvestigation(selectedInvestigation.id, { status, notes });
			setSelectedInvestigation(null);
			fetchInvestigations();
		} catch (error) {
			console.error("Error updating investigation:", error);
		}
	};

	const canManageInvestigation = (investigation) => {
		return (
			hasRole("ADMIN") ||
			(hasRole("ANALYST") && investigation.assigned_to.user_id === user.id)
		);
	};

	return (
		<>
			<NotificationFab color="primary" onClick={handleOpen}>
				<Badge badgeContent={investigations.length} color="error">
					<NotificationsIcon />
				</Badge>
			</NotificationFab>
			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>
					{hasRole("ADMIN")
						? "Open Investigations"
						: "Your Open Investigations"}
				</DialogTitle>
				<DialogContent>
					{investigations.length === 0 ? (
						<Typography>No open investigations at the moment.</Typography>
					) : (
						<List>
							{investigations.map((investigation) => (
								<ListItem
									key={investigation.id}
									button
									onClick={() => handleSelectInvestigation(investigation.id)}
								>
									<ListItemText
										primary={`Alert ${investigation.alert.id}: ${investigation.alert.rule}`}
										secondary={
											<>
												<Typography
													component="span"
													variant="body2"
													color="text.primary"
												>
													Assigned to: {investigation.assigned_to.email}
												</Typography>
												<br />
												<Typography
													component="span"
													variant="body2"
													color="text.secondary"
												>
													Severity: {investigation.alert.severity}
												</Typography>
											</>
										}
									/>
								</ListItem>
							))}
						</List>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
			{selectedInvestigation && (
				<InvestigationDetailsDialog
					investigation={selectedInvestigation}
					onClose={() => setSelectedInvestigation(null)}
					onUpdate={handleUpdateInvestigation}
					canManage={canManageInvestigation(selectedInvestigation)}
				/>
			)}
		</>
	);
};

const InvestigationDetailsDialog = ({
	investigation,
	onClose,
	onUpdate,
	canManage,
}) => {
	const [status, setStatus] = useState(investigation.status);
	const [notes, setNotes] = useState(investigation.notes || "");

	const handleUpdate = () => {
		onUpdate(status, notes);
		onClose();
	};

	const formatDateTime = (dateTimeString) => {
		return format(parseISO(dateTimeString), "PPP 'at' HH:mm");
	};

	return (
		<Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{`Investigation for Alert ${investigation.alert.id}`}</DialogTitle>
			<DialogContent>
				<Card elevation={3}>
					<CardContent>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Typography variant="h6">{investigation.alert.rule}</Typography>
								<Typography variant="body2" color="text.secondary">
									Created: {formatDateTime(investigation.created_at)}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Last Updated: {formatDateTime(investigation.updated_at)}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Divider />
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle1">
									Severity: {investigation.alert.severity}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="subtitle1">
									Assigned to: {investigation.assigned_to.email}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography variant="subtitle1">Event Details:</Typography>
								<Typography variant="body2">
									Event ID: {investigation.alert.event.EventID}
								</Typography>
								<Typography variant="body2">
									User ID: {investigation.alert.event.UserID || "N/A"}
								</Typography>
								<Typography variant="body2">
									Hostname: {investigation.alert.event.hostname}
								</Typography>
							</Grid>
							{investigation.alert.comments && (
								<Grid item xs={12}>
									<Typography variant="subtitle1">Comments:</Typography>
									<Typography variant="body2">
										{investigation.alert.comments}
									</Typography>
								</Grid>
							)}
							{canManage && (
								<>
									<Grid item xs={12}>
										<TextField
											select
											label="Status"
											value={status}
											onChange={(e) => setStatus(e.target.value)}
											fullWidth
											margin="normal"
										>
											<MenuItem value="OPEN">Open</MenuItem>
											<MenuItem value="IN PROGRESS">In Progress</MenuItem>
											<MenuItem value="CLOSED">Closed</MenuItem>
										</TextField>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Notes"
											multiline
											rows={4}
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											fullWidth
											margin="normal"
										/>
									</Grid>
								</>
							)}
						</Grid>
					</CardContent>
					<CardActions>
						<Button onClick={onClose}>Close</Button>
						{canManage && (
							<Button onClick={handleUpdate} color="primary">
								Update
							</Button>
						)}
					</CardActions>
				</Card>
			</DialogContent>
		</Dialog>
	);
};

export default OpenInvestigationsNotification;
