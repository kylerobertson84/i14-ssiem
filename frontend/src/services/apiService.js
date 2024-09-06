import apiRequest from './apiRequest';
import API_ENDPOINTS from './apiConfig';

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
  return apiRequest(API_ENDPOINTS.logs.perHour)
};

export const fetchEventsToday = () => {
  return apiRequest(API_ENDPOINTS.logs.eventsToday)
};

export const fetchLatestAlerts = () => {
  return apiRequest(API_ENDPOINTS.alerts.latest);
}

export const fetchHostnameCount = () => {
  return apiRequest(API_ENDPOINTS.logs.hostname_count);
}

export const fetchInvestigationsCount = () => {
  return apiRequest(API_ENDPOINTS.investigate.count)
}

// API services for alerts
export const fetchAlerts = (page = 1, pageSize = 10, search = '', severity = '', orderBy = 'created_at', order = 'desc') => {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
    search,
    severity,
    ordering: order === 'desc' ? `-${orderBy}` : orderBy
  });
  return apiRequest(`${API_ENDPOINTS.alerts.base}?${params}`);
};

export const updateAlert = (alertId, data) => {
  return apiRequest(`${API_ENDPOINTS.alerts.base}/${alertId}/`, 'PATCH', data);
};

// API services for logs
export const fetchComputerLogs = (searchParams, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    query: searchParams.query,
    page,
    page_size: pageSize,
    start_time: searchParams.startTime ? searchParams.startTime.toISOString() : '',
    end_time: searchParams.endTime ? searchParams.endTime.toISOString() : '',
  });
  return apiRequest(`${API_ENDPOINTS.logs.computer}?${params}`);
};

export const fetchRouterLogs = (searchParams, page = 1, pageSize = 10) => {
  const params = new URLSearchParams({
    query: searchParams.query,
    page,
    page_size: pageSize,
    start_time: searchParams.startTime ? searchParams.startTime.toISOString() : '',
    end_time: searchParams.endTime ? searchParams.endTime.toISOString() : '',
  });
  return apiRequest(`${API_ENDPOINTS.logs.router}?${params}`);
};

export const exportPDF = (logType, searchParams) => {
  const params = new URLSearchParams({
    query: searchParams.query,
    start_time: searchParams.startTime ? searchParams.startTime.toISOString() : '',
    end_time: searchParams.endTime ? searchParams.endTime.toISOString() : '',
  });
  let endpoint;
  if (logType === 'computer') {
    endpoint = `${API_ENDPOINTS.logs.computer}export_pdf`;
  } else if (logType === 'router') {
    endpoint = `${API_ENDPOINTS.logs.router}export_pdf`;
  }
  return apiRequest(`${endpoint}?${params}`, 'GET', null, { responseType: 'blob' });
};

// API services investigations page

export const fetchInvestigations = () => {
  return apiRequest(API_ENDPOINTS.investigate.base)
}