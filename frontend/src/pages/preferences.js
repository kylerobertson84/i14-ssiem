import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	CircularProgress,
	Container,
	Grid,
	Paper,
	Avatar,
	Switch,
	FormControlLabel,
	Button,
	Divider,
} from "@mui/material";
import {
	AccountCircle as AccountCircleIcon,
	Notifications as NotificationsIcon,
	Visibility as VisibilityIcon,
	Security as SecurityIcon,
} from "@mui/icons-material";
import { fetchUser } from "../services/apiService";
import PreferencesForm from "../components/PreferencesForm";

const Preferences = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const userData = await fetchUser();
				setUser(userData);
			} catch (error) {
				console.error("Error loading user data", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Container maxWidth="md">
			<Box my={4}>
				<Typography variant="h4" component="h1" gutterBottom align="center">
					User Preferences
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
							<Avatar sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}>
								<AccountCircleIcon sx={{ fontSize: 60 }} />
							</Avatar>
							<Typography variant="h6">{user?.username || "User"}</Typography>
							<Typography variant="body2" color="textSecondary">
								{user?.email || "No email provided"}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Role: {user?.role?.name || "No role assigned"}
							</Typography>
							<Button variant="outlined" sx={{ mt: 2 }}>
								Edit Profile
							</Button>
						</Paper>
					</Grid>
					<Grid item xs={12} md={8}>
						<Paper elevation={3} sx={{ p: 3 }}>
							<Typography variant="h6" gutterBottom>
								Notification Settings
							</Typography>
							<FormControlLabel
								control={<Switch defaultChecked />}
								label="Receive email notifications"
							/>
							<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
								Display Settings
							</Typography>
							<FormControlLabel control={<Switch />} label="Dark Mode" />
							<Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
								Security Settings
							</Typography>
							<Button
								variant="outlined"
								startIcon={<VisibilityIcon />}
								sx={{ mr: 2, mb: 2 }}
							>
								Change Password
							</Button>
							<Button
								variant="outlined"
								startIcon={<SecurityIcon />}
								sx={{ mb: 2 }}
							>
								Two-Factor Authentication
							</Button>
						</Paper>
					</Grid>
				</Grid>
				<Paper elevation={3} sx={{ p: 3, mt: 3 }}>
					<Typography variant="h6" gutterBottom>
						Additional Preferences
					</Typography>
					<Divider sx={{ my: 2 }} />
					<PreferencesForm />
				</Paper>
			</Box>
		</Container>
	);
};

export default Preferences;
