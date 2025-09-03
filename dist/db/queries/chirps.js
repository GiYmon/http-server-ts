import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function create(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function list() {
    const results = await db.select().from(chirps);
    return results;
}
export async function deleteAll() {
    await db.delete(chirps);
}
