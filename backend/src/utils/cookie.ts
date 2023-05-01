import express from "express";
import { AxiosResponse } from "axios";
import { CookieJar, parse } from "tough-cookie";
import config from "@/config";
import { RIOT_AUTH_URL } from "@/globals";
import { URL } from "url";

export const RIOT_AUTH_HOSTNAME = new URL(RIOT_AUTH_URL).hostname
  .split(".")
  .slice(-2)
  .join("."); //Remove subdomains from hostname
export const DOMAIN_HOSTNAME = config.DOMAIN.split(":")[0];

export function storeCookies(
  res: AxiosResponse,
  cookieJar: CookieJar,
  url: string
) {
  (res.headers["set-cookie"] ?? []).forEach((cookie) =>
    cookieJar.setCookieSync(parse(cookie), url)
  );
}

export function parseCookiesIntoJar(
  req: express.Request,
  cookieJar: CookieJar,
  url: string
) {
  if (req.headers.cookie)
    cookieJar.setCookieSync(parse(req.headers.cookie), url);
}

export function convertCookieToLocal(cookies: string[]) {
  return cookies.map((cookie) =>
    cookie.replaceAll(
      "Domain=" + RIOT_AUTH_HOSTNAME,
      "Domain=" + DOMAIN_HOSTNAME
    )
  );
}
