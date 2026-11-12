import { NextResponse } from "next/server";
import { getRepo } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const repo = await getRepo();
  const payload = await repo.getInvite(token);
  if (!payload) return NextResponse.json({ ok: false, message: "Convite não encontrado." }, { status: 404 });
  return NextResponse.json({ ok: true, payload }, { headers: { "Cache-Control": "no-store" } });
}
