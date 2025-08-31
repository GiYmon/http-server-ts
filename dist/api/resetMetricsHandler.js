import { config } from "../config.js";
export function handlerResetMetrics(req, res) {
    config.fileserverHits = 0;
    res.sendStatus(200);
}
