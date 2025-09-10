import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { create, list, getById, deleteById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerChirpCreation(req, res) {
    const params = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const cleaned = validateChirp(params.body);
    const chirp = await create({ body: cleaned, userId: userId });
    respondWithJSON(res, 201, chirp);
}
export async function handlerChirpList(req, res) {
    const authorId = req.query.authorId;
    const chirps = await list(authorId);
    respondWithJSON(res, 200, chirps);
}
export async function handlerChirpRetrival(req, res) {
    const { chirpId } = req.params;
    if (!chirpId) {
        throw new BadRequestError("Missing chirpId parameter");
    }
    const chirp = await getById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    respondWithJSON(res, 200, chirp);
}
export async function handlerChirpDeletion(req, res) {
    const { chirpId } = req.params;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const chirp = await getById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    if (chirp.userId !== userId) {
        throw new ForbiddenError("You cannot delete this resource.");
    }
    await deleteById(chirpId);
    respondWithJSON(res, 204, {});
}
function validateChirp(body) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, badWords);
}
function getCleanedBody(body, badWords) {
    const words = body.split(" ");
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }
    const cleaned = words.join(" ");
    return cleaned;
}
