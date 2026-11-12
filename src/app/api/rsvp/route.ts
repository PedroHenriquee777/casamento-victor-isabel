import { NextResponse } from "next/server";
import { getRepo } from "@/lib/repo";
import { rsvpBodySchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "UNKNOWN", message: "Requisição inválida." }, { status: 400 });
  }

  const parsed = rsvpBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: "UNKNOWN", message: "Dados inválidos." }, { status: 400 });
  }

  const repo = await getRepo();
  const result = await repo.submitRsvp(parsed.data);

  if (result.ok) return NextResponse.json(result);
  const status =
    result.code === "INVALID_TOKEN" ? 404 : result.code === "GIFT_UNAVAILABLE" ? 409 : result.code === "UNKNOWN" ? 500 : 422;
  return NextResponse.json(result, { status });
}
