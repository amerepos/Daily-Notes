import axios from "axios";

const AUTH_API_URL = process.env.REACT_APP_NOTES_API_URL_API_URL;

const api = axios.create({
  baseURL: AUTH_API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/login"; // or use history.push("/login") if in a component
    }
    return Promise.reject(error);
  },
);

const getNotes = async () => {
  const response = await api.get("");
  return response.data;
};

const createNote = async (data) => {
  const response = await api.post("", data);
  return response.data;
};

const updateNote = async (id, data) => {
  const response = await api.put(`${id}/`, data);
  return response.data;
};

const deleteNote = async (id) => {
  const response = await api.delete(`${id}/`);
  return response.data;
};

export { getNotes, createNote, updateNote, deleteNote };
