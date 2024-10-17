import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	Tabs,
	Tab,
	Paper,
	Container,
	Grid,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Tooltip,
	CircularProgress,
	Chip,
	Divider,
	Alert,
	useTheme,
	useMediaQuery,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	PersonAdd as PersonAddIcon,
	Settings as SettingsIcon,
	Security as SecurityIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Email as EmailIcon,
	Storage as StorageIcon,
	Assessment as AssessmentIcon,
	VpnKey as VpnKeyIcon,
	LockOpen as LockOpenIcon,
	Api as ApiIcon,
} from "@mui/icons-material";
import AdminForm from "../components/AdminForm";
import { fetchUsers } from "../services/apiService";
import { deleteUser } from "../services/apiService";


const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
}));

const TabPanel = ({ children, value, index }) => (
	<div role="tabpanel" hidden={value !== index}>
		{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
	</div>
);

const DisabledFeature = ({ icon, primary, secondary }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<ListItem>
			<ListItemText
				primary={
					<Typography
						variant="subtitle1"
						sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
					>
						{icon}
						<span style={{ marginLeft: "8px" }}>{primary}</span>
						{isMobile && (
							<Chip
								label="Demo"
								color="secondary"
								size="small"
								sx={{ ml: 1, mt: 1 }}
							/>
						)}
					</Typography>
				}
				secondary={secondary}
			/>
			{!isMobile && (
				<>
					<Chip
						label="Demo Version"
						color="secondary"
						size="small"
						sx={{ mr: 1 }}
					/>
					<Button disabled variant="outlined" size="small">
						Configure
					</Button>
				</>
			)}
		</ListItem>
	);
};

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				const userData = await fetchUsers();
				setUsers(Array.isArray(userData) ? userData : [userData]);
			} catch (err) {
				console.error("Error fetching users:", err);
				setError("Failed to load users. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		loadUsers();
	}, []);

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	const handleOpenDialog = (user) => {
		setSelectedUser(user);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedUser(null);
	};

	const handleDeleteUser = async () => {
		try {
			await deleteUser(selectedUser.user_id);
			setUsers(users.filter(user => user.user_id !== selectedUser.user_id));
			setOpenDialog(false);
		} catch (err) {
			console.error("Error deleting user:", err);
			setError("Failed to delete user, Please try again.");
		} finally {
			handleCloseDialog();
		}
	};

	const handleUserCreated = (newUser) => {
		setUsers((prevUsers) => [...prevUsers, newUser]); // Add the new user to the existing list
	};


	return (
		<Container maxWidth="lg">
			<Box sx={{ my: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: "bold", mb: 3 }}
				>
					Admin Dashboard
				</Typography>
				<Paper sx={{ width: "100%", mb: 3 }}>
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						centered
						variant={isMobile ? "fullWidth" : "standard"}
					>
						<Tab
							label={isMobile ? "Users" : "User Management"}
							icon={<PersonAddIcon />}
						/>
						<Tab
							label={isMobile ? "System" : "System Settings"}
							icon={<SettingsIcon />}
						/>
						<Tab label="Security" icon={<SecurityIcon />} />
					</Tabs>
				</Paper>

				<TabPanel value={activeTab} index={0}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<StyledPaper>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center" }}
								>
									<PersonAddIcon sx={{ mr: 1 }} /> Add New User
								</Typography>
								<AdminForm onUserCreated={handleUserCreated} />
							</StyledPaper>
						</Grid>
						<Grid item xs={12} md={6}>
							<StyledPaper>
								<Typography
									variant="h6"
									gutterBottom
									sx={{ display: "flex", alignItems: "center" }}
								>
									<AssessmentIcon sx={{ mr: 1 }} /> Existing Users
								</Typography>
								{loading ? (
									<Box
										sx={{ display: "flex", justifyContent: "center", mt: 2 }}
									>
										<CircularProgress />
									</Box>
								) : error ? (
									<Alert severity="error" sx={{ mt: 2 }}>
										{error}
									</Alert>
								) : (
									<List>
										{users.map((user) => (
											<ListItem key={user.user_id}>
												<ListItemText
													primary={user.email}
													secondary={`Role: ${user.role.name}`}
													primaryTypographyProps={{
														variant: isMobile ? "body2" : "body1",
													}}
												/>
												<ListItemSecondaryAction>
													
													<Tooltip title="Delete User">
														<IconButton
															edge="end"
															aria-label="delete"
															size={isMobile ? "small" : "medium"}
															onClick={() => handleOpenDialog(user)}
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</ListItemSecondaryAction>
											</ListItem>
										))}
									</List>
								)}
							</StyledPaper>
						</Grid>
					</Grid>
				</TabPanel>

				<TabPanel value={activeTab} index={1}>
					<StyledPaper>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ display: "flex", alignItems: "center" }}
						>
							<SettingsIcon sx={{ mr: 1 }} /> System Settings
						</Typography>
						<Alert severity="info" sx={{ mb: 2 }}>
							The following features are disabled in the demo version.
						</Alert>
						<List>
							<DisabledFeature
								icon={<EmailIcon color="primary" />}
								primary="Email Notifications"
								secondary="Configure system-wide email settings"
							/>
							<Divider component="li" />
							<DisabledFeature
								icon={<StorageIcon color="primary" />}
								primary="Data Retention"
								secondary="Set data retention policies"
							/>
							<Divider component="li" />
							<DisabledFeature
								icon={<AssessmentIcon color="primary" />}
								primary="System Logs"
								secondary="View and manage system logs"
							/>
						</List>
					</StyledPaper>
				</TabPanel>

				<TabPanel value={activeTab} index={2}>
					<StyledPaper>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ display: "flex", alignItems: "center" }}
						>
							<SecurityIcon sx={{ mr: 1 }} /> Security Settings
						</Typography>
						<Alert severity="info" sx={{ mb: 2 }}>
							The following features are disabled in the demo version.
						</Alert>
						<List>
							<DisabledFeature
								icon={<VpnKeyIcon color="primary" />}
								primary="Password Policy"
								secondary="Set password strength requirements"
							/>
							<Divider component="li" />
							<DisabledFeature
								icon={<LockOpenIcon color="primary" />}
								primary="Two-Factor Authentication"
								secondary="Enable or disable 2FA"
							/>
							<Divider component="li" />
							<DisabledFeature
								icon={<ApiIcon color="primary" />}
								primary="API Keys"
								secondary="Manage API keys for integrations"
							/>
						</List>
					</StyledPaper>
				</TabPanel>
			</Box>
			{/* Delete Confirmation Dialog */}
			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
			>
				<DialogTitle id="confirm-dialog-title">Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText id="confirm-dialog-description">
						Are you sure you want to delete the user <strong>{selectedUser?.email}</strong>? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteUser} color="secondary" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>


		</Container>
	);
};

export default AdminPage;
