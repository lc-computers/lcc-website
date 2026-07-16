import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

/**
 * Database access. Uses the Neon serverless driver over WebSockets (full
 * transaction support, works on Vercel and locally).
 *
 * Call hasDb() before getDb() in code paths that must degrade gracefully.
 */

// Node < 22 environments need a WebSocket implementation supplied.
if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;
}

export type Db = NeonDatabase<typeof schema>;

let _db: Db | null = null;

export function hasDb(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb(): Db {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!_db) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle(pool, { schema });
  }
  return _db;
}

export { schema };
