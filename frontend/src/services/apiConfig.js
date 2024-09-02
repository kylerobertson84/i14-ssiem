
const API_BASE_URL = process.env.REACT_APP_API_URL 

const API_ENDPOINTS = {
    user: `${API_BASE_URL}users/me/`,
    logCount: `${API_BASE_URL}v1/bronze-events/count/`,
    routerLogCount: `${API_BASE_URL}v1/router-data/router_log_count/`,
    log_percentages: `${API_BASE_URL}v1/log-percentage/log_percentages/`,
    logs_per_hour: `${API_BASE_URL}v1/logs-aggregation/logs_per_hour/`,
    events_today: `${API_BASE_URL}v1/events-today/events_today/`,
    
    
    alerts: `${API_BASE_URL}v1/alerts`,
    
    // Add more endpoints here as needed
  };

  export default API_ENDPOINTS;