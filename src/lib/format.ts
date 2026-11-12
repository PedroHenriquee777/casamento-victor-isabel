import type { GodparentRole } from "./types";

export function eventParts(iso: string, timeZone: string) {
  const d = new Date(iso);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("pt-BR", { timeZone, ...o }).format(d);
  const time = fmt({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const [hh, mm] = time.split(":");
  return {
    day: fmt({ day: "2-digit" }),
    month: fmt({ month: "long" }),
    year: fmt({ year: "numeric" }),
    weekday: fmt({ weekday: "long" }),
    timeLabel: mm === "00" ? `${hh}h` : `${hh}h${mm}`,
    timeLabelFull: `${hh}h${mm}`,
  };
}

export const capitalize = (s: string) =>
  s ? s[0].toUpperCase() + s.slice(1) : s;

export function brl(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}

export function godparentWords(role: GodparentRole | null) {
  const f = role === "MADRINHA";
  return {
    papel: f ? "madrinha" : "padrinho",
    Papel: f ? "Madrinha" : "Padrinho",
    querido: f ? "Querida" : "Querido",
    papelPlural: f ? "madrinhas" : "padrinhos",
  };
}

export const firstName = (full: string) => full.trim().split(/\s+/)[0] ?? full;

export function initialOf(name: string): string {
  return name.trim().charAt(0).toLocaleUpperCase("pt-BR");
}

export function mapsRouteUrl(v: {
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
  mapsUrl?: string;
}) {
  if (v.mapsUrl) return v.mapsUrl;
  const dest =
    v.lat !== undefined && v.lng !== undefined
      ? `${v.lat},${v.lng}`
      : `${v.name}, ${v.address}, ${v.city}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export function mapsEmbedUrl(v: {
  name: string;
  address: string;
  city: string;
  lat?: number;
  lng?: number;
}) {
  const q =
    v.lat !== undefined && v.lng !== undefined
      ? `${v.lat},${v.lng}`
      : `${v.name}, ${v.address}, ${v.city}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
}

export function coordsLabel(lat: number, lng: number) {
  const dms = (v: number) => {
    const t = Math.round(Math.abs(v) * 3600);
    return `${Math.floor(t / 3600)}°${String(Math.floor((t % 3600) / 60)).padStart(2, "0")}′${String(t % 60).padStart(2, "0")}″`;
  };
  return `${dms(lat)} ${lat < 0 ? "S" : "N"} · ${dms(lng)} ${lng < 0 ? "O" : "L"}`;
}
