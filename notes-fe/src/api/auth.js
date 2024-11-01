import axios from "axios";

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL_API_URL;

// Axios instance for requests
const api = axios.create({
  baseURL: AUTH_API_URL,
});

// Refresh tokens and retry original request
const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token available");

  const response = await axios.post(`${AUTH_API_URL}token/refresh/`, {
    refresh,
  });

  const { access } = response.data;
  localStorage.setItem("authToken", access);
  return access;
};

// Request interceptor to attach access token to requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Optionally: handle logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // redirect to login page
      }
    }
    return Promise.reject(error);
  },
);

// Helper function to set tokens
const setTokens = (access, refresh) => {
  localStorage.setItem("authToken", access);
  localStorage.setItem("refreshToken", refresh);
};

// Register user
export const registerUser = async (userData) => {
  const response = await api.post(`register/`, userData);
  setTokens(response.data.access, response.data.refresh);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post(`login/`, credentials);
  setTokens(response.data.access, response.data.refresh);
  return response.data;
};

// Logout user (clearing tokens)
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");

  // Optionally, trigger a storage event to notify other parts of the app
  window.dispatchEvent(new Event("storage"));

  // Redirect to login page
  window.location.href = "/login";
};

export default api;
