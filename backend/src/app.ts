import express from "express";
import morgan from "morgan";
import authorize from "@/endpoints/auth/authorize";
import ping from "@/endpoints/ping";
import { riotClientBuild } from "./middleware/riotClientBuild";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(riotClientBuild());

app.get("/ping", ping);
app.post("/authorize", authorize);

export default app;
