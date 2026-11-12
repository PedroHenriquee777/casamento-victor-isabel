import "dotenv/config";
import { writeFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { LINKS_HEADER, dbTarget, linkRow } from "./links";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Defina DATABASE_URL.");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    console.log(`Banco: ${dbTarget(connectionString)}`);
    const [weddings, gifts, guests] = await Promise.all([
      prisma.wedding.count(),
      prisma.gift.count(),
      prisma.guest.findMany({ orderBy: { createdAt: "asc" }, include: { rsvp: true } }),
    ]);
    console.log(`Casamentos: ${weddings} · Presentes: ${gifts} · Convidados: ${guests.length}\n`);
    if (weddings === 0) console.log("⚠ Nenhum casamento no banco. Rode: npm run db:seed");
    if (guests.length === 0) {
      console.log("⚠ Nenhum convidado. Rode: npm run guests:import -- convidados.csv");
      return;
    }
    const out = [LINKS_HEADER];
    for (const g of guests) {
      const row = linkRow(g);
      out.push(row.line);
      const status = g.rsvp ? (g.rsvp.status === "CONFIRMED" ? "confirmou" : "recusou") : g.openedAt ? "abriu" : "—";
      console.log(`${g.name.padEnd(28)} ${status.padEnd(10)} ${row.link}`);
    }
    writeFileSync("links-convidados.csv", out.join("\n") + "\n", "utf8");
    console.log(`\nArquivo gerado: links-convidados.csv (${guests.length} convites)`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
