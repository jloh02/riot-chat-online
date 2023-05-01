import { RIOT_AUTH_URL } from "@/globals";
import { AxiosResponse, HttpStatusCode } from "axios";
import Joi from "joi";
import { axiosFetch } from "@/globals";
import { validateBody } from "@/middleware/validator";
import express from "express";
import { CookieJar, parse } from "tough-cookie";
import {
  convertCookieToLocal,
  parseCookiesIntoJar,
  storeCookies,
} from "@/utils/cookie";

async function mfa(req: express.Request, res: express.Response) {
  const cookieJar = new CookieJar();

  parseCookiesIntoJar(req, cookieJar, RIOT_AUTH_URL);

  let authRes: AxiosResponse;
  try {
    authRes = await axiosFetch.put(
      RIOT_AUTH_URL,
      {
        type: "multifactor",
        code: req.body.code,
        rememberDevice: true,
      },
      {
        headers: {
          Cookie: cookieJar.getCookieStringSync(RIOT_AUTH_URL),
        },
      }
    );
  } catch (error) {
    if (!error.response) {
      console.error(error.message);
      res.status(HttpStatusCode.InternalServerError);
      return;
    }
    authRes = error.response;
  }

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
      code: Joi.string()
        .regex(/^\d{6}$/)
        .required(),
    })
  ),
  mfa,
];
