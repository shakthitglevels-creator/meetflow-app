// src/config/socket.ts

import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import { socketAuthMiddleware } from "../socket/middleware/socket-auth.middleware";
import { registerMeetingHandlers } from "../socket/handlers/meeting.handler";

export const initializeSocket = (
    httpServer: HttpServer
) => {

    const io = new SocketServer(
        httpServer,
        {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        }
    );

    io.use(socketAuthMiddleware);

    // Runs once for every connected client
    io.on("connection", (socket) => {
  const authenticatedUser = socket.data.user;

  console.log(
    `Authenticated socket connected: ${socket.id}`,
    authenticatedUser
  );

  registerMeetingHandlers(io, socket)

  socket.on("disconnect", (reason) => {

    const user = socket.data.user;
    console.log(
      `Authenticated socket disconnected: ${socket.id}`,
      reason
    );
    console.log(socket.rooms);
  });
});
    return io; 
}