import { config } from "./config.js";
export function logResponses(req, res, next) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}
export function metricsInc(req, res, next) {
    config.fileserverHits++;
    next();
}
