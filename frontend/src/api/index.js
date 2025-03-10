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

const updateUserApi = (data, profilePicture) => {
  const formData = new FormData();
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }
  formData.append("bio", data.bio?.trim());
  formData.append("name", data.name?.trim());
  formData.append("email", data.email?.trim());
  formData.append("gender", data.gender);
  formData.append("profileType", data.profileType);

  return apiClient.post("/user/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const addPostApi = (data, postImage) => {
  const formData = new FormData();
  formData.append("postImage", postImage);
  formData.append("caption", data);

  return apiClient.post("/post/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export {
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  updateUserApi,
  addPostApi,
};
