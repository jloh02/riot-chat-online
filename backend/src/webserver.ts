import http from "http";
import express from "express";

export function startWebServer(
  port: string | number,
  initializeCallback: (app: express.Express, server: http.Server) => any,
  listeningCallback?: () => any
) {
  const app = express();
  const server = http.createServer(app);

  initializeCallback(app, server);

  server.listen(port, () => {
    console.log("listening on port " + port);
    if (listeningCallback) listeningCallback();
  });

  return server;
}
