import express from "express";
import morgan from "morgan";
import { riotClientBuild } from "@/middleware/riotClientBuild";
import { cookieProcessor } from "@/middleware/cookieProcessor";
import mfa from "@/endpoints/auth/mfa";
import authorize from "@/endpoints/auth/authorize";
import ping from "@/endpoints/ping";

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(riotClientBuild());
app.use(cookieProcessor());

app.get("/ping", ping);
app.post("/authorize", authorize);
app.put("/mfa", mfa);

export default app;
