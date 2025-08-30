import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { handlerReadiness } from "./api/readinessHandler.js";
import { handlerMetrics } from "./api/metricsHandler.js";
import { handlerResetMetrics } from "./api/resetMetricsHandler.js";
import { handlerChirpValidation } from "./api/chirpValidationHandler.js";

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
