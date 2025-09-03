import { getByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { checkPasswordHash } from "../auth.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getByEmail(params.email);
    if (!user || !user.hashedPassword) {
        throw new UnauthorizedError("invalid username or password");
    }
    const matching = await checkPasswordHash(params.password, user.hashedPassword);
    if (!matching) {
        throw new UnauthorizedError("invalid username or password");
    }
    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    });
}
