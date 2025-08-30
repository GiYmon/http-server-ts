import { BadRequestError } from "../errors/badRequestError.js";
import { respondWithError } from "./json.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
export function errorHandler(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`);
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    }
    else if (err instanceof UnauthorizedError) {
        respondWithError(res, 401, err.message);
    }
    else if (err instanceof ForbiddenError) {
        respondWithError(res, 403, err.message);
    }
    else if (err instanceof NotFoundError) {
        respondWithError(res, 404, err.message);
    }
    else {
        respondWithError(res, 500, err.message);
    }
}
