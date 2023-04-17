import express from "express";
import { ping } from "./endpoints/ping";
import morgan from "morgan";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get("/ping", ping);

export default app;
