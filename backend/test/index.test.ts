import { config } from "dotenv";
import { Server } from "http";
import request from "supertest";
import app from "../src/app";
import { HttpStatusCode } from "axios";

config();

describe("API endpoints", () => {
  let server: Server;

  beforeEach((done) => {
    server = app.listen(undefined, done);
  });

  afterEach((done) => {
    server.close(done);
  });

  test("GET / should return 404", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(HttpStatusCode.NotFound);
  });

  test("GET /ping should return pong", async () => {
    const response = await request(server).get("/ping");
    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.text).toBe("pong");
  });
});
