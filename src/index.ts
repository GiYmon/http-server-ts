import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { apiConfig } from "./config.js";
import type { Request, Response } from "express";

const app = express();
const PORT = 8080;

app.use(logResponses);
app.use("/app", metricsInc, express.static("./src/app"));
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerResetMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.send(`Hits: ${apiConfig.fileserverHits}`);
}

function handlerResetMetrics(req: Request, res: Response) {
  apiConfig.fileserverHits = 0;
  res.sendStatus(200);
}
