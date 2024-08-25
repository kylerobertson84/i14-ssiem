
const API_BASE_URL = process.env.REACT_APP_API_URL 

const API_ENDPOINTS = {
    user: `${API_BASE_URL}/accounts/user`,
    logCount: `${API_BASE_URL}/v1/bronze-events/count/`,
    routerLogCount: `${API_BASE_URL}/v1/router-data/router_log_count/`
    // Add more endpoints here as needed
  };

  export default API_ENDPOINTS;