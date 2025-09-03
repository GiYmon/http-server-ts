import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { createChirp } from "../db/queries/chirps.js";
export async function handlerChirpCreation(req, res) {
    const params = req.body;
    if (!params.userId || !params.body) {
        throw new BadRequestError("Missing required fields");
    }
    throwErrorIfChirpIsTooLong(params.body);
    const chirp = await createChirp({
        body: removeRestrictedWords(params.body),
        userId: params.userId,
    });
    if (!chirp) {
        throw new Error("Failed to create chirp");
    }
    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId,
    });
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
