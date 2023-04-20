import express from "express";

function ping(req: express.Request, res: express.Response) {
  res.status(200).send("pong");
}

export default [ping];
