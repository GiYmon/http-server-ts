import { eq } from "drizzle-orm";
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
export async function list(authorId) {
    if (authorId) {
        return await db.select().from(chirps).where(eq(chirps.userId, authorId));
    }
    return await db.select().from(chirps);
}
export async function getById(id) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id))
        .limit(1);
    return result;
}
export async function deleteById(id) {
    await db.delete(chirps).where(eq(chirps.id, id));
}
export async function deleteAll() {
    await db.delete(chirps);
}
