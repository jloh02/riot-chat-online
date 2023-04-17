import express from "express";
import http from "http";
import { config } from "dotenv";
import bodyParser from "body-parser";

const PORT = process.env.PORT || "3000";

config();

export default function startApp(done?: () => any) {
  const app = express();
  const server = http.createServer(app);

  app.get("/", (req, res) => res.sendStatus(404));

  app.get("/ping", (req, res) => res.send("pong"));

  app.post("/auth/:id", (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
  });

  server.listen(PORT, () => {
    console.log("listening on port " + PORT);
    if (done) done();
  });
  return server;
}

startApp();
