import { apiConfig } from "../config.js";
import type { Request, Response } from "express";

export function handlerResetMetrics(req: Request, res: Response) {
  apiConfig.fileserverHits = 0;
  res.sendStatus(200);
}
