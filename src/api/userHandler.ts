import { createUser, getByEmail, updateUser } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { UnauthorizedError } from "../errors/unauthorizedError.js";
import { NewUser } from "../db/schema.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
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
  } satisfies UserResponse);
}
