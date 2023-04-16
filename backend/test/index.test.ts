import { Server } from "http";
import request from "supertest";
import startApp from "../src";

describe("API endpoints", () => {
  let server: Server;

  beforeEach((done) => {
    server = startApp(done);
  });

  afterEach((done) => {
    server.close(done);
  });

  it("/ should return 404", async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(404);
  });

  it("/ping should return pong", async () => {
    const response = await request(server).get("/ping");
    expect(response.status).toBe(200);
    expect(response.text).toBe("pong");
  });
});
