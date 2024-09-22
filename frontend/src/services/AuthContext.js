import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const user = AuthService.getCurrentUser();
		if (user) {
			setUser(user);
		}
	}, []);

	const value = {
		user,
		setUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	return useContext(AuthContext);
};
