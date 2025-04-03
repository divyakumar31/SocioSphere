import { io } from "../app.js";

const userSocketMap = {};

const getClientSocketId = (userId) => userSocketMap[userId];

const getSocketConnection = () => {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} connected using socket id ${socket.id}`);
    }

    io.emit("onlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      if (userId) {
        console.log(`User ${userId} disconnected using socket id ${socket.id}`);
        delete userSocketMap[userId];
      }

      io.emit("onlineUsers", Object.keys(userSocketMap));
    });
  });
};

export { getSocketConnection, getClientSocketId };
