import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const balancesTable = pgTable("balances", {
  userId: text("user_id").primaryKey(),
  hrn: text("hrn").notNull().default("0"),
  rub: text("rub").notNull().default("0"),
  ton: text("ton").notNull().default("0"),
  stars: text("stars").notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBalanceSchema = createInsertSchema(balancesTable).omit({ createdAt: true, updatedAt: true });
export type InsertBalance = z.infer<typeof insertBalanceSchema>;
export type Balance = typeof balancesTable.$inferSelect;
