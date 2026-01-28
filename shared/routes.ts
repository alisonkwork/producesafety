import { z } from 'zod';
import { insertFsmaStatusSchema, insertRecordSchema, insertUserPreferencesSchema, records, fsmaStatus, userPreferences } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  fsma: {
    getStatus: {
      method: 'GET' as const,
      path: '/api/fsma/status',
      responses: {
        200: z.custom<typeof fsmaStatus.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    },
    updateStatus: {
      method: 'POST' as const,
      path: '/api/fsma/status',
      input: insertFsmaStatusSchema.omit({ userId: true }),
      responses: {
        200: z.custom<typeof fsmaStatus.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  records: {
    list: {
      method: 'GET' as const,
      path: '/api/records',
      input: z.object({ type: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom<typeof records.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    },
    get: {
      method: 'GET' as const,
      path: '/api/records/:id',
      responses: {
        200: z.custom<typeof records.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/records',
      input: insertRecordSchema.omit({ userId: true }),
      responses: {
        201: z.custom<typeof records.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/records/:id',
      input: insertRecordSchema.omit({ userId: true }).partial(),
      responses: {
        200: z.custom<typeof records.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/records/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      }
    },
  },
  preferences: {
    get: {
      method: 'GET' as const,
      path: '/api/preferences',
      responses: {
        200: z.custom<typeof userPreferences.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: 'PUT' as const,
      path: '/api/preferences',
      input: insertUserPreferencesSchema.omit({ userId: true }).partial(),
      responses: {
        200: z.custom<typeof userPreferences.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
