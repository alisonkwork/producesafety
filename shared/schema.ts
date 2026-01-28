import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Export Auth & Chat models so they are included in the schema
export * from "./models/auth";
export * from "./models/chat";

export const fsmaStatus = pgTable("fsma_status", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  isCovered: boolean("is_covered").default(false),
  isExempt: boolean("is_exempt").default(false),
  exemptionType: text("exemption_type"), // 'qualified', 'commercial', 'none'
  annualSales: text("annual_sales"),
  details: jsonb("details").$type<Record<string, any>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const records = pgTable("records", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'training', 'soil', 'water', 'harvest', 'plan', 'cleaning'
  title: text("title").notNull(),
  date: timestamp("date").defaultNow(),
  data: jsonb("data").$type<Record<string, any>>().default({}),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFsmaStatusSchema = createInsertSchema(fsmaStatus).omit({ id: true, updatedAt: true });
export const insertRecordSchema = createInsertSchema(records).omit({ id: true, createdAt: true });

export type FsmaStatus = typeof fsmaStatus.$inferSelect;
export type InsertFsmaStatus = z.infer<typeof insertFsmaStatusSchema>;
export type RecordItem = typeof records.$inferSelect;
export type InsertRecord = z.infer<typeof insertRecordSchema>;

export type CreateRecordRequest = Omit<InsertRecord, 'userId'>;
export type UpdateRecordRequest = Partial<CreateRecordRequest>;
export type UpdateFsmaStatusRequest = Omit<InsertFsmaStatus, 'userId'>;
