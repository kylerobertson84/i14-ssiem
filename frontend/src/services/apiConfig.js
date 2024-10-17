const API_BASE_URL = process.env.REACT_APP_API_URL; // || 'http://localhost:8000/api';
const API_VERSION = "v1";

const buildUrl = (path, version = API_VERSION) =>
	`${API_BASE_URL}/${version}/${path}`;

const API_ENDPOINTS = {
	// Authentication Related API Endpoints
	auth: {
		user: buildUrl("accounts/users/me/"),
		users: buildUrl("accounts/users/"),
		token: buildUrl("accounts/token/"),
		refreshToken: buildUrl("accounts/token/refresh/"),
		createUser: buildUrl("accounts/users/"),
	},

	//User - Admin

	// Roles Related API Endpoints
	roles: buildUrl("accounts/roles/"),

	employee: {
		create: buildUrl("accounts/employees/"),
	},

	// Alerts Related API Endpoints
	alerts: {
		base: buildUrl("alerts/"),
		latest: buildUrl("alerts/latest_alerts/"),
		assign: (alertId) => buildUrl(`alerts/${alertId}/assign/`),
	},

	// investigations Related API Endpoints
	investigate: {
		base: buildUrl("investigate/"),
		count: buildUrl("investigate/investigation_status_count/"),
		create: buildUrl("investigate/"),
		openInvestigations: buildUrl("investigate/open_investigations/"),
		assignedAlerts: buildUrl("investigate/assigned_alerts/"),
	},

	// Logs Related API Endpoints
	logs: {
		computer: buildUrl("logs/bronze-events/"),
		router: buildUrl("logs/router-data/"),
		count: {
			computer: buildUrl("logs/bronze-events/count/"),
			router: buildUrl("logs/router-data/router_log_count/"),
		},
		percentages: buildUrl("logs/log-percentage/log_percentages/"),
		perHour: buildUrl("logs/logs-aggregation/logs_per_hour/"),
		eventsToday: buildUrl("logs/events-today/events_today/"),
		hostname_count: buildUrl("logs/hostname-count/"),
	},

	// Rules Related API Endpoints
	rules: {
		base: buildUrl("rules/"),
	},
	// Reports Related API Endpoints
	reports: {
		base: buildUrl("reports/incident-reports/"),
		rules: buildUrl("reports/incident-reports/get_rules/"),
	},
};

export default API_ENDPOINTS;
