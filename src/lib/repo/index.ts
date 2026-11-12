import { memoryRepo } from "./memory";
import type { InviteRepo } from "./types";

export const isDemoMode = () => !process.env.DATABASE_URL;

export async function getRepo(): Promise<InviteRepo> {
  if (process.env.DATABASE_URL) {
    const { prismaRepo } = await import("./prisma");
    return prismaRepo;
  }
  return memoryRepo;
}
