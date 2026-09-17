import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDrizzleDb?: ReturnType<typeof drizzle>;
};

export const pool: Pool = databaseUrl
  ? (globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    }))
  : (null as unknown as Pool);

if (databaseUrl && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db: ReturnType<typeof drizzle> = databaseUrl
  ? (globalForDb.__arenaNextJsDrizzleDb ?? (globalForDb.__arenaNextJsDrizzleDb = drizzle(pool)))
  : (new Proxy({}, {
      get() {
        throw new Error("DATABASE_URL is required");
      },
    }) as unknown as ReturnType<typeof drizzle>);

if (databaseUrl && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsDrizzleDb = db;
}
