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
} from "@mui/material";
import {
	PersonAdd as PersonAddIcon,
	Settings as SettingsIcon,
	Security as SecurityIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";
import AdminForm from "../components/AdminForm";
import { fetchUsers } from "../services/apiService";

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadUsers = async () => {
			try {
				setLoading(true);
				const userData = await fetchUsers();
				// Assuming fetchUser returns an array of users. If it returns a single user, wrap it in an array.
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

	const TabPanel = ({ children, value, index }) => (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);

	return (
		<Container maxWidth="lg">
			<Box sx={{ my: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Admin Dashboard
				</Typography>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<Tabs value={activeTab} onChange={handleTabChange} centered>
						<Tab label="User Management" icon={<PersonAddIcon />} />
						<Tab label="System Settings" icon={<SettingsIcon />} />
						<Tab label="Security" icon={<SecurityIcon />} />
					</Tabs>
				</Paper>

				<TabPanel value={activeTab} index={0}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom>
								Add New User
							</Typography>
							<AdminForm />
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h6" gutterBottom>
								Existing Users
							</Typography>
							{loading ? (
								<CircularProgress />
							) : error ? (
								<Typography color="error">{error}</Typography>
							) : (
								<List>
									{users.map((user) => (
										<ListItem key={user.user_id}>
											<ListItemText
												primary={user.email}
												secondary={`Role: ${user.role.name}`}
											/>
											<ListItemSecondaryAction>
												<Tooltip title="Edit User">
													<IconButton edge="end" aria-label="edit">
														<EditIcon />
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete User">
													<IconButton edge="end" aria-label="delete">
														<DeleteIcon />
													</IconButton>
												</Tooltip>
											</ListItemSecondaryAction>
										</ListItem>
									))}
								</List>
							)}
						</Grid>
					</Grid>
				</TabPanel>

				<TabPanel value={activeTab} index={1}>
					<Typography variant="h6" gutterBottom>
						System Settings
					</Typography>
					<List>
						<ListItem>
							<ListItemText
								primary="Email Notifications"
								secondary="Configure system-wide email settings"
							/>
							<Button variant="outlined">Configure</Button>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Data Retention"
								secondary="Set data retention policies"
							/>
							<Button variant="outlined">Set Policy</Button>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="System Logs"
								secondary="View and manage system logs"
							/>
							<Button variant="outlined">View Logs</Button>
						</ListItem>
					</List>
				</TabPanel>

				<TabPanel value={activeTab} index={2}>
					<Typography variant="h6" gutterBottom>
						Security Settings
					</Typography>
					<List>
						<ListItem>
							<ListItemText
								primary="Password Policy"
								secondary="Set password strength requirements"
							/>
							<Button variant="outlined">Configure</Button>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="Two-Factor Authentication"
								secondary="Enable or disable 2FA"
							/>
							<Button variant="outlined">Manage</Button>
						</ListItem>
						<ListItem>
							<ListItemText
								primary="API Keys"
								secondary="Manage API keys for integrations"
							/>
							<Button variant="outlined">Manage Keys</Button>
						</ListItem>
					</List>
				</TabPanel>
			</Box>
		</Container>
	);
};

export default AdminPage;
