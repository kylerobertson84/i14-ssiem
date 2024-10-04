import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import { fetchUser } from "../services/apiService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const storedUser = AuthService.getCurrentUser();
				if (storedUser) {
					// Fetch the latest user data from the API
					const userData = await fetchUser();
					setUser(userData);
				}
			} catch (error) {
				console.error("Failed to load user:", error);
				// If there's an error (e.g., token expired), log out the user
				AuthService.logout();
			} finally {
				setLoading(false);
			}
		};

		loadUser();
	}, []);

	const login = async (email, password) => {
		const userData = await AuthService.login(email, password);
		setUser(userData);
		return userData;
	};

	const logout = () => {
		AuthService.logout();
		setUser(null);
	};

	const hasRole = (roles) => {
		if (!user || !user.role) return false;
		return Array.isArray(roles)
			? roles.includes(user.role.name)
			: user.role.name === roles;
	};

	const value = {
		user,
		setUser,
		loading,
		login,
		logout,
		hasRole,
		isAdmin: () => hasRole("ADMIN"),
		isAnalyst: () => hasRole("ANALYST"),
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
