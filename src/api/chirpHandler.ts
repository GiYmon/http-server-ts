import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { create, list, getById, deleteById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { NewChirp } from "../db/schema.js";

import type { Request, Response } from "express";

export async function handlerChirpCreation(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const token = getBearerToken(req);
  const userId = validateJWT(token, config.jwt.secret);

  const cleaned = validateChirp(params.body);
  const chirp = await create({ body: cleaned, userId: userId });

  respondWithJSON(res, 201, chirp);
}

export async function handlerChirpList(req: Request, res: Response) {
  const authorId = req.query.authorId as string | undefined;
  let chirps = await list(authorId);

  let sortDirection = "asc";
  let sortDirectionParam = req.query.sort;
  if (sortDirectionParam === "desc") {
    sortDirection = "desc";
  }

  chirps = chirps.sort((a, b) =>
    sortDirection === "asc"
      ? a.createdAt!.getTime() - b.createdAt!.getTime()
      : b.createdAt!.getTime() - a.createdAt!.getTime()
  );

  respondWithJSON(res, 200, chirps);
}

export async function handlerChirpRetrival(req: Request, res: Response) {
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

export async function handlerChirpDeletion(req: Request, res: Response) {
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

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
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
