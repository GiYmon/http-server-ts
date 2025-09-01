import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { deleteUsers } from "../db/queries/users.js";
export async function handlerResetMetrics(req, res) {
    if (config.api.platform !== "dev") {
        return respondWithError(res, 403, "Forbidden");
    }
    await deleteUsers();
    return res.status(200).send();
}
