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
	Alert,
	Chip,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
	AccountCircle as AccountCircleIcon,
	Notifications as NotificationsIcon,
	Visibility as VisibilityIcon,
	Security as SecurityIcon,
	Brightness4 as DarkModeIcon,
	Settings as SettingsIcon,
	Edit as EditIcon,
} from "@mui/icons-material";
import { fetchUser } from "../services/apiService";
import PreferencesForm from "../components/PreferencesForm";

const StyledPaper = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(3),
	marginBottom: theme.spacing(3),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
	width: 100,
	height: 100,
	margin: "0 auto",
	marginBottom: theme.spacing(2),
}));

const DisabledFeature = ({ icon, label }) => (
	<FormControlLabel
		control={<Switch disabled />}
		label={
			<Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
				{icon}
				<Typography sx={{ ml: 1 }}>{label}</Typography>
			</Box>
		}
	/>
);

const Preferences = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
				<Typography
					variant="h4"
					component="h1"
					sx={{ fontWeight: "bold", mb: 3 }}
				>
					User Preferences
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<StyledPaper sx={{ textAlign: "center" }}>
							<ProfileAvatar>
								<AccountCircleIcon sx={{ fontSize: 60 }} />
							</ProfileAvatar>
							<Typography variant="h6">{user?.username || "User"}</Typography>
							<Typography variant="body2" color="textSecondary">
								{user?.email || "No email provided"}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Role: {user?.role?.name || "No role assigned"}
							</Typography>
							<Chip
								label="Demo Version"
								color="secondary"
								size="small"
								sx={{ mt: 1 }}
							/>
							<Button
								variant="outlined"
								disabled
								startIcon={<EditIcon />}
								sx={{ mt: 2 }}
								fullWidth={isMobile}
							>
								Edit Profile
							</Button>
						</StyledPaper>
					</Grid>
					<Grid item xs={12} md={8}>
						<StyledPaper>
							<Alert severity="info" sx={{ mb: 2 }}>
								The following feature is disabled in the demo version.
							</Alert>
							<Typography
								variant="h6"
								gutterBottom
								sx={{ display: "flex", alignItems: "center" }}
							>
								<NotificationsIcon sx={{ mr: 1 }} /> Notification Settings
							</Typography>
							<FormControlLabel
								control={<Switch defaultChecked />}
								label="Receive email notifications"
							/>
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									mt: 3,
									display: "flex",
									alignItems: "center",
									flexWrap: "wrap",
								}}
							>
								<DarkModeIcon sx={{ mr: 1 }} /> Display Settings
								<Chip
									label="Demo Version"
									color="secondary"
									size="small"
									sx={{ ml: 1, mt: isMobile ? 1 : 0 }}
								/>
							</Typography>
							<DisabledFeature icon={<DarkModeIcon />} label="Dark Mode" />
							<Typography
								variant="h6"
								gutterBottom
								sx={{
									mt: 3,
									display: "flex",
									alignItems: "center",
									flexWrap: "wrap",
								}}
							>
								<SecurityIcon sx={{ mr: 1 }} /> Security Settings
								<Chip
									label="Demo Version"
									color="secondary"
									size="small"
									sx={{ ml: 1, mt: isMobile ? 1 : 0 }}
								/>
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexDirection: isMobile ? "column" : "row",
									gap: 2,
								}}
							>
								<Button
									variant="outlined"
									disabled
									startIcon={<VisibilityIcon />}
									fullWidth={isMobile}
								>
									Change Password
								</Button>
								<Button
									variant="outlined"
									disabled
									startIcon={<SecurityIcon />}
									fullWidth={isMobile}
								>
									Two-Factor Authentication
								</Button>
							</Box>
						</StyledPaper>
					</Grid>
				</Grid>
				<StyledPaper>
					<Typography
						variant="h6"
						gutterBottom
						sx={{ display: "flex", alignItems: "center" }}
					>
						<SettingsIcon sx={{ mr: 1 }} /> Additional Preferences
					</Typography>
					<Divider sx={{ my: 2 }} />
					<PreferencesForm />
				</StyledPaper>
			</Box>
		</Container>
	);
};

export default Preferences;
