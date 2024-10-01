import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { CircularProgress } from "@mui/material";

const PrivateRoute = ({ roles, children }) => {
	const { user, loading, hasRole } = useAuth();
	const shouldBypassAuth = process.env.REACT_APP_BYPASS_AUTH === "false";

	if (loading) {
		return <CircularProgress />;
	}

	if (shouldBypassAuth) {
		return children || <Outlet />;
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	if (roles && !hasRole(roles)) {
		return <Navigate to="/dashboard" />;
	}

	return children || <Outlet />;
};

export default PrivateRoute;
