import express from "express";
import http from "http";
import { config } from "dotenv";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

config();

const io = new Server();
const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("user connected");
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
