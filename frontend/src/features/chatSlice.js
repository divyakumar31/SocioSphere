import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  selectedChat: null,
  onlineUsers: [],
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = state.chatList.filter(
        (chat) => chat._id === action.payload
      )[0];
    },
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    removeChat: (state) => {
      state.selectedChat = null;
      state.chatList = [];
      state.messages = [];
      state.onlineUsers = [];
    },
  },
});

export const {
  setSelectedChat,
  setChatList,
  setOnlineUsers,
  removeChat,
  setMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
