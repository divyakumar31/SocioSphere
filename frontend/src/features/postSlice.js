import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: [],
  currentPost: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addAllPosts: (state, action) => {
      state.post = action.payload;
    },
    removePosts: (state, _) => {
      state.post = [];
      state.currentPost = null;
    },
    addPost: (state, action) => {
      // state.post = [action.payload, ...state?.post];
      state.post.unshift(action.payload);
    },
    addComment: (state, action) => {
      const postToComment = state.post.find(
        (p) => p._id === action.payload.postId
      );
      if (postToComment) {
        postToComment.comments.unshift(action.payload.comment);
      }
    },
    setComments: (state, action) => {
      const postToComment = state.post.find(
        (p) => p._id === action.payload.postId
      );
      if (postToComment) {
        postToComment.comments = action.payload.comments;
      }
    },
    deletePost: (state, action) => {
      const index = state.post.findIndex((p) => p._id === action.payload);
      if (index !== -1) {
        state.post.splice(index, 1);
      }
    },
    likePost: (state, action) => {
      const postToLike = state.post.find(
        (p) => p._id === action.payload.postId
      );
      if (postToLike && !postToLike.likes.includes(action.payload.userId)) {
        postToLike.likes.unshift(action.payload.userId); // Add the like to the beginning
      }
    },
    dislikePost: (state, action) => {
      const postToDislike = state.post.find(
        (p) => p._id === action.payload.postId
      );
      if (postToDislike) {
        postToDislike.likes = postToDislike.likes.filter(
          (like) => like !== action.payload.userId
        );
      }
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
  },
});

export const {
  addAllPosts,
  setComments,
  removePosts,
  addPost,
  addComment,
  deletePost,
  likePost,
  dislikePost,
  setCurrentPost,
} = postSlice.actions;
export default postSlice.reducer;
