import config from "./config";
import app from "./app";
import fs from "fs";
import https from "https";

const server = https.createServer(
  {
    key: fs.readFileSync("server.key", "utf8"),
    cert: fs.readFileSync("server.crt", "utf8"),
    passphrase: config.SSL_PASSPHRASE,
  },
  app
);
server.listen(config.PORT, () =>
  console.log("listening on port " + config.PORT)
);

export default server;
