import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { create, list } from "../db/queries/chirps.js";

import type { Request, Response } from "express";

export async function handlerChirpCreation(req: Request, res: Response) {
  type parameters = {
    userId: string;
    body: string;
  };
  const params: parameters = req.body;

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

export async function handlerChirpRetrieval(req: Request, res: Response) {
  const chirps = await list();

  respondWithJSON(res, 200, chirps);
}

function throwErrorIfChirpIsTooLong(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
}

function removeRestrictedWords(body: string): string {
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
