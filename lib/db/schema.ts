import type { InferSelectModel } from "drizzle-orm"
import {
  pgTable,
  varchar,
  timestamp,
  json,
  text,
  primaryKey,
  foreignKey,
  boolean,
  integer,
} from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

//
// Users
//
export const user = pgTable("User", {
  id: text("id").primaryKey().notNull(), // was uuid
  email: varchar("email", { length: 64 }).unique(),
  password: varchar("password", { length: 64 }),
})

export type User = InferSelectModel<typeof user>

//
// Chats
//
export const chat = pgTable("Chat", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
})

export type Chat = InferSelectModel<typeof chat>

//
// Accounts
//
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)

//
// Deprecated Messages
//
export const messageDeprecated = pgTable("Message", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
})

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>

//
// Messages v2
//
export const message = pgTable("Message_v2", {
  id: text("id").primaryKey().notNull(),
  chatId: text("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
})

export type DBMessage = InferSelectModel<typeof message>

//
// Deprecated Votes
//
export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: text("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: text("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    }
  }
)

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>

//
// Votes v2
//
export const vote = pgTable(
  "Vote_v2",
  {
    chatId: text("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: text("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    }
  }
)

export type Vote = InferSelectModel<typeof vote>

//
// Documents
//
export const document = pgTable(
  "Document",
  {
    id: text("id").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    }
  }
)

export type Document = InferSelectModel<typeof document>

//
// Suggestions
//
export const suggestion = pgTable(
  "Suggestion",
  {
    id: text("id").notNull(),
    documentId: text("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: text("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
)

export type Suggestion = InferSelectModel<typeof suggestion>
