import { setMessages } from "@/features/chatSlice";
import { getSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRealTimeMessages = () => {
  const { messages, selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const socketio = getSocket();
  useEffect(() => {
    socketio?.on("message", (data) => {
      if (selectedChat._id === data.sender) {
        dispatch(setMessages([...messages, data]));
      }
    });
    return () => {
      socketio?.off("message");
    };
  }, [messages]);
};
