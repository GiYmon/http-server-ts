import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function create(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function list(): Promise<NewChirp[]> {
  const results = await db.select().from(chirps);

  return results;
}

export async function deleteAll() {
  await db.delete(chirps);
}
