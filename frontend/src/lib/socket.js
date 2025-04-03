import { io } from "socket.io-client";

let socketio = null;

const initializeSocket = (userId) => {
  if (!userId) return;
  socketio = io(import.meta.env.VITE_SOCKET_URL, {
    query: { userId },
    transports: ["websocket"],
  });
  socketio.on("connect", () => {
    console.log("Connected to socket:", socketio.id);
  });
  return socketio;
};

const getSocket = () => socketio;

const closeSocket = () => socketio.close();

export { closeSocket, getSocket, initializeSocket };
