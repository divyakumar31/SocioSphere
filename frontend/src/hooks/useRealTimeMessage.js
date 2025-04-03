import { setMessages } from "@/features/chatSlice";
import { getSocket } from "@/lib/socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRealTimeMessages = () => {
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const socketio = getSocket();
  useEffect(() => {
    socketio?.on("message", (data) => {
      dispatch(setMessages([...messages, data]));
    });
    return () => {
      socketio?.off("message");
    };
  }, [messages]);
};
