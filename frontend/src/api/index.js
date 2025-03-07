import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});

// API functions for different actions

const loginUserApi = (data) => {
  return apiClient.post("/user/login", data);
};

const registerUserApi = (data) => {
  return apiClient.post("/user/register", data);
};

const logoutUserApi = () => {
  return apiClient.post("/user/logout");
};

export { loginUserApi, registerUserApi, logoutUserApi };
