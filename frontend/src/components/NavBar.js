import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Menu,
	MenuItem,
	useMediaQuery,
	useTheme,
	Avatar,
} from "@mui/material";
import {
	Dashboard as DashboardIcon,
	Search as InvestigationsIcon,
	QueryStats as QueriesIcon,
	Assessment as ReportsIcon,
	Notifications as AlertsIcon,
	Settings as PreferencesIcon,
	Menu as MenuIcon,
	ExitToApp as LogoutIcon,
	Login as LoginIcon,
} from "@mui/icons-material";
import AuthService from "../services/AuthService";
import { useAuth } from "../services/AuthContext";
import whaleIcon from "../Design/whale-icon.png";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [anchorEl, setAnchorEl] = useState(null);
	const { user, setUser } = useAuth();

	const handleLogout = () => {
		AuthService.logout();
		setUser(null);
		navigate("/");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	if (user && user.username) {
		console.log("User Username:", user.username);
	}

	const navItems = [
		{ label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
		{ label: "Queries", path: "/queries", icon: <QueriesIcon /> },
		{ label: "Alerts", path: "/alerts", icon: <AlertsIcon /> },
		{
			label: "Investigations",
			path: "/investigations",
			icon: <InvestigationsIcon />,
		},
		{ label: "Reports", path: "/reports", icon: <ReportsIcon /> },
		{ label: "Preferences", path: "/preferences", icon: <PreferencesIcon /> },
        { label: "Admin Page", path: "/admin", icon: <PersonAddIcon />}
	];

	const NavButton = ({ item }) => (
		<Button
			color="inherit"
			component={Link}
			to={item.path}
			startIcon={item.icon}
			sx={{
				mx: 1,
				borderRadius: 2,
				"&.active": {
					backgroundColor: "rgba(255, 255, 255, 0.12)",
				},
			}}
			className={location.pathname === item.path ? "active" : ""}
		>
			{item.label}
		</Button>
	);

	return (
		<AppBar position="static" elevation={0} sx={{ backgroundColor: "#1565c0" }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Typography
					variant="h6"
					component="div"
					sx={{ display: "flex", alignItems: "center" }}
				>
					<img
						src={whaleIcon}
						alt="logo"
						style={{
							width: "50px",
							height: "50px",
							marginRight: "10px",
							transform: "scale(1.5)",
						}}
					/>
					Simple SIEM
				</Typography>

				{isMobile ? (
					<>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={handleMenuOpen}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							{user &&
								navItems.map((item) => (
									<MenuItem
										key={item.path}
										onClick={() => {
											navigate(item.path);
											handleMenuClose();
										}}
									>
										{item.icon}
										<Typography sx={{ ml: 1 }}>{item.label}</Typography>
									</MenuItem>
								))}
							<MenuItem onClick={user ? handleLogout : handleLogin}>
								{user ? <LogoutIcon /> : <LoginIcon />}
								<Typography sx={{ ml: 1 }}>
									{user ? "Logout" : "Login"}
								</Typography>
							</MenuItem>
						</Menu>
					</>
				) : (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{user &&
							navItems.map((item) => <NavButton key={item.path} item={item} />)}
						{user && (
							<Avatar
								sx={{
									width: 32,
									height: 32,
									marginLeft: 2,
									fontSize: "0.875rem",
									bgcolor: "secondary.main",
								}}
							>
								{user.username ? user.username[0].toUpperCase() : "U"}
							</Avatar>
						)}
						<Button
							color="inherit"
							onClick={user ? handleLogout : handleLogin}
							startIcon={user ? <LogoutIcon /> : <LoginIcon />}
							sx={{ ml: 2 }}
						>
							{user ? "Logout" : "Login"}
						</Button>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
