
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