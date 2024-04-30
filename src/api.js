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
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 2*60*1000, 
    withCredentials: true,
});


api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error(`API Error: ${error.response.status} - ${error.response.data}`);
        } else if (error.request) {
            console.error('API Error: No response received');
        } else {
            console.error(`API Error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

export default api;
