import { DOMAIN_HOSTNAME, RIOT_AUTH_HOSTNAME } from "@/utils/cookie";
import express from "express";

export function cookieProcessor() {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.headers.cookie)
      req.headers.cookie = req.headers.cookie.replaceAll(
        "Domain=" + DOMAIN_HOSTNAME,
        "Domain=" + RIOT_AUTH_HOSTNAME
      );

    next();
  };
}
