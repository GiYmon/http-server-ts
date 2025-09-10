import {
  createUser,
  updateUser,
  getById,
  upgrateToRed,
} from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { ForbiddenError } from "../errors/forbiddenError.js";
import { NewUser } from "../db/schema.js";
import {
  hashPassword,
  getBearerToken,
  validateJWT,
  getAPIKey,
} from "../auth.js";
import { config } from "../config.js";
import type { Request, Response } from "express";

export type UserResponse = Omit<NewUser, "hashedPassword">;

export async function handlerUserCreation(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };
  const params: parameters = req.body;

  if (!params.email || !params.password) {
    throw new BadRequestError("Missing required fields");
  }

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({
    email: params.email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isChirpyRed: user.isChirpyRed,
  } satisfies UserResponse);
}

export async function handlerUserUpdate(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const token = getBearerToken(req);
  const subject = validateJWT(token, config.jwt.secret);

  const params: parameters = req.body;

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
  } satisfies UserResponse);
}

export async function handlerUserUpgrade(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };

  const apiKey = getAPIKey(req);

  if (apiKey !== config.api.polkaKey) {
    throw new ForbiddenError("You don't have access to this resource");
  }

  const params: parameters = req.body;

  if (params.event !== "user.upgraded") {
    respondWithJSON(res, 204, {});
    return;
  }

  await upgrateToRed(params.data.userId);

  respondWithJSON(res, 204, {});
}
