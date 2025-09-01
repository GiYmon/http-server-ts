import { config } from "../config.js";
export function handlerResetMetrics(req, res) {
    config.api.fileServerHits = 0;
    res.sendStatus(200);
}
