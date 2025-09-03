import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { create, list, getById } from "../db/queries/chirps.js";
export async function handlerChirpCreation(req, res) {
    const params = req.body;
    if (!params.userId || !params.body) {
        throw new BadRequestError("Missing required fields");
    }
    throwErrorIfChirpIsTooLong(params.body);
    const chirp = await create({
        body: removeRestrictedWords(params.body),
        userId: params.userId,
    });
    if (!chirp) {
        throw new Error("Failed to create chirp");
    }
    respondWithJSON(res, 201, chirp);
}
export async function handlerChirpList(req, res) {
    const chirps = await list();
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
function throwErrorIfChirpIsTooLong(body) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
}
function removeRestrictedWords(body) {
    const restrictedWords = ["kerfuffle", "sharbert", "fornax"];
    const replacement = "****";
    const words = body.split(" ");
    const filteredWords = words.map((word) => {
        if (restrictedWords.includes(word.toLowerCase())) {
            return replacement;
        }
        return word;
    });
    return filteredWords.join(" ");
}
