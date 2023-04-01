import { Server } from "http";
import request from "supertest";
import { createRestApi } from "../src/restApi";
import { startWebServer } from "../src/webserver";

const PORT = 1111;

describe("API endpoints", () => {
  let server: Server;

  beforeEach((done) => {
    server = startWebServer(PORT, (app) => createRestApi(app), done);
  });

  afterEach((done) => {
    server.close(done);
  });

  it("should return 404", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(404);
  });

  it("should return pong", async () => {
    const response = await request(server).get("/ping");
    expect(response.status).toBe(200);
    expect(response.text).toBe("pong");
  });
});
