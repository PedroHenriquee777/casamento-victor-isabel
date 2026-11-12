export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const csvCell = (s: string) => (/[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export const LINKS_HEADER = "nome;tipo;link;whatsapp";

export function linkRow(g: { name: string; token: string; kind: "GUEST" | "GODPARENT"; godparentRole: string | null; phone: string | null }) {
  const isGodparent = g.kind === "GODPARENT";
  const link = `${SITE}/c/${g.token}`;
  const firstName = g.name.split(" ")[0];
  const text = isGodparent
    ? `${firstName}, temos um convite muito especial para você ✨ Abra com carinho: ${link}`
    : `Oi, ${firstName}! Preparamos um convite especial para o nosso casamento 💙 Abra aqui: ${link}`;
  const wa = g.phone ? `https://wa.me/${g.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}` : "";
  const tipo = isGodparent ? (g.godparentRole ?? "PADRINHO").toLowerCase() : "convidado";
  return { link, line: [csvCell(g.name), tipo, link, wa].join(";") };
}

export function dbTarget(url: string) {
  try {
    const u = new URL(url);
    return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return "(DATABASE_URL inválida)";
  }
}
