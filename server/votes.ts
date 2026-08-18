import { eq, inArray, and } from "drizzle-orm";
import { commentVotes } from "../drizzle/schema";
import { getDb } from "./db";

/** Votos atuais do usuário nos comentários dados (para destacar na UI). */
export async function listVotesByUserAndComments(userId: number, commentIds: number[]) {
  const db = await getDb();
  if (!db || commentIds.length === 0) return [];
  return db
    .select({ commentId: commentVotes.commentId, vote: commentVotes.vote })
    .from(commentVotes)
    .where(and(inArray(commentVotes.commentId, commentIds), eq(commentVotes.userId, userId)));
}
