import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function updateUser(
  id: string,
  email: string,
  hashedPassword: string
) {
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

export async function getByEmail(email: string): Promise<NewUser> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result;
}

export async function getById(id: string): Promise<NewUser | undefined> {
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
