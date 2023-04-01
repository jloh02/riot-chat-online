import { Express } from "express";

export function createRestApi(app: Express) {
  app.get("/", (req, res) => res.sendStatus(404));

  app.get("/ping", (req, res) => res.send("pong"));

  app.get("/test", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  return app;
}
