import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});

// API functions for different actions

// USER APIs
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

const getSuggestedUsersApi = () => {
  return apiClient.get("/user/suggest");
};

const getUserProfileApi = (username) => {
  return apiClient.get(`/user/${username}`);
};

const followUnfollowApi = (profileUserId) => {
  return apiClient.post(`/user/follow-unfollow/${profileUserId}`, {});
};

const searchUserApi = (query) => {
  return apiClient.get(`/user/search?query=${query}`);
};

// POST APIs
const addPostApi = (data, postImage) => {
  const formData = new FormData();
  formData.append("postImage", postImage);
  formData.append("caption", data);

  return apiClient.post("/post/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getAllPostsApi = () => {
  return apiClient.get("/post");
};

const getSinglePostApi = (postId) => {
  return apiClient.get(`/post/${postId}`);
};

const likeDislikePostApi = (liked, postId) => {
  return apiClient.post(`/post/${liked}/${postId}`, {});
};

const deletePostApi = (postId) => {
  return apiClient.delete(`/post/${postId}`);
};

const savePostApi = (postId) => {
  return apiClient.post(`/post/save/${postId}`, {});
};

// COMMENT APIs
const addCommentApi = (userComment, postId) => {
  return apiClient.post(`/comment/add/${postId}`, { text: userComment });
};

const deleteCommentApi = (commentId) => {
  return apiClient.delete(`/comment/delete/${commentId}`);
};

// Chat APIs
const getMessagesApi = (receiverId) => {
  return apiClient.get(`/message/all/${receiverId}`);
};

const sendMessageApi = (receiverId, data) => {
  return apiClient.post(`/message/send/${receiverId}`, { text: data.trim() });
};

export {
  addCommentApi,
  addPostApi,
  deleteCommentApi,
  deletePostApi,
  followUnfollowApi,
  getAllPostsApi,
  getMessagesApi,
  getSinglePostApi,
  getSuggestedUsersApi,
  getUserProfileApi,
  likeDislikePostApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  savePostApi,
  searchUserApi,
  sendMessageApi,
  updateUserApi,
};
