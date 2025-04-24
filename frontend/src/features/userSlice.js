import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUser: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Add User directly from payload
    addUser: (state, action) => {
      state.user = action.payload;
    },
    // Remove user from store
    removeUser: (state, _) => {
      state.user = null;
      state.suggestedUser = [];
    },
    // Add Suggested user from payload directly
    addSuggestedUsers: (state, action) => {
      state.suggestedUser = action.payload;
    },
  },
});

export const { addUser, removeUser, addSuggestedUsers } = userSlice.actions;
export default userSlice.reducer;
