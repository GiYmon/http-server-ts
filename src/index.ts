import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { apiConfig } from "./config.js";
import { respondWithError, respondWithJSON } from "./api/json.js";
import type { Request, Response } from "express";

const app = express();
const PORT = 8080;

app.use(logResponses);
app.use(express.json());
app.use("/app", metricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpValidation);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
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

function handlerResetMetrics(req: Request, res: Response) {
  apiConfig.fileserverHits = 0;
  res.sendStatus(200);
}

function handlerChirpValidation(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  respondWithJSON(res, 200, {
    valid: true,
  });
}
