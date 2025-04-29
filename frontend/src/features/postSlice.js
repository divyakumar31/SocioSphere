import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: [],
  currentPost: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // Add Post Directly form the payload
    addPosts: (state, action) => {
      state.post = action.payload;
    },

    // Remove posts from the store
    removePosts: (state, _) => {
      state.post = [];
      state.currentPost = null;
    },

    // PostId and updated comments
    setComments: (state, action) => {
      const postToComment = state.post.find(
        (p) => p._id === action.payload.postId
      );
      if (postToComment) {
        postToComment.comments = action.payload.comments;
      }
    },
    // Delete Post from the store
    deletePost: (state, action) => {
      const index = state.post.findIndex((p) => p._id === action.payload);
      if (index !== -1) {
        state.post.splice(index, 1);
      }
    },

    // Like post
    likePost: (state, action) => {
      state.post = state.post.map((p) =>
        p._id === action.payload.postId &&
        !p.likes.includes(action.payload.userId)
          ? { ...p, likes: [action.payload.userId, ...p.likes] }
          : p
      );
    },
    dislikePost: (state, action) => {
      state.post = state.post.map((p) =>
        p._id === action.payload.postId &&
        p.likes.includes(action.payload.userId)
          ? {
              ...p,
              likes: p.likes.filter((like) => like !== action.payload.userId),
            }
          : p
      );
    },

    // SET Current post directly from the payload
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
});

export const {
  setComments,
  removePosts,
  addPosts,
  addComment,
  deletePost,
  likePost,
  dislikePost,
  setCurrentPost,
} = postSlice.actions;
export default postSlice.reducer;
