import express from "express";
import { ping } from "./endpoints/ping";
import morgan from "morgan";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/ping", ping);

app.post("/auth/:id", (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
});

export default app;
