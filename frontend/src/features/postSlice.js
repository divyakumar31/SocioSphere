import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    addPosts: (state, action) => {
      state.post = action.payload;
    },
    removePosts: (state, _) => {
      state.post = [];
    },
    addPost: (state, action) => {
      state.post = [action.payload, ...state?.post];
    },
  },
});

export const { addPosts, removePosts, addPost } = postSlice.actions;
export default postSlice.reducer;
