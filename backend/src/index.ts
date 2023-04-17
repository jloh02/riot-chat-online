import http from "http";
import { config } from "dotenv";
import app from "./app";

config();

const PORT = process.env.PORT || "3000";

const server = http.createServer(app);
server.listen(PORT, () => console.log("listening on port " + PORT));

export default server;
