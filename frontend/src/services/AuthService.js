import axios from "axios";
import API_ENDPOINTS from "./apiConfig";

class AuthService {
	login(email, password) {
		return axios
			.post(API_ENDPOINTS.auth.token, {
				email,
				password,
			})
			.then((response) => {
				if (response.data.access) {
					localStorage.setItem("user", JSON.stringify(response.data));
				}
				return response.data;
			});
	}

	logout() {
		localStorage.removeItem("user");
	}

	getCurrentUser() {
		return JSON.parse(localStorage.getItem("user"));
	}

	getToken() {
		const user = this.getCurrentUser();
		return user ? user.access : null;
	}

	refreshToken(refreshToken) {
		return axios
			.post(API_ENDPOINTS.auth.refreshToken, {
				refresh: refreshToken,
			})
			.then((response) => {
				if (response.data.access) {
					let user = JSON.parse(localStorage.getItem("user"));
					user.access = response.data.access;
					localStorage.setItem("user", JSON.stringify(user));
				}
				return response.data;
			});
	}
}

export default new AuthService();
