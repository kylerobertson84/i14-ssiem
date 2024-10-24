import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Login from "./components/Login";
import Dashboard from "./pages/dashboard";
import Investigations from "./pages/investigations";
import Queries from "./pages/queries";
import Reports from "./pages/reports";
import Alerts from "./pages/alerts";
import Preferences from "./pages/preferences";
import LandingPage from "./pages/LandingPage.js";
import Footer from "./components/Footer";
import Navbar from "./components/NavBar";
import AdminPage from "./pages/admin.js";
import theme from "./Design/Theme.js";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import { AuthProvider } from "./services/AuthContext.js";
import SEO from "./Design/SEO.js";
import OpenInvestigationsNotification from "./components/OpenInvestigationsNotifi.js";

const App = () => (
	<AuthProvider>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SEO />
			<Router>
				<div className="app">
					<Navbar />
					<OpenInvestigationsNotification />
					<Routes>
						<Route path="/" element={<LandingPage />} />
						<Route path="/login" element={<Login />} />
						<Route element={<PrivateRoute />}>
							<Route element={<ProtectedLayout />}>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/investigations" element={<Investigations />} />
								<Route path="/queries" element={<Queries />} />
								<Route path="/reports" element={<Reports />} />
								<Route path="/alerts" element={<Alerts />} />
								<Route path="/preferences" element={<Preferences />} />
								<Route
									path="/admin"
									element={
										<PrivateRoute roles={["ADMIN"]}>
											<AdminPage />
										</PrivateRoute>
									}
								/>
							</Route>
						</Route>
						<Route path="*" element={<Navigate replace to="/" />} />
					</Routes>
					<Footer />
				</div>
			</Router>
		</ThemeProvider>
	</AuthProvider>
);

export default App;
