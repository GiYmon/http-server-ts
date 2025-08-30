import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { handlerReadiness } from "./api/readinessHandler.js";
import { handlerMetrics } from "./api/metricsHandler.js";
import { handlerResetMetrics } from "./api/resetMetricsHandler.js";
import { handlerChirpValidation } from "./api/chirpValidationHandler.js";
import { errorHandler } from "./api/errorHandler.js";
const app = express();
const PORT = 8080;
app.use(logResponses);
app.use(express.json());
app.use("/app", metricsInc, express.static("./src/app"));
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetMetrics(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
    Promise.resolve(handlerChirpValidation(req, res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
