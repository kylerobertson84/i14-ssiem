import React from "react";
import {
	Box,
	Container,
	Grid,
	Typography,
	Link,
	IconButton,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { GitHub, LinkedIn, Twitter } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledFooter = styled("footer")(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(6, 0),
	marginTop: theme.spacing(6),
	borderTop: `1px solid ${theme.palette.divider}`,
}));

const QuickLink = styled(Link)(({ theme }) => ({
	display: "block",
	marginBottom: theme.spacing(1),
	color: theme.palette.text.secondary,
	transition: "color 0.3s ease",
	"&:hover": {
		color: theme.palette.primary.main,
	},
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
	marginRight: theme.spacing(2),
	"&:hover": {
		backgroundColor: theme.palette.action.hover,
	},
}));

const Footer = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const currentYear = new Date().getFullYear();

	return (
		<StyledFooter>
			<Container maxWidth="lg">
				<Grid container spacing={4} justifyContent="space-between">
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="primary" gutterBottom>
							Simple SIEM
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Providing advanced security information and event management
							solutions to keep your systems safe.
						</Typography>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="primary" gutterBottom>
							Quick Links
						</Typography>
						<QuickLink href="#">Home</QuickLink>
						<QuickLink href="#">About Us</QuickLink>
						<QuickLink href="#">Contact</QuickLink>
						<QuickLink href="#">Privacy Policy</QuickLink>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Typography variant="h6" color="primary" gutterBottom>
							Connect With Us
						</Typography>
						<Box>
							<SocialButton color="primary" aria-label="GitHub">
								<GitHub />
							</SocialButton>
							<SocialButton color="primary" aria-label="LinkedIn">
								<LinkedIn />
							</SocialButton>
							<SocialButton color="primary" aria-label="Twitter">
								<Twitter />
							</SocialButton>
						</Box>
					</Grid>
				</Grid>
				<Box mt={isMobile ? 3 : 5}>
					<Typography variant="body2" color="text.secondary" align="center">
						© {currentYear} Simple SIEM. All rights reserved.
					</Typography>
				</Box>
			</Container>
		</StyledFooter>
	);
};

export default Footer;
