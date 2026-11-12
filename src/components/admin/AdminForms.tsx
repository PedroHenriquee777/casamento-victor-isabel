"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (json.ok) router.refresh();
      else setError(json.message ?? "Não foi possível entrar.");
    } catch {
      setError("Sem conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="t-eyebrow" style={{ fontSize: 11 }}>
          Senha
        </span>
        <input
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border bg-white px-4 py-3 text-[17px] outline-none focus:border-[var(--color-serenity-deep)]"
          style={{ borderColor: "var(--color-hairline)", color: "var(--color-ink)" }}
        />
      </label>
      {error && (
        <p role="alert" className="text-[15px]" style={{ color: "#8E4A62" }}>
          {error}
        </p>
      )}
      <button type="submit" className="pill pill-solid self-center" disabled={!password || busy}>
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

/** Atualizar e sair */
export function AdminActions() {
  const router = useRouter();
  const [pending, start] = useTransition();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="pill" onClick={() => start(() => router.refresh())} disabled={pending}>
        {pending ? "Atualizando…" : "Atualizar"}
      </button>
      <button type="button" className="ghost" onClick={() => void logout()}>
        Sair
      </button>
    </div>
  );
}
