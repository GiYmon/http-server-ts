import { eq } from "drizzle-orm";
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

export async function getById(id: string): Promise<NewChirp | undefined> {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id))
    .limit(1);

  return result;
}

export async function deleteById(id: string) {
  await db.delete(chirps).where(eq(chirps.id, id));
}

export async function deleteAll() {
  await db.delete(chirps);
}
