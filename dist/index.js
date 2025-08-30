import express from "express";
import { logResponses, metricsInc } from "./middleware.js";
import { apiConfig } from "./config.js";
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
function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain");
    res.send("OK");
}
function handlerMetrics(req, res) {
    res.set("Content-Type", "text/plain");
    res.send(`Hits: ${apiConfig.fileserverHits}`);
}
function handlerResetMetrics(req, res) {
    apiConfig.fileserverHits = 0;
    res.sendStatus(200);
}
