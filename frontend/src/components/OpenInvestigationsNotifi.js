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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useAuth } from "../services/AuthContext";
import {
	fetchOpenInvestigations,
	updateInvestigation,
} from "../services/apiService";

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
					setInvestigations(data);
				})
				.catch((error) =>
					console.error("Error fetching open investigations:", error)
				);
		}
	};

	useEffect(() => {
		fetchInvestigations();
		// Set up an interval to fetch investigations every 5 minutes
		const interval = setInterval(fetchInvestigations, 300000);
		return () => clearInterval(interval);
	}, [user, hasRole]);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleSelectInvestigation = (investigation) => {
		setSelectedInvestigation(investigation);
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
			(hasRole("ANALYST") && investigation.assigned_to.id === user.id)
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
									onClick={() => handleSelectInvestigation(investigation)}
								>
									<ListItemText
										primary={`Alert ${investigation.alert.id}: ${investigation.alert.rule.name}`}
										secondary={`Assigned to: ${investigation.assigned_to.email}`}
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

	return (
		<Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{`Investigation for Alert ${investigation.alert.id}`}</DialogTitle>
			<DialogContent>
				<Typography variant="subtitle1">
					Rule: {investigation.alert.rule.name}
				</Typography>
				<Typography variant="subtitle1">
					Severity: {investigation.alert.severity}
				</Typography>
				<Typography variant="subtitle1">
					Assigned to: {investigation.assigned_to.email}
				</Typography>
				{canManage && (
					<>
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
						<TextField
							label="Notes"
							multiline
							rows={4}
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							fullWidth
							margin="normal"
						/>
					</>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
				{canManage && (
					<Button onClick={handleUpdate} color="primary">
						Update
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default OpenInvestigationsNotification;
