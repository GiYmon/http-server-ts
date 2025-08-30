import { apiConfig } from "../config.js";
import type { Request, Response } from "express";

export function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${apiConfig.fileserverHits} times!</p>
      </body>
    </html>
  `);
}
