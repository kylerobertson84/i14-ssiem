
import axiosInstance from './axiosInstance';

const handleApiError = (error) => {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API response error:', error.response.status, error.response.data);
      // Handle specific status codes (e.g., 401 Unauthorized)
    } else if (error.request) {
      // Request was made but no response received
      console.error('API request error:', error.request);
    } else {
      // Something else caused the error
      console.error('API error:', error.message);
    }
    // Optionally show a user-friendly message or redirect
  };
  

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      url: endpoint,
      data,
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default apiRequest;