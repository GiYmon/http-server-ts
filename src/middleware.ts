import { config } from "./config.js";
import type { Request, Response, NextFunction } from "express";

export function logResponses(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function metricsInc(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  config.api.fileServerHits++;

  next();
}
