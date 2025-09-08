import { getByEmail } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getByEmail(params.email);
    if (!user || !user.hashedPassword || !user.id) {
        throw new UnauthorizedError("invalid username or password");
    }
    const matching = await checkPasswordHash(params.password, user.hashedPassword);
    if (!matching) {
        throw new UnauthorizedError("invalid username or password");
    }
    let duration = config.jwt.defaultDuration;
    if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
        duration = params.expiresIn;
    }
    const accessToken = makeJWT(user.id, duration, config.jwt.secret);
    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: accessToken,
    });
}
