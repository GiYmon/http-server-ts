import { createUser, updateUser, upgrateToRed, } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerUserCreation(req, res) {
    const params = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }
    const hashedPassword = await hashPassword(params.password);
    const user = await createUser({
        email: params.email,
        hashedPassword,
    });
    if (!user) {
        throw new Error("Could not create user");
    }
    respondWithJSON(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    });
}
export async function handlerUserUpdate(req, res) {
    const token = getBearerToken(req);
    const subject = validateJWT(token, config.jwt.secret);
    const params = req.body;
    if (!params.password || !params.email) {
        throw new BadRequestError("Missing required fields");
    }
    const hashedPassword = await hashPassword(params.password);
    const user = await updateUser(subject, params.email, hashedPassword);
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    });
}
export async function handlerUserUpgrade(req, res) {
    const params = req.body;
    if (params.event !== "user.upgraded") {
        respondWithJSON(res, 204, {});
        return;
    }
    await upgrateToRed(params.data.userId);
    respondWithJSON(res, 204, {});
}
