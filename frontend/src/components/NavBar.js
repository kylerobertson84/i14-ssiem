import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	useMediaQuery,
	useTheme,
	Avatar,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	CircularProgress,
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
	PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useAuth } from "../services/AuthContext";
import whaleIcon from "../Design/whale-icon.png";

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user, loading, logout, hasRole } = useAuth();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setDrawerOpen(open);
	};

	const navItems = [
		{
			label: "Dashboard",
			path: "/dashboard",
			icon: <DashboardIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Stored Logs",
			path: "/queries",
			icon: <QueriesIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Alerts",
			path: "/alerts",
			icon: <AlertsIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Investigations",
			path: "/investigations",
			icon: <InvestigationsIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Reports",
			path: "/reports",
			icon: <ReportsIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Preferences",
			path: "/preferences",
			icon: <PreferencesIcon />,
			roles: ["ADMIN", "ANALYST"],
		},
		{
			label: "Admin Page",
			path: "/admin",
			icon: <PersonAddIcon />,
			roles: ["ADMIN"],
		},
	];

	const filteredNavItems = navItems.filter((item) => hasRole(item.roles));

	const DrawerContent = (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
		>
			<List>
				{user &&
					filteredNavItems.map((item) => (
						<ListItem button key={item.path} component={Link} to={item.path}>
							<ListItemIcon>{item.icon}</ListItemIcon>
							<ListItemText primary={item.label} />
						</ListItem>
					))}
				<ListItem button onClick={user ? handleLogout : handleLogin}>
					<ListItemIcon>{user ? <LogoutIcon /> : <LoginIcon />}</ListItemIcon>
					<ListItemText primary={user ? "Logout" : "Login"} />
				</ListItem>
			</List>
		</Box>
	);

	if (loading) {
		return (
			<AppBar position="static">
				<Toolbar>
					<CircularProgress color="inherit" />
				</Toolbar>
			</AppBar>
		);
	}

	return (
		<AppBar position="static">
			<Toolbar sx={{ justifyContent: "space-between" }}>
				<Typography
					variant="h5"
					component="div"
					sx={{ display: "flex", alignItems: "center" }}
				>
					<img
						src={whaleIcon}
						alt="logo"
						style={{ height: "32px", marginRight: "8px" }}
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
							onClick={toggleDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
						<Drawer
							anchor="right"
							open={drawerOpen}
							onClose={toggleDrawer(false)}
						>
							{DrawerContent}
						</Drawer>
					</>
				) : (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{user &&
							filteredNavItems.map((item) => (
								<Button
									key={item.path}
									component={Link}
									to={item.path}
									startIcon={item.icon}
									className={location.pathname === item.path ? "active" : ""}
									color="inherit"
								>
									{item.label}
								</Button>
							))}
						{user && (
							<Avatar className="navbar-avatar">
								{user.email ? user.email[0].toUpperCase() : "U"}
							</Avatar>
						)}
						<Button
							onClick={user ? handleLogout : handleLogin}
							startIcon={user ? <LogoutIcon /> : <LoginIcon />}
							color="inherit"
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
