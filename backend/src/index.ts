import https from "https";
import { config } from "dotenv";
import app from "./app";
import fs from "fs";

config();

const PORT = process.env.PORT || "3000";

const server = https.createServer(
  {
    key: fs.readFileSync("server.key", "utf8"),
    cert: fs.readFileSync("server.crt", "utf8"),
    passphrase: process.env.SSL_PASSPHRASE,
  },
  app
);
server.listen(PORT, () => console.log("listening on port " + PORT));

export default server;
