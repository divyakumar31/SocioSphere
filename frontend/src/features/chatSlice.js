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
    // Select Chat directly from payload
    setSelectedChat: (state, action) => {
      // state.selectedChat = state.chatList.find((chat) =>
      //   chat.participants.find((p) => p._id === action.payload)
      // );
      // state.selectedChat = state.chatList.find(
      //   (chat) => chat._id === action.payload
      // );
      state.selectedChat = action.payload;
    },

    // setLastMessage: (state, action) => {
    //   state.chatList = state.chatList.map((chat) => {
    //     if (chat._id === action.payload.chatId) {
    //       chat.lastMessage = action.payload.message;
    //     }
    //     return chat;
    //   });
    // },

    // Set Chat List from the payload
    setChatList: (state, action) => {
      state.chatList = action.payload;
    },

    // Set OnlineUsers form the payload
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // Set Messages from the payload
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    // Remove Chat from the store
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
