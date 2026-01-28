import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Setup Chat
  registerChatRoutes(app);

  // 3. App Routes (Protected)
  
  // FSMA Status
  app.get(api.fsma.getStatus.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const status = await storage.getFsmaStatus(userId);
    if (!status) {
      return res.status(404).json({ message: "FSMA status not found" });
    }
    res.json(status);
  });

  app.post(api.fsma.updateStatus.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.fsma.updateStatus.input.parse(req.body);
      const status = await storage.updateFsmaStatus(userId, input);
      res.json(status);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Records
  app.get(api.records.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const type = req.query.type as string | undefined;
    const records = await storage.getRecords(userId, type);
    res.json(records);
  });

  app.get(api.records.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const record = await storage.getRecord(Number(req.params.id));
    
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    if (record.userId !== userId) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  });

  app.post(api.records.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      // Handle date coercion if needed, but zod schema handles types
      // Front-end sends ISO strings for dates, we might need to coerce if schema expects Date object
      // But drizzle-zod usually expects Date or string that parses to Date.
      const input = api.records.create.input.parse(req.body);
      const record = await storage.createRecord(userId, input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.records.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const input = api.records.update.input.parse(req.body);
      const record = await storage.updateRecord(Number(req.params.id), userId, input);
      
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.records.delete.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    await storage.deleteRecord(Number(req.params.id), userId);
    res.status(204).send();
  });

  return httpServer;
}
