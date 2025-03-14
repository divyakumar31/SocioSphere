import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUser: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state, _) => {
      state.user = null;
      state.suggestedUser = [];
    },
    addSuggestedUsers: (state, action) => {
      state.suggestedUser = action.payload;
    },
  },
});

export const { addUser, removeUser, addSuggestedUsers } = userSlice.actions;
export default userSlice.reducer;
