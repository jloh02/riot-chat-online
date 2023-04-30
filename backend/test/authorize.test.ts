import "@/config";
import { Server } from "http";
import request from "supertest";
import app from "@/app";
import axios, { HttpStatusCode } from "axios";
import { axiosFetch } from "@/globals";

jest.mock("axios");
const axiosMock = jest.mocked(axios);
axiosMock.get.mockResolvedValue({
  status: 200,
  data: {
    data: {
      riotClientBuild: "112233.test.445566-build",
      version: "v-99.8888.0000",
    },
  },
});

jest.mock("@/globals", () => {
  const actual = jest.requireActual("@/globals");
  return {
    axiosFetch: {
      post: jest.fn(),
      put: jest.fn(),
    },
    updateBuildVersions: actual.updateBuildVersions,
  };
});

describe("POST /authorize", () => {
  let server: Server;

  beforeEach((done) => {
    server = app.listen(undefined, done);
  });

  afterEach((done) => {
    server.close(done);
  });

  test("missing username should return 400", async () => {
    const response = await request(server)
      .post("/authorize")
      .send({ password: "nil" });
    expect(response.status).toBe(HttpStatusCode.BadRequest);
  });

  test("missing password should return 400", async () => {
    const response = await request(server)
      .post("/authorize")
      .send({ username: "nil" });
    expect(response.status).toBe(HttpStatusCode.BadRequest);
  });

  test("error in first cookie request should return Riot API's response", async () => {
    const resStatus = HttpStatusCode.Forbidden;
    const resBody = {
      success: false,
      message: "failure",
    };

    jest.spyOn(axiosFetch, "post").mockResolvedValueOnce({
      status: resStatus,
      data: resBody,
    });

    const response = await request(server)
      .post("/authorize")
      .send({ username: "username", password: "password" });

    expect(response.status).toBe(resStatus);
    expect(JSON.parse(response.text)).toMatchObject(resBody);
  });

  test("incorrect credentials should return 200 but with auth_failure", async () => {
    const authFailBody = {
      type: "auth",
      error: "auth_failure",
      country: "sgp",
    };

    jest.spyOn(axiosFetch, "post").mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: {
        success: true,
      },
      headers: {
        "set-cookie": [
          "tdid=validcookie; Expires=Wed, 30 Apr 2025 00:00:00 GMT; Path=/",
          "asid=othervalidcookie; Expires=Wed, 30 Apr 2025 00:00:00 GMT; Path=/",
        ],
      },
    });
    jest.spyOn(axiosFetch, "put").mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: authFailBody,
    });

    const response = await request(server)
      .post("/authorize")
      .send({ username: "username", password: "password" });

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(JSON.parse(response.text)).toMatchObject(authFailBody);
  });

  test("valid credentials should return 2fa request and cookies", async () => {
    const authSuccessBody = {
      type: "multifactor",
      multifactor: {
        email: "abc**@****.com",
        method: "email",
        methods: ["email"],
        multiFactorCodeLength: 6,
        mfaVersion: "v2",
      },
      country: "abc",
      securityProfile: "low",
    };
    const initialAsidCookie =
      "asid=othervalidcookie; Expires=Wed, 30 Apr 2025 00:00:00 GMT; Path=/";
    const newAsidCookie =
      "asid=updatedvalidcookie; Expires=Wed, 30 Apr 2025 00:00:00 GMT; Path=/";

    jest.spyOn(axiosFetch, "post").mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: {
        success: true,
      },
      headers: {
        "set-cookie": [
          "tdid=validcookie;  Expires=Wed, 30 Apr 2025 00:00:00 GMT; Path=/",
          initialAsidCookie,
        ],
      },
    });
    jest.spyOn(axiosFetch, "put").mockResolvedValueOnce({
      status: HttpStatusCode.Ok,
      data: authSuccessBody,
      headers: {
        "set-cookie": [newAsidCookie],
      },
    });

    const response = await request(server)
      .post("/authorize")
      .send({ username: "username", password: "password" });

    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.headers["set-cookie"]).toContain(newAsidCookie);
    expect(response.headers["set-cookie"]).not.toContain(initialAsidCookie);
    expect(JSON.parse(response.text)).toMatchObject(authSuccessBody);
  });
});
