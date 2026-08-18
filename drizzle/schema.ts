import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  soundAlerts: int("soundAlerts").default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Favorites saved by authenticated users.
 * `itemId` is a stable string key, e.g. "spirit:styx" or "farm:snake-valley".
 */
export const favorites = mysqlTable(
  "favorites",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    itemId: varchar("itemId", { length: 120 }).notNull(),
    itemType: mysqlEnum("itemType", ["spirit", "codex", "farm", "class", "economy", "boss", "sabuk", "mystery", "seal", "gear", "materials"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("userId_itemId").on(t.userId, t.itemId)],
);

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Community tips/comments on Farm locations, posted by logged-in users.
 */
export const farmComments = mysqlTable(
  "farm_comments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    farmKey: varchar("farmKey", { length: 120 }).notNull(),
    pageKey: varchar("pageKey", { length: 60 }).default("farm").notNull(),
    content: text("content").notNull(),
    upvotes: int("upvotes").default(0).notNull(),
    downvotes: int("downvotes").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [index("farmKey_idx").on(t.farmKey)],
);

export type FarmComment = typeof farmComments.$inferSelect;
export type InsertFarmComment = typeof farmComments.$inferInsert;

/**
 * Codex collection progress per user: which codex item IDs were marked collected.
 */
export const codexProgress = mysqlTable(
  "codex_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    itemId: varchar("itemId", { length: 120 }).notNull(),
    collectedAt: timestamp("collectedAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("userId_itemId").on(t.userId, t.itemId)],
);

export type CodexProgress = typeof codexProgress.$inferSelect;
export type InsertCodexProgress = typeof codexProgress.$inferInsert;

/**
 * Vote per user per comment: prevents double voting and allows changing votes.
 * vote = 1 (upvote) | -1 (downvote) | 0 (removed).
 */
export const commentVotes = mysqlTable(
  "comment_votes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    commentId: int("commentId").notNull(),
    vote: int("vote").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("userId_commentId").on(t.userId, t.commentId), index("commentId_idx").on(t.commentId)],
);

export type CommentVote = typeof commentVotes.$inferSelect;
export type InsertCommentVote = typeof commentVotes.$inferInsert;
