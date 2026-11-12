import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  adminEnabled,
  clearFailures,
  createSession,
  passwordOk,
  registerFailure,
  tooManyAttempts,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminEnabled()) {
    return NextResponse.json({ ok: false, message: "O painel está desativado (falta ADMIN_PASSWORD)." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooManyAttempts(ip)) {
    return NextResponse.json({ ok: false, message: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requisição inválida." }, { status: 400 });
  }

  if (!passwordOk(password)) {
    registerFailure(ip);
    await new Promise((r) => setTimeout(r, 400)); // desacelera tentativas em série
    return NextResponse.json({ ok: false, message: "Senha incorreta." }, { status: 401 });
  }

  clearFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return res;
}
