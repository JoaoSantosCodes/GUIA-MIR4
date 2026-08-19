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

/**
 * Votos comunitários na tier list de classes: um voto por usuário por cenário e classe.
 * vote = 1 (classe merece tier maior) | -1 (classe merece tier menor) | 0 (removido).
 */
export const tierlistVotes = mysqlTable(
  "tierlist_votes",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    scenario: varchar("scenario", { length: 40 }).notNull(),
    classKey: varchar("classKey", { length: 40 }).notNull(),
    vote: int("vote").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("userId_scenario_class").on(t.userId, t.scenario, t.classKey)],
);
export type TierlistVote = typeof tierlistVotes.$inferSelect;
export type InsertTierlistVote = typeof tierlistVotes.$inferInsert;

/**
 * Votos comunitários na tier list de espíritos: um voto por usuário por cenário e espírito.
 * vote = 1 (espírito merece tier maior) | -1 (espírito merece tier menor) | 0 (removido).
 */
export const tierlistVotesSpirit = mysqlTable(
  "tierlist_votes_spirit",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    scenario: varchar("scenario", { length: 40 }).notNull(),
    spiritKey: varchar("spiritKey", { length: 60 }).notNull(),
    vote: int("vote").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("userId_scenario_spirit").on(t.userId, t.scenario, t.spiritKey)],
);
export type TierlistVoteSpirit = typeof tierlistVotesSpirit.$inferSelect;
export type InsertTierlistVoteSpirit = typeof tierlistVotesSpirit.$inferInsert;

/**
 * Histórico de tiers por classe e cenário, amostrado por semana.
 * Um snapshot por (week, scenario, classKey): tier exibido para a comunidade naquela semana
 * (computed a partir dos votos existentes na semana). Permite plotar a evolução semanal.
 */
export const tierlistHistory = mysqlTable(
  "tierlist_history",
  {
    id: int("id").autoincrement().primaryKey(),
    week: varchar("week", { length: 10 }).notNull(), // formato YYYY-Www (ISO 8601)
    scenario: varchar("scenario", { length: 40 }).notNull(),
    classKey: varchar("classKey", { length: 40 }).notNull(),
    tier: varchar("tier", { length: 2 }).notNull(), // S/A/B/C
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("week_scenario_class").on(t.week, t.scenario, t.classKey)],
);
export type TierlistHistory = typeof tierlistHistory.$inferSelect;
export type InsertTierlistHistory = typeof tierlistHistory.$inferInsert;

/**
 * Histórico de tiers por espírito e cenário, amostrado por semana.
 * Um snapshot por (week, scenario, spiritKey): tier exibido para a comunidade
 * naquela semana (computed a partir dos votos existentes). Permite plotar a evolução.
 */
export const tierlistHistorySpirit = mysqlTable(
  "tierlist_history_spirit",
  {
    id: int("id").autoincrement().primaryKey(),
    week: varchar("week", { length: 10 }).notNull(), // formato YYYY-Www (ISO 8601)
    scenario: varchar("scenario", { length: 40 }).notNull(),
    spiritKey: varchar("spiritKey", { length: 60 }).notNull(),
    tier: varchar("tier", { length: 2 }).notNull(), // S/A/B/C
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("week_scenario_spirit").on(t.week, t.scenario, t.spiritKey)],
);
export type TierlistHistorySpirit = typeof tierlistHistorySpirit.$inferSelect;
export type InsertTierlistHistorySpirit = typeof tierlistHistorySpirit.$inferInsert;

/**
 * Progresso dos capítulos vivenciados da linha do tempo (21 capítulos do MIR4).
 * Um registro por usuário por capítulo marcado; usado para calcular as conquistas
 * "Viajante do Tempo" (10+) e "Veterano de Sabuk" (21/21) de forma sincronizada
 * entre os dispositivos do usuário.
 */
export const chapterProgress = mysqlTable(
  "chapter_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    chapter: int("chapter").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("userId_chapter").on(t.userId, t.chapter)],
);
export type ChapterProgress = typeof chapterProgress.$inferSelect;
export type InsertChapterProgress = typeof chapterProgress.$inferInsert;
