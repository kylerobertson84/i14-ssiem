import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { useAuth } from "../services/AuthContext";
import {
	Button,
	CssBaseline,
	TextField,
	Box,
	Typography,
	Container,
	Grid,
	Link,
	Checkbox,
	FormControlLabel,
	ThemeProvider,
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
import theme from "../Design/Theme";
import SEO from "../Design/SEO";

const Feature = ({ icon, title, description }) => (
	<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
		{icon}
		<Box sx={{ ml: 2 }}>
			<Typography variant="subtitle1" color="primary">
				{title}
			</Typography>
			<Typography variant="body2">{description}</Typography>
		</Box>
	</Box>
);

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
	const { setUser } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const userData = await AuthService.login(email, password);
			setUser(userData);
			navigate("/dashboard");
		} catch (error) {
			setMessage("Login failed. Please check your credentials.");
		}
	};

	const handlePrefillLogin = () => {
		setEmail("admin@example.com");
		setPassword("admin");
	};

	return (
		<>
			<SEO 
				title="Login" 
				description="Log in to SimpleSIEM - Secure access to your SIEM dashboard"
			/>
	  		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="lg">
				<CssBaseline />
				<Grid
					container
					spacing={4}
					sx={{ height: "100vh", alignItems: "center" }}
				>
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
						<Feature
							icon={<Security sx={{ color: theme.palette.primary.main }} />}
							title="Advanced Threat Detection"
							description="Our SIEM solution effortlessly adapts to your security needs, boosting efficiency in threat identification."
						/>
						<Feature
							icon={<Storage sx={{ color: theme.palette.primary.main }} />}
							title="Robust Log Management"
							description="Experience unmatched durability with our long-term log storage and analysis capabilities."
						/>
						<Feature
							icon={<Dashboard sx={{ color: theme.palette.primary.main }} />}
							title="Intuitive Dashboard"
							description="Integrate our SIEM into your security operations with an easy-to-use and customizable interface."
						/>
						<Feature
							icon={<Psychology sx={{ color: theme.palette.primary.main }} />}
							title="AI-Powered Analytics"
							description="Stay ahead with machine learning features that set new standards in security event correlation and analysis."
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								bgcolor: "background.paper",
								p: 4,
								boxShadow: 3,
							}}
						>
							<Typography component="h1" variant="h5" gutterBottom>
								Sign in
							</Typography>
							<Box
								component="form"
								onSubmit={handleLogin}
								noValidate
								sx={{ mt: 1, width: "100%" }}
							>
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
								<Divider>
									<Typography align="center" sx={{ mt: 2, mb: 1 }}>
										or
									</Typography>
								</Divider>

								<Button
									fullWidth
									variant="outlined"
									startIcon={<Google />}
									sx={{ mb: 1 }}
								>
									Sign in with Google
								</Button>
								<Button fullWidth variant="outlined" startIcon={<GitHub />}>
									Sign in with GitHub
								</Button>

								<Button
									fullWidth
									variant="outlined"
									onClick={handlePrefillLogin}
									sx={{ mt: 2 }}
								>
									Use Demo Account
								</Button>
								{message && (
									<Typography color="error" align="center" sx={{ mt: 2 }}>
										{message}	
									</Typography>
								)}
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</ThemeProvider>
		</>

	);
};

export default Login;
