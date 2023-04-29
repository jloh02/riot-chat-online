import { updateBuildVersions } from "@/globals";
import express from "express";

export function riotClientBuild() {
  return (req: express.Request, res: express.Response, next: () => void) => {
    updateBuildVersions().then(next);
  };
}
