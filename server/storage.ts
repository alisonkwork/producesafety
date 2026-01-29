import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import {
  fsmaStatus, records,
  type FsmaStatus, type InsertFsmaStatus,
  type RecordItem, type InsertRecord, type UpdateFsmaStatusRequest, type CreateRecordRequest
} from "@shared/schema";

export interface IStorage {
  // FSMA Status
  getFsmaStatus(userId: string): Promise<FsmaStatus | undefined>;
  updateFsmaStatus(userId: string, status: UpdateFsmaStatusRequest): Promise<FsmaStatus>;

  // Records
  getRecords(userId: string, type?: string): Promise<RecordItem[]>;
  getRecord(id: number): Promise<RecordItem | undefined>;
  createRecord(userId: string, record: CreateRecordRequest): Promise<RecordItem>;
  updateRecord(id: number, userId: string, record: Partial<CreateRecordRequest>): Promise<RecordItem | undefined>;
  deleteRecord(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFsmaStatus(userId: string): Promise<FsmaStatus | undefined> {
    const [status] = await db.select().from(fsmaStatus).where(eq(fsmaStatus.userId, userId));
    return status;
  }

  async updateFsmaStatus(userId: string, statusData: UpdateFsmaStatusRequest): Promise<FsmaStatus> {
    const [existing] = await db.select().from(fsmaStatus).where(eq(fsmaStatus.userId, userId));
    
    if (existing) {
      const [updated] = await db.update(fsmaStatus)
        .set({ ...statusData, updatedAt: new Date() })
        .where(eq(fsmaStatus.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(fsmaStatus)
        .values({ ...statusData, userId })
        .returning();
      return created;
    }
  }

  async getRecords(userId: string, type?: string): Promise<RecordItem[]> {
    if (type) {
      return await db.select().from(records)
        .where(and(eq(records.userId, userId), eq(records.type, type)))
        .orderBy(desc(records.date));
    }
    return await db.select().from(records)
      .where(eq(records.userId, userId))
      .orderBy(desc(records.date));
  }

  async getRecord(id: number): Promise<RecordItem | undefined> {
    const [record] = await db.select().from(records).where(eq(records.id, id));
    return record;
  }

  async createRecord(userId: string, record: CreateRecordRequest): Promise<RecordItem> {
    const [created] = await db.insert(records)
      .values({ ...record, userId })
      .returning();
    return created;
  }

  async updateRecord(id: number, userId: string, updates: Partial<CreateRecordRequest>): Promise<RecordItem | undefined> {
    const [existing] = await db.select().from(records).where(eq(records.id, id));
    if (!existing || existing.userId !== userId) return undefined;

    const [updated] = await db.update(records)
      .set(updates)
      .where(eq(records.id, id))
      .returning();
    return updated;
  }

  async deleteRecord(id: number, userId: string): Promise<void> {
    const [existing] = await db.select().from(records).where(eq(records.id, id));
    if (!existing || existing.userId !== userId) return;

    await db.delete(records).where(eq(records.id, id));
  }
}

export const storage = new DatabaseStorage();
