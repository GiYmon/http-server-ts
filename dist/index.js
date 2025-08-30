import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { apiConfig } from "./config.js";
import { respondWithError, respondWithJSON } from "./api/json.js";
const app = express();
const PORT = 8080;
app.use(logResponses, express.json());
app.use("/app", metricsInc, express.static("./src/app"));
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpValidation);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetMetrics);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}
function handlerMetrics(req, res) {
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
function handlerResetMetrics(req, res) {
    apiConfig.fileserverHits = 0;
    res.sendStatus(200);
}
function handlerChirpValidation(req, res) {
    const params = req.body;
    if (!params || typeof params.body !== "string") {
        respondWithError(res, 400, "Invalid JSON");
        return;
    }
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    respondWithJSON(res, 200, {
        valid: true,
    });
}
