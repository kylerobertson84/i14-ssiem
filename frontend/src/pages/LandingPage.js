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
	useTheme,
	useMediaQuery,
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
import { styled } from "@mui/system";

import mainImage from "../Design/building-2.jpg";

const HeroSection = styled(Box)(({ theme }) => ({
	position: "relative",
	paddingTop: theme.spacing(8),
	paddingBottom: theme.spacing(6),
	backgroundImage: `url(${mainImage})`,
	backgroundSize: "cover",
	backgroundPosition: "center",
	color: theme.palette.common.white,
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
}));

const HeroContent = styled(Container)(({ theme }) => ({
	position: "relative",
	zIndex: 1,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
	height: "100%",
	display: "flex",
	flexDirection: "column",
	transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
	"&:hover": {
		transform: "translateY(-5px)",
		boxShadow: theme.shadows[4],
	},
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "center",
	marginBottom: theme.spacing(2),
}));

const Feature = ({ icon, title, description }) => (
	<FeatureCard>
		<CardContent sx={{ flexGrow: 1 }}>
			<FeatureIcon>
				{React.cloneElement(icon, {
					sx: { fontSize: 60, color: "primary.main" },
				})}
			</FeatureIcon>
			<Typography gutterBottom variant="h5" component="h2" align="center">
				{title}
			</Typography>
			<Typography align="center" variant="body2" color="text.secondary">
				{description}
			</Typography>
		</CardContent>
	</FeatureCard>
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box sx={{ flexGrow: 1 }}>
			<HeroSection>
				<HeroContent maxWidth="sm">
					<Typography
						component="h1"
						variant={isMobile ? "h3" : "h2"}
						align="center"
						gutterBottom
						sx={{ fontWeight: "bold" }}
					>
						Simple Security Information and Event Management (SIEM)
					</Typography>
					<Typography
						variant={isMobile ? "body1" : "h5"}
						align="center"
						paragraph
						sx={{ mb: 4 }}
					>
						Streamline your security operations with our centralized platform
						for threat detection and investigation.
					</Typography>
					<Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
						<Button
							variant="contained"
							size="large"
							component={RouterLink}
							to="/login"
							sx={{ fontWeight: "bold" }}
						>
							Log In
						</Button>
					</Box>
				</HeroContent>
			</HeroSection>

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
