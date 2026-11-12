import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "convite_admin";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

const sha = (v: string) => createHash("sha256").update(v).digest();
const sign = (v: string) =>
  createHmac(
    "sha256",
    process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "",
  )
    .update(v)
    .digest("base64url");

const safeEqual = (a: Buffer, b: Buffer) =>
  a.length === b.length && timingSafeEqual(a, b);

export function passwordOk(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(sha(input), sha(expected));
}

export function createSession(): string {
  const exp = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS);
  return `${exp}.${sign(exp)}`;
}

export function sessionOk(value: string | undefined): boolean {
  if (!value || !adminEnabled()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(Buffer.from(sig), Buffer.from(sign(exp)));
}

const g = globalThis as unknown as { __adminFails?: Map<string, number[]> };
const fails: Map<string, number[]> = (g.__adminFails ??= new Map<
  string,
  number[]
>());
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 6;

export function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (fails.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  fails.set(ip, recent);
  return recent.length >= MAX_FAILS;
}
export function registerFailure(ip: string) {
  fails.set(ip, [...(fails.get(ip) ?? []), Date.now()]);
}
export function clearFailures(ip: string) {
  fails.delete(ip);
}
