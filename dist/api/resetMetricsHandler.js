import { config } from "../config.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerResetMetrics(req, res) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Reset is only allowed in dev environment.");
    }
    config.api.fileServerHits = 0;
    await deleteUsers();
    res.write("Hits reset to 0");
    res.end();
}
