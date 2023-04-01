import http from "http";
import { Server } from "socket.io";

export function createWebSocket(server: http.Server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("user connected");
  });

  return io;
}
