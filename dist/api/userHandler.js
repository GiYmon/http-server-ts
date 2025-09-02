import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
export async function handlerUserCreation(req, res) {
    const params = req.body;
    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }
    const user = await createUser({ email: params.email });
    if (!user) {
        throw new Error("Could not create user");
    }
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
