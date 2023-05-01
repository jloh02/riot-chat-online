import Joi from "joi";
import { axiosFetch, RIOT_AUTH_URL } from "@/globals";
import { validateBody } from "@/middleware/validator";
import { HttpStatusCode } from "axios";
import express from "express";
import { CookieJar } from "tough-cookie";
import {
  convertCookieToLocal,
  parseCookiesIntoJar,
  storeCookies,
} from "@/utils/cookie";

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
  const sessionCookies = extractSessionCookie(req.cookies);
  const cookieJar = new CookieJar();

  // If user has no cookies to use, request for cookies
  if (!sessionCookies.length) {
    const cookieRes = await axiosFetch.post(RIOT_AUTH_URL, COOKIE_REQUEST_BODY);
    if (
      cookieRes.status !== HttpStatusCode.Ok ||
      !cookieRes?.headers["set-cookie"]
    ) {
      res.status(cookieRes.status).send(cookieRes.data);
      return;
    }
    storeCookies(cookieRes, cookieJar, RIOT_AUTH_URL);
  } else {
    parseCookiesIntoJar(req, cookieJar, RIOT_AUTH_URL);
  }

  const { username, password } = req.body;
  const authRes = await axiosFetch.put(
    RIOT_AUTH_URL,
    {
      type: "auth",
      username,
      password,
      remember: true,
      language: "en_US",
    },
    {
      headers: {
        Cookie: cookieJar.getCookieStringSync(RIOT_AUTH_URL),
      },
    }
  );

  storeCookies(authRes, cookieJar, RIOT_AUTH_URL);

  res
    .setHeader(
      "set-cookie",
      convertCookieToLocal(cookieJar.getSetCookieStringsSync(RIOT_AUTH_URL))
    )
    .status(authRes.status)
    .send(authRes.data);
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
