import { BadRequestError } from "../errors/badRequestError.js";
import { respondWithJSON } from "./json.js";
export function handlerChirpValidation(req, res) {
    const params = req.body;
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const cleanedBody = removeRestrictedWords(params.body);
    respondWithJSON(res, 200, {
        cleanedBody: cleanedBody,
    });
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
