import { config } from "dotenv";
import { createRestApi } from "./restApi";
import { createWebSocket } from "./socket";
import { startWebServer } from "./webserver";

const PORT = process.env.PORT || "3000";

config();

startWebServer(PORT, (app, server) => {
  createRestApi(app);
  createWebSocket(server);
});
