import Joi from "joi";
import { axiosFetch } from "@/globals";
import { validateBody } from "@/middleware/validator";
import { HttpStatusCode } from "axios";
import express from "express";

const COOKIE_REQUEST_BODY = {
  client_id: "play-valorant-web-prod",
  nonce: 1,
  redirect_uri: "https://playvalorant.com/opt_in",
  response_type: "token id_token",
  scope: "account openid",
};

function extractSessionCookie(cookies: string[] | undefined): string[] {
  if (!cookies) return [];
  return cookies.filter((v) => /^(tdid|asid|ssid|clid)=/.test(v));
}

async function authorize(req: express.Request, res: express.Response) {
  let sessionCookie = extractSessionCookie(req.cookies);

  // If user has no cookies to use, request for cookies
  if (!sessionCookie.length) {
    const cookieRes = await axiosFetch.post(
      "https://auth.riotgames.com/api/v1/authorization",
      COOKIE_REQUEST_BODY
    );
    if (cookieRes.status !== HttpStatusCode.Ok) {
      res
        .status(cookieRes.status)
        .send({ success: false, message: cookieRes.data() });
      return;
    }

    sessionCookie = extractSessionCookie(cookieRes.headers["set-cookie"]);
    if (!sessionCookie.length) {
      res.status(HttpStatusCode.BadGateway).send({
        success: false,
        message: "Invalid cookies returned: " + cookieRes.headers["set-cookie"],
      });
    }
  }

  const { username, password } = req.body;
  const authRes = await axiosFetch.put(
    "https://auth.riotgames.com/api/v1/authorization",
    {
      type: "auth",
      username,
      password,
      remember: true,
      language: "en_US",
    },
    {
      headers: {
        Cookie: sessionCookie,
      },
    }
  );
  res.status(authRes.status).send(authRes.data);
}

export default [
  validateBody(
    Joi.object({
      username: Joi.string().alphanum().min(3).max(16).required(),
      password: Joi.string().required(),
    })
  ),
  authorize,
];
