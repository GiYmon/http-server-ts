import { BadRequestError } from "../errors/badRequestError.js";
import { respondWithError } from "./json.js";
import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  respondWithError(res, statusCode, message);
}
