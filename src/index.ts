import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { logResponses, metricsInc } from "./middleware.js";
import { handlerReadiness } from "./api/readinessHandler.js";
import { handlerMetrics } from "./api/metricsHandler.js";
import { handlerResetMetrics } from "./api/resetMetricsHandler.js";
import { handlerUserCreation } from "./api/userHandler.js";
import { handlerLogin } from "./api/authHandler.js";
import {
  handlerChirpCreation,
  handlerChirpList,
  handlerChirpRetrival,
} from "./api/chirpHandler.js";
import { errorHandler } from "./api/errorHandler.js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

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

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerUserCreation(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpList(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpCreation(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerChirpRetrival(req, res)).catch(next);
});

app.use(errorHandler);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
