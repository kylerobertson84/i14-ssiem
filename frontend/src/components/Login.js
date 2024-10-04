import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../services/AuthContext";
import {
	Button,
	TextField,
	Box,
	Typography,
	Container,
	Grid,
	Link,
	Checkbox,
	FormControlLabel,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Paper,
	useTheme,
	useMediaQuery,
	Divider,
} from "@mui/material";
import {
	Google,
	GitHub,
	Security,
	Storage,
	Dashboard,
	Psychology,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import SEO from "../Design/SEO";

const Feature = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	marginBottom: theme.spacing(2),
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
	marginRight: theme.spacing(2),
	color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

const DEMO_ACCOUNTS = {
	user1: { email: "user1@siem.com", password: "abc123", role: "ANALYST" },
	user2: { email: "user2@siem.com", password: "abc123", role: "ANALYST" },
	admin1: { email: "admin1@siem.com", password: "abc123", role: "ADMIN" },
	admin2: { email: "admin2@siem.com", password: "abc123", role: "ADMIN" },
};

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [selectedAccount, setSelectedAccount] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	useEffect(() => {
		if (selectedAccount) {
			const account = DEMO_ACCOUNTS[selectedAccount];
			setEmail(account.email);
			setPassword(account.password);
		}
	}, [selectedAccount]);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const userData = await AuthService.login(email, password);
			setUser(userData);

			setTimeout(() => {
				window.location.reload();
			}, 100);
			navigate("/dashboard");
		} catch (error) {
			setMessage("Login failed. Please check your credentials.");
		}
	};

	const handleAccountChange = (event) => {
		setSelectedAccount(event.target.value);
	};

	return (
		<>
			<SEO
				title="Login"
				description="Log in to SimpleSIEM - Secure access to your SIEM dashboard"
			/>
			<Container component="main" maxWidth="lg">
				<Grid
					container
					spacing={4}
					sx={{ minHeight: "100vh", alignItems: "center" }}
				>
					{!isMobile && (
						<Grid item xs={12} md={6}>
							<Box sx={{ mb: 4 }}>
								<Typography
									variant="h4"
									component="h1"
									color="primary"
									gutterBottom
								>
									SimpleSIEM
								</Typography>
							</Box>
							<Feature>
								<FeatureIcon>
									<Security fontSize="large" />
								</FeatureIcon>
								<Box>
									<Typography variant="subtitle1" color="primary">
										Advanced Threat Detection
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Our SIEM solution effortlessly adapts to your security
										needs, boosting efficiency in threat identification.
									</Typography>
								</Box>
							</Feature>
							<Feature>
								<FeatureIcon>
									<Storage fontSize="large" />
								</FeatureIcon>
								<Box>
									<Typography variant="subtitle1" color="primary">
										Robust Log Management
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Experience unmatched durability with our long-term log
										storage and analysis capabilities.
									</Typography>
								</Box>
							</Feature>
							<Feature>
								<FeatureIcon>
									<Dashboard fontSize="large" />
								</FeatureIcon>
								<Box>
									<Typography variant="subtitle1" color="primary">
										Intuitive Dashboard
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Integrate our SIEM into your security operations with an
										easy-to-use and customizable interface.
									</Typography>
								</Box>
							</Feature>
							<Feature>
								<FeatureIcon>
									<Psychology fontSize="large" />
								</FeatureIcon>
								<Box>
									<Typography variant="subtitle1" color="primary">
										AI-Powered Analytics
									</Typography>
									<Typography variant="body2" color="textSecondary">
										Stay ahead with machine learning features that set new
										standards in security event correlation and analysis.
									</Typography>
								</Box>
							</Feature>
						</Grid>
					)}
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 4 }}>
							<Typography
								component="h1"
								variant="h5"
								gutterBottom
								align="center"
							>
								Sign in
							</Typography>
							<Box component="form" onSubmit={handleLogin} noValidate>
								<FormControl fullWidth margin="normal">
									<InputLabel id="account-select-label">
										Select Demo Account
									</InputLabel>
									<Select
										labelId="account-select-label"
										id="account-select"
										value={selectedAccount}
										label="Select Demo Account"
										onChange={handleAccountChange}
									>
										<MenuItem value="">
											<em>None</em>
										</MenuItem>
										{Object.entries(DEMO_ACCOUNTS).map(([key, account]) => (
											<MenuItem key={key} value={key}>
												{`${key} (${account.role})`}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<TextField
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email"
									name="email"
									autoComplete="email"
									autoFocus
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<FormControlLabel
									control={<Checkbox value="remember" color="primary" />}
									label="Remember me"
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
								>
									Sign In
								</Button>
								<Grid container>
									<Grid item xs>
										<Link href="#" variant="body2">
											Forgot password?
										</Link>
									</Grid>
									<Grid item>
										<Link href="#" variant="body2">
											{"Don't have an account? Sign Up"}
										</Link>
									</Grid>
								</Grid>
								<Divider sx={{ my: 3 }}>
									<Typography variant="body2" color="text.secondary">
										Coming Soon!
									</Typography>
								</Divider>
								<StyledButton
									fullWidth
									variant="outlined"
									disabled
									startIcon={<Google />}
								>
									Sign in with Google
								</StyledButton>
								<StyledButton
									fullWidth
									variant="outlined"
									disabled
									startIcon={<GitHub />}
								>
									Sign in with GitHub
								</StyledButton>
								{message && (
									<Typography color="error" align="center" sx={{ mt: 2 }}>
										{message}
									</Typography>
								)}
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</>
	);
};

export default Login;
