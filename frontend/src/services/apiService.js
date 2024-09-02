
// services/apiService.js

import apiRequest from './apiRequest';
import API_ENDPOINTS from './apiConfig';

// dashboard API services

export const fetchUser = () => {
  return apiRequest(API_ENDPOINTS.user);
};

export const fetchLogCount = () => {
  return apiRequest(API_ENDPOINTS.logCount);
};

export const fetchRouterLogCount = () => {
  return apiRequest(API_ENDPOINTS.routerLogCount);
};

export const fetchLogPercentages = () => {
    return apiRequest(API_ENDPOINTS.log_percentages);
  };

export const fetchLogsPerHour = () => {
  return apiRequest(API_ENDPOINTS.logs_per_hour)
};

export const fetchEventsToday = () => {
  return apiRequest(API_ENDPOINTS.events_today)
};

export const fetchAlerts = (page = 1, pageSize = 10, search = '', severity = '', orderBy = 'created_at', order = 'desc') => {
  const params = new URLSearchParams({
    page,
    page_size: pageSize,
    search,
    severity,
    ordering: order === 'desc' ? `-${orderBy}` : orderBy
  });
  return apiRequest(`${API_ENDPOINTS.alerts}?${params}`);
};

export const updateAlert = (alertId, data) => {
  return apiRequest(`${API_ENDPOINTS.alerts}/${alertId}/`, 'PATCH', data);
};