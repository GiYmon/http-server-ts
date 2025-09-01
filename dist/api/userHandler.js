import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
export async function handlerUserCreation(req, res) {
    const params = req.body;
    const user = await createUser(params);
    return respondWithJSON(res, 201, user);
}
