import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  // you can add other defaults here if needed
});

// Add a request interceptor to include the authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    // First try to get token from localStorage
    let token = localStorage.getItem('token');
    
    // If no token found, try to get it from userInfo
    if (!token) {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          token = parsedUserInfo.token;
        } catch (e) {
          console.error('Error parsing userInfo for token:', e);
        }
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
