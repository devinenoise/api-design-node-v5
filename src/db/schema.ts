import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// Define a native Postgres ENUM type for habit frequency. This enforces the allowed
// values at the database level (not just in application code) and is reused by both the
// column definition below and the auto-generated drizzle-zod validation schemas.
export const frequencyEnum = pgEnum('frequency', ['daily', 'weekly', 'monthly'])

// always export the schema to ensure that it is available for use in other parts of the application, such as in the database connection and query execution modules. This allows for a centralized definition of the database structure, making it easier to maintain and update as the application evolves.
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  frequency: frequencyEnum('frequency').notNull(),
  targetCount: integer('target_count').default(1).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  completionDate: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// union table for many-to-many relationship between habits and entries
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  // Assuming color is stored as a hex code
  color: varchar('color', { length: 7 }).default('#6b7280'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// union table for many-to-many relationship between habits and tags
export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Define relations for the users table to establish a one-to-many relationship with the habits table. This allows for easy querying of a user's habits and ensures that when a user is deleted, their associated habits are also removed from the database, maintaining referential integrity.
export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}))

// Define relations for the habits table to establish relationships with the users, entries, and tags tables. This allows for easy querying of a habit's associated user, entries, and tags, and ensures that when a habit is deleted, its associated entries and tags are also removed from the database, maintaining referential integrity.
export const habitRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  tags: many(habitTags),
}))

// Define relations for the entries table to establish a one-to-many relationship with the habits table. This allows for easy querying of an entry's associated habit and ensures that when a habit is deleted, its associated entries are also removed from the database, maintaining referential integrity.
export const entryRelations = relations(entries, ({ one }) => ({
  habit: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

// Define relations for the tags table to establish a many-to-many relationship with the habits table through the habitTags union table. This allows for easy querying of a tag's associated habits and ensures that when a tag is deleted, its associations with habits are also removed from the database, maintaining referential integrity.
export const tagRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

// Define relations for the habitTags union table to establish relationships with the habits and tags tables. This allows for easy querying of a habitTag's associated habit and tag, and ensures that when a habit or tag is deleted, its associated habitTags are also removed from the database, maintaining referential integrity.
export const habitTagRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

// Create Zod schemas for validation and type inference for middleware and API endpoints. These schemas ensure that the data being inserted into or selected from the database adheres to the defined structure, providing type safety and validation at runtime.
export type User = typeof users.$inferSelect
export type Habit = typeof habits.$inferSelect
export type Entry = typeof entries.$inferSelect
export type Tag = typeof tags.$inferSelect
export type HabitTag = typeof habitTags.$inferSelect

export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertHabitSchema = createInsertSchema(habits)
export const selectHabitSchema = createSelectSchema(habits)

export const insertEntrySchema = createInsertSchema(entries)
export const selectEntrySchema = createSelectSchema(entries)

export const insertTagSchema = createInsertSchema(tags)
export const selectTagSchema = createSelectSchema(tags)
export const insertHabitTagSchema = createInsertSchema(habitTags)
export const selectHabitTagSchema = createSelectSchema(habitTags)
