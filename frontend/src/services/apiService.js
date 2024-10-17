import apiRequest from "./apiRequest";
import API_ENDPOINTS from "./apiConfig";

// dashboard API services

export const fetchUser = () => {
	return apiRequest(API_ENDPOINTS.auth.user);
};

export const fetchLogCount = () => {
	return apiRequest(API_ENDPOINTS.logs.count.computer);
};

export const fetchRouterLogCount = () => {
	return apiRequest(API_ENDPOINTS.logs.count.router);
};

export const fetchLogPercentages = () => {
	return apiRequest(API_ENDPOINTS.logs.percentages);
};

export const fetchLogsPerHour = () => {
	return apiRequest(API_ENDPOINTS.logs.perHour);
};

export const fetchEventsToday = () => {
	return apiRequest(API_ENDPOINTS.logs.eventsToday);
};

export const fetchLatestAlerts = () => {
	return apiRequest(API_ENDPOINTS.alerts.latest);
};

export const fetchHostnameCount = () => {
	return apiRequest(API_ENDPOINTS.logs.hostname_count);
};

export const fetchInvestigationsCount = () => {
	return apiRequest(API_ENDPOINTS.investigate.count);
};

// API services for logs
export const fetchComputerLogs = (searchParams, page = 1, pageSize = 10) => {
	const params = new URLSearchParams({
		query: searchParams.query,
		page,
		page_size: pageSize,
		start_time: searchParams.startTime
			? searchParams.startTime.toISOString()
			: "",
		end_time: searchParams.endTime ? searchParams.endTime.toISOString() : "",
	});
	return apiRequest(`${API_ENDPOINTS.logs.computer}?${params}`);
};

export const fetchRouterLogs = (searchParams, page = 1, pageSize = 10) => {
	const params = new URLSearchParams({
		query: searchParams.query,
		page,
		page_size: pageSize,
		start_time: searchParams.startTime
			? searchParams.startTime.toISOString()
			: "",
		end_time: searchParams.endTime ? searchParams.endTime.toISOString() : "",
	});
	return apiRequest(`${API_ENDPOINTS.logs.router}?${params}`);
};

export const fetchRelatedLogs = async (alert) => {
	try {
		// Ensures alert and event have the necessary fields
		const response = await apiRequest('/api/v1/logs/bronze-events/', 'GET', null, {
			params: {
				query: alert.hostname || alert.event_id || alert.message,
				start_time: alert.created_at,
				event_type: alert.event_type,
			},
		});

		// Assuming the response contains the logs data
		return response.data;
	} catch (error) {
		console.error('Error fetching related logs:', error);
		return [];
	}
};

export const exportPDF = (logType, searchParams) => {
	const params = new URLSearchParams({
		query: searchParams.query,
		start_time: searchParams.startTime
			? searchParams.startTime.toISOString()
			: "",
		end_time: searchParams.endTime ? searchParams.endTime.toISOString() : "",
	});
	let endpoint;
	if (logType === "computer") {
		endpoint = `${API_ENDPOINTS.logs.computer}export_pdf`;
	} else if (logType === "router") {
		endpoint = `${API_ENDPOINTS.logs.router}export_pdf`;
	}
	return apiRequest(`${endpoint}?${params}`, "GET", null, {
		responseType: "blob",
	});
};

// API services investigations page
export const fetchInvestigation = (id) => {
	return apiRequest(`${API_ENDPOINTS.investigate.base}${id}/`);
};

export const fetchInvestigations = () => {
	return apiRequest(API_ENDPOINTS.investigate.base);
};

// API services for creating a user

export const createUser = (userData) => {
	return apiRequest(API_ENDPOINTS.auth.createUser, "POST", userData);
};

export const fetchAlerts = (
	page = 1,
	pageSize = 10,
	search = "",
	severity = "",
	orderBy = "created_at",
	order = "desc"
) => {
	const params = new URLSearchParams({
		page,
		page_size: pageSize,
		search,
		severity,
		ordering: order === "desc" ? `-${orderBy}` : orderBy,
	});
	return apiRequest(`${API_ENDPOINTS.alerts.base}?${params}`);
};

