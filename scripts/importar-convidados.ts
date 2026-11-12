import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { newGuestToken } from "../src/lib/tokens";
import { LINKS_HEADER, dbTarget, linkRow } from "./links";

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes(";") ? ";" : ",";
  const header = lines[0].split(sep).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(sep).map((c) => c.trim());
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""]));
  });
}

async function main() {
  const file = process.argv[2];
  if (!file) throw new Error("Uso: npm run guests:import -- convidados.csv");
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Defina DATABASE_URL.");

  const rows = parseCsv(readFileSync(file, "utf8"));
  if (rows.length === 0) throw new Error("Nenhuma linha encontrada no CSV.");

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const out = [LINKS_HEADER];
  console.log(`Banco: ${dbTarget(connectionString)}\n`);

  try {
    for (const r of rows) {
      const name = r.nome;
      if (!name) continue;
      const isGodparent = /padrinho|madrinha|godparent/i.test(r.tipo ?? "");
      const role = /madrinha/i.test(r.papel ?? "") ? "MADRINHA" : "PADRINHO";
      const data = {
        name,
        kind: isGodparent ? ("GODPARENT" as const) : ("GUEST" as const),
        godparentRole: isGodparent ? (role as "PADRINHO" | "MADRINHA") : null,
        phone: r.telefone || null,
      };

      // Idempotente: quem já existe (mesmo nome) é atualizado e mantém o mesmo link.
      const existing = await prisma.guest.findFirst({
        where: { weddingId: "main", name: { equals: name, mode: "insensitive" } },
      });
      const guest = existing
        ? await prisma.guest.update({ where: { id: existing.id }, data })
        : await prisma.guest.create({ data: { ...data, weddingId: "main", token: newGuestToken() } });

      const row = linkRow(guest);
      out.push(row.line);
      console.log(`${existing ? "↺" : "✓"} ${name} → ${row.link}`);
    }
  } finally {
    await prisma.$disconnect();
  }

  writeFileSync("links-convidados.csv", out.join("\n") + "\n", "utf8");
  console.log(`\nArquivo gerado: links-convidados.csv (${out.length - 1} convites)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
