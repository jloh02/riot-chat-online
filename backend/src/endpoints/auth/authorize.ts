import Joi from "joi";
import { axiosFetch } from "@/globals";
import { validateBody } from "@/middleware/validator";
import { HttpStatusCode } from "axios";
import express from "express";
import { CookieJar, parse } from "tough-cookie";

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

const AUTH_URL = "https://auth.riotgames.com/api/v1/authorization";
async function authorize(req: express.Request, res: express.Response) {
  const sessionCookies = extractSessionCookie(req.cookies);
  const cookieJar = new CookieJar();

  // If user has no cookies to use, request for cookies
  if (!sessionCookies.length) {
    const cookieRes = await axiosFetch.post(AUTH_URL, COOKIE_REQUEST_BODY);
    if (
      cookieRes.status !== HttpStatusCode.Ok ||
      !cookieRes?.headers["set-cookie"]
    ) {
      res.status(cookieRes.status).send(cookieRes.data);
      return;
    }

    cookieRes.headers["set-cookie"].forEach((cookie) =>
      cookieJar.setCookieSync(parse(cookie), AUTH_URL)
    );
  }

  const { username, password } = req.body;
  const authRes = await axiosFetch.put(
    AUTH_URL,
    {
      type: "auth",
      username,
      password,
      remember: true,
      language: "en_US",
    },
    {
      headers: {
        Cookie: cookieJar.getCookieStringSync(AUTH_URL),
      },
    }
  );
  if (authRes?.headers?.["set-cookie"])
    authRes.headers["set-cookie"].forEach((cookie) =>
      cookieJar.setCookieSync(parse(cookie), AUTH_URL)
    );

  //Send with updated cookies
  const cookies = cookieJar.getCookiesSync(AUTH_URL);
  res.setHeader(
    "set-cookie",
    cookies.map((cookie) => cookie.toString())
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
