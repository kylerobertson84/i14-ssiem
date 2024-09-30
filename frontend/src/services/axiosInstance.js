import axios from "axios";
import AuthService from "./AuthService";

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	withCredentials: true,
});

instance.interceptors.request.use(
	(config) => {
		const user = AuthService.getCurrentUser();
		if (user && user.access) {
			config.headers.Authorization = "Bearer " + user.access;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const user = AuthService.getCurrentUser();
			const newTokens = await AuthService.refreshToken(user.refresh);
			axios.defaults.headers.common["Authorization"] =
				"Bearer " + newTokens.access;
			return instance(originalRequest);
		}
		return Promise.reject(error);
	}
);

export default instance;
