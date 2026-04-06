import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
});

// Add email to requests
API.interceptors.request.use((config) => {
  const email = localStorage.getItem('userEmail');
  if (email) {
    config.headers.email = email;
  }
  return config;
});

export default API;
