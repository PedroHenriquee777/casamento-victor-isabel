import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

const g = globalThis as unknown as { __prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!g.__prisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL não definida.");
    const pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
      keepAlive: true,
    });
    pool.on("error", (e) => console.warn("[db] conexão encerrada pelo servidor (será reaberta):", e.message));
    g.__prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  }
  return g.__prisma;
}