// Assuming `alertId` is defined and has a valid value
export const updateAlert = (alertId, data) => {
	return apiRequest(`${API_ENDPOINTS.alerts.base}${alertId}/`, "PATCH", data);
};

// New API service for assigning alerts
export const assignAlert = (alertId, data) => {
	return apiRequest(API_ENDPOINTS.alerts.assign(alertId), "POST", data);
};

// API services for rules
export const fetchRules = () => {
	return apiRequest(API_ENDPOINTS.rules.base);
};

// API services for reports
export const fetchReports = (
	page = 1,
	pageSize = 10,
	search = "",
	type = "",
	status = "",
	lastUpdate = "",
	orderBy = "updated_at",
	order = "desc"
) => {
	const params = new URLSearchParams({
		page,
		page_size: pageSize,
		search,
		type,
		status,
		last_update: lastUpdate,
		ordering: order === "desc" ? `-${orderBy}` : orderBy,
	});

	// Remove empty params
	Array.from(params.entries()).forEach(([key, value]) => {
		if (!value) params.delete(key);
	});

	return apiRequest(`${API_ENDPOINTS.reports.base}?${params}`)
		.then((response) => {
			return {
				results: response.results || [],
				count: response.count || 0,
				next: response.next,
				previous: response.previous,
			};
		})
		.catch((error) => {
			console.error("Error fetching reports:", error);
			return { results: [], count: 0, next: null, previous: null };
		});
};

export const createReport = (reportData) => {
	return apiRequest(API_ENDPOINTS.reports.base, "POST", reportData);
};

export const updateReport = (reportId, data) => {
	return apiRequest(`${API_ENDPOINTS.reports.base}${reportId}/`, "PATCH", data);
};

export const generateReportPDF = (reportId) => {
	return apiRequest(
		`${API_ENDPOINTS.reports.base}${reportId}/generate_pdf/`,
		"GET",
		null,
		{ responseType: "blob" }
	)
		.then((response) => {
			const file = new Blob([response], { type: "application/pdf" });
			const fileURL = URL.createObjectURL(file);
			const link = document.createElement("a");
			link.href = fileURL;
			link.download = `incident_report_${reportId}.pdf`;
			link.click();
			return fileURL; // Return the fileURL in case it's needed
		})
		.catch((error) => {
			console.error("Error downloading PDF:", error);
			throw error; // Re-throw the error to be caught in the component
		});
};

export const deleteReport = (reportId) => {
	return apiRequest(
		`${API_ENDPOINTS.reports.base}${reportId}/delete_report/`,
		"DELETE"
	);
};

// API service for updating the investigation status

export const updateInvestigationStatus = (id, data) => {
	const url = `${API_ENDPOINTS.investigate.base}${id}/`;
	return apiRequest(url, "PATCH", data); // Specify PATCH method
};

// ADMIN PAGE
export const fetchUsers = (page = 1, pageSize = 10) => {
	const params = new URLSearchParams({
		page,
		page_size: pageSize,
	});
	return apiRequest(`${API_ENDPOINTS.auth.users}?${params}`);
};

// Function to fetch a single user by ID
export const fetchUserById = (userId) => {
	return apiRequest(`${API_ENDPOINTS.auth.users}${userId}/`);
};
// New function to update a user
export const updateUser = (userId, userData) => {
	return apiRequest(`${API_ENDPOINTS.auth.users}${userId}/`, "PATCH", userData);
};

// New function to delete a user
export const deleteUser = (userId) => {
	console.log('deleting user with ID', userId); //debug log
	return apiRequest(`${API_ENDPOINTS.auth.users}${userId}/`, "DELETE");
};

// New function to fetch roles
export const fetchRoles = () => {
	return apiRequest(API_ENDPOINTS.auth.roles);
};

export const fetchOpenInvestigations = () => {
	return apiRequest(API_ENDPOINTS.investigate.openInvestigations);
};

export const updateInvestigation = (id, data) => {
	return apiRequest(`${API_ENDPOINTS.investigate.base}${id}/`, "PATCH", data);
};

export const fetchAssignedAlerts = (page = 1, pageSize = 10) => {
    const params = new URLSearchParams({
        page,
        page_size: pageSize,
    });
    return apiRequest(`${API_ENDPOINTS.investigate.assignedAlerts}?${params}`);
};

