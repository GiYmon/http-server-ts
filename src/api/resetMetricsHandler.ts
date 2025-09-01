import { config } from "../config.js";
import type { Request, Response } from "express";

export function handlerResetMetrics(req: Request, res: Response) {
  config.api.fileServerHits = 0;
  res.sendStatus(200);
}
