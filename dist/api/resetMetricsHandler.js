import { apiConfig } from "../config.js";
export function handlerResetMetrics(req, res) {
    apiConfig.fileserverHits = 0;
    res.sendStatus(200);
}
