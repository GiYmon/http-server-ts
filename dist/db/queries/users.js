import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function updateUser(id, email, hashedPassword) {
    const [result] = await db
        .update(users)
        .set({
        email: email,
        hashedPassword: hashedPassword,
    })
        .where(eq(users.id, id))
        .returning();
    return result;
}
export async function getByEmail(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    return result;
}
export async function getById(id) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
    return result;
}
export async function deleteUsers() {
    await db.delete(users);
}
