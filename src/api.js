//react-project/src/api.js
import axios from 'axios';

export const fetchLearnerSessionData = async () => {
    try {
        const response = await api.get('/fetch-learner-session-data/');
        return response.data;
    } catch (error) {
        console.error('Error fetching session data:', error);
        return null;
    }
};

export const fetchEducatorSessionData = async () => {
    try {
        const response = await api.get('/fetch-educator-session-data/');
        return response.data;
    } catch (error) {
        console.error('Error fetching session data:', error);
        return null;
    }
};

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Updated base URL with /api for routes
    timeout: 2*60*1000, // 10-second timeout for requests
    withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Modify request config here if needed
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        // Transform response data here if needed
        return response;
    },
    (error) => {
        // Handle response errors
        if (error.response) {
            // Server responded with a status other than 2xx
            console.error(`API Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            // No response received
            console.error('API Error: No response received');
        } else {
            // Error setting up request
            console.error(`API Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default api;
