import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UnauthorizedError } from "./errors/unauthorizedError.js";
import { BadRequestError } from "./errors/badRequestError.js";
const TOKEN_ISSUER = "chirpy";
export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}
export async function checkPasswordHash(password, hash) {
    return await bcrypt.compare(password, hash);
}
export function makeJWT(userID, expiresIn, secret) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign({
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt,
    }, secret, { algorithm: "HS256" });
    return token;
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (e) {
        throw new UnauthorizedError("Invalid token");
    }
    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new UnauthorizedError("No user ID in token");
    }
    return decoded.sub;
}
export function getBearerToken(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorizedError("Malformed authorization header");
    }
    return extractBearerToken(authHeader);
}
export function extractBearerToken(header) {
    const splitAuth = header.split(" ");
    if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
        throw new BadRequestError("Malformed authorization header");
    }
    return splitAuth[1];
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
export function getAPIKey(req) {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new UnauthorizedError("Malformed authorization header");
    }
    return extractApiKey(authHeader);
}
export function extractApiKey(header) {
    const splitAuth = header.split(" ");
    if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
        throw new BadRequestError("Malformed authorization header");
    }
    return splitAuth[1];
}
