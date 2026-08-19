import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb, listFavorites, listCodexProgress } from "./db";

/** Retrieves a user's public shareable profile (name, favorites, codex progress). */
export async function getPublicProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.id, userId));
  const user = rows[0];
  if (!user) return null;
  const [favorites, progress] = await Promise.all([listFavorites(userId), listCodexProgress(userId)]);
  return { id: user.id, name: user.name ?? "Jogador", favorites, progress };
}
