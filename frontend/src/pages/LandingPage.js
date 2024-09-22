import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	Grid,
	Typography,
	Card,
	CardContent,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
} from "@mui/material";
import {
	Security,
	Speed,
	Group,
	DataUsage,
	Search,
	Storage,
	Language,
	IntegrationInstructions,
	Psychology,
	Visibility,
} from "@mui/icons-material";

import mainImage from "../Design/building-2.jpg";

const Feature = ({ icon, title, description }) => (
	<Card
		sx={{
			height: "100%",
			display: "flex",
			flexDirection: "column",
			boxShadow: 3,
		}}
	>
		<CardContent sx={{ flexGrow: 1 }}>
			<Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
				{React.cloneElement(icon, {
					sx: { fontSize: 60, color: "primary.main" },
				})}
			</Box>
			<Typography gutterBottom variant="h5" component="h2" align="center">
				{title}
			</Typography>
			<Typography align="center" variant="body2" color="text.secondary">
				{description}
			</Typography>
		</CardContent>
	</Card>
);

const Requirement = ({ icon, text }) => (
	<ListItem>
		<ListItemIcon>
			{React.cloneElement(icon, { color: "primary" })}
		</ListItemIcon>
		<ListItemText primary={text} />
	</ListItem>
);

const LandingPage = () => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Box
				sx={{
					position: "relative",
					pt: 8,
					pb: 6,
					backgroundImage: `url(${mainImage})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					color: "white",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						bgcolor: "rgba(0, 0, 0, 0.5)",
						zIndex: 1,
					},
					zIndex: 0,
				}}
			>
				<Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
					<Typography
						component="h1"
						variant="h2"
						align="center"
						gutterBottom
						sx={{ fontWeight: "bold" }}
					>
						Simple Security Information and Event Management (SIEM)
					</Typography>
					<Typography variant="h5" align="center" paragraph sx={{ mb: 4 }}>
						Streamline your security operations with our centralized platform
						for threat detection and investigation.
					</Typography>
					<Box
						sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
					>
						<Button
							variant="contained"
							size="large"
							component={RouterLink}
							to="/login"
							sx={{ fontWeight: "bold" }}
						>
							Start Demo
						</Button>
					</Box>
				</Container>
			</Box>

			{/* Description Section */}
			<Container sx={{ py: 8 }} maxWidth="md">
				<Typography variant="h4" align="center" gutterBottom>
					Centralised Security Management
				</Typography>
				<Typography variant="body1" align="center" paragraph>
					Our Simple SIEM platform ingests security information and events from
					various sources, providing a secure, centralized environment for
					detection and correlation of threats. Empower your operations analysts
					to triage and investigate alerts effectively.
				</Typography>
			</Container>

			{/* Key Features Section */}
			<Box sx={{ bgcolor: "background.paper", py: 8 }}>
				<Container maxWidth="lg">
					<Typography variant="h4" align="center" gutterBottom>
						Key Features
					</Typography>
					<Grid container spacing={4} sx={{ mt: 2 }}>
						<Grid item xs={12} sm={6} md={4}>
							<Feature
								icon={<Security />}
								title="Comprehensive Security"
								description="Monitor, analyze, and respond to security events across your entire infrastructure."
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Feature
								icon={<Speed />}
								title="Real-time Analytics"
								description="Get instant insights with our powerful real-time analytics engine."
							/>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<Feature
								icon={<Group />}
								title="Collaborative Investigations"
								description="Work together seamlessly on security investigations and incident response."
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<Container sx={{ py: 8 }} maxWidth="lg">
				<Typography variant="h4" align="center" gutterBottom color="primary">
					Functional Requirements
				</Typography>
				<Grid container spacing={4} sx={{ mt: 2 }}>
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 3, height: "100%" }}>
							<Typography variant="h6" gutterBottom>
								Core Features
							</Typography>
							<List>
								<Requirement
									icon={<Security />}
									text="Security-focused design to prevent breaches"
								/>
								<Requirement
									icon={<DataUsage />}
									text="Comprehensive log ingestion from various sources"
								/>
								<Requirement
									icon={<Storage />}
									text="Secure log storage with customizable options"
								/>
								<Requirement
									icon={<Language />}
									text="User-friendly web interface with SSL/TLS encryption"
								/>
							</List>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 3, height: "100%" }}>
							<Typography variant="h6" gutterBottom>
								Optional Features
							</Typography>
							<List>
								<Requirement
									icon={<Search />}
									text="Proactively seek out hidden threats"
								/>
								<Requirement
									icon={<IntegrationInstructions />}
									text="Threat intelligence integration"
								/>
								<Requirement
									icon={<Psychology />}
									text="Machine learning for advanced alert generation"
								/>
								<Requirement
									icon={<Visibility />}
									text="Detect anomalous user behaviors quickly"
								/>
							</List>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};

export default LandingPage;
