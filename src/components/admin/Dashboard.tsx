import type { ReactNode } from "react";
import type { AdminGiftRow, AdminGuestRow, AdminOverview } from "@/lib/types";

const INK = "var(--color-ink)";
const SOFT = "var(--color-ink-soft)";
const LINE = "var(--color-hairline)";

type Tone = "ok" | "no" | "wait" | "gift" | "full";
const TONES: Record<Tone, { bg: string; fg: string; border: string }> = {
  ok: { bg: "#e3ecfa", fg: "#33456b", border: "#a9b9d9" },
  no: { bg: "#f6e9ee", fg: "#8E4A62", border: "#dcb9c6" },
  wait: { bg: "#f1f3f7", fg: "#6b7791", border: "#d5dae5" },
  gift: { bg: "#ffffff", fg: "#33456b", border: "#a9b9d9" },
  full: { bg: "#f6e9ee", fg: "#8E4A62", border: "#dcb9c6" },
};

function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONES[tone];
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border px-3 py-[3px] font-sans text-[12.5px] leading-5"
      style={{ background: t.bg, color: t.fg, borderColor: t.border }}
    >
      {children}
    </span>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white/85 p-4 sm:p-6" style={{ borderColor: LINE }}>
      <h2 className="font-display text-[26px] font-medium leading-tight" style={{ color: INK }}>
        {title}
      </h2>
      {hint && (
        <p className="mt-1 font-sans text-[13.5px]" style={{ color: SOFT }}>
          {hint}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border bg-white/85 px-4 py-3" style={{ borderColor: LINE }}>
      <div className="font-display text-[34px] font-medium leading-none" style={{ color: INK }}>
        {value}
      </div>
      <div className="mt-1 font-sans text-[12px] uppercase tracking-[0.14em]" style={{ color: SOFT }}>
        {label}
      </div>
    </div>
  );
}

const when = (iso: string | null, tz: string) =>
  iso
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date(iso))
    : null;

function Row({ children }: { children: ReactNode }) {
  return (
    <li className="flex flex-col gap-2 border-t py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6" style={{ borderColor: "rgba(169,185,217,.45)" }}>
      {children}
    </li>
  );
}

function GiftChips({ gifts, empty }: { gifts: { id: string; name: string }[]; empty: string }) {
  if (gifts.length === 0)
    return (
      <span className="font-sans text-[13.5px] italic" style={{ color: SOFT }}>
        {empty}
      </span>
    );
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {gifts.map((g) => (
        <li key={g.id}>
          <Chip tone="gift">{g.name}</Chip>
        </li>
      ))}
    </ul>
  );
}

const ROLE: Record<string, string> = { PADRINHO: "Padrinho", MADRINHA: "Madrinha" };

function Godparents({ rows, tz }: { rows: AdminGuestRow[]; tz: string }) {
  const rank = (g: AdminGuestRow) => (g.status === "CONFIRMED" ? 0 : g.status === null ? 1 : 2);
  const sorted = rows.slice().sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, "pt-BR"));
  if (sorted.length === 0) return <p className="font-sans text-[14px]" style={{ color: SOFT }}>Nenhum padrinho ou madrinha cadastrado.</p>;
  return (
    <ul className="m-0 list-none p-0">
      {sorted.map((g) => (
        <Row key={g.id}>
          <div className="min-w-0 sm:w-[44%]">
            <div className="font-display text-[21px] font-medium leading-tight" style={{ color: INK }}>
              {g.name}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {g.godparentRole && (
                <span className="font-sans text-[12px] uppercase tracking-[0.14em]" style={{ color: SOFT }}>
                  {ROLE[g.godparentRole]}
                </span>
              )}
              <Chip tone={g.status === "CONFIRMED" ? "ok" : g.status === "DECLINED" ? "no" : "wait"}>
                {g.status === "CONFIRMED" ? "Aceitou" : g.status === "DECLINED" ? "Não poderá comparecer" : "Sem resposta"}
              </Chip>
              {when(g.respondedAt, tz) && (
                <span className="font-sans text-[12px]" style={{ color: SOFT }}>
                  {when(g.respondedAt, tz)}
                </span>
              )}
            </div>
          </div>
          <div className="sm:flex-1">
            {g.status === "CONFIRMED" ? (
              <GiftChips gifts={g.gifts} empty="Ainda não escolheu presente" />
            ) : (
              <span className="font-sans text-[13.5px]" style={{ color: SOFT }}>
                —
              </span>
            )}
          </div>
        </Row>
      ))}
    </ul>
  );
}

function Guests({ rows, tz }: { rows: AdminGuestRow[]; tz: string }) {
  const confirmed = rows
    .filter((g) => g.status === "CONFIRMED")
    .sort((a, b) => Number(b.gifts.length > 0) - Number(a.gifts.length > 0) || a.name.localeCompare(b.name, "pt-BR"));
  const declined = rows.filter((g) => g.status === "DECLINED").sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const waiting = rows.filter((g) => g.status === null).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return (
    <>
      {confirmed.length === 0 ? (
        <p className="font-sans text-[14px]" style={{ color: SOFT }}>
          Ninguém confirmou presença ainda.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {confirmed.map((g) => (
            <Row key={g.id}>
              <div className="min-w-0 sm:w-[44%]">
                <div className="font-display text-[21px] font-medium leading-tight" style={{ color: INK }}>
                  {g.name}
                </div>
                {when(g.respondedAt, tz) && (
                  <div className="mt-1 font-sans text-[12px]" style={{ color: SOFT }}>
                    Confirmou em {when(g.respondedAt, tz)}
                  </div>
                )}
              </div>
              <div className="sm:flex-1">
                <GiftChips gifts={g.gifts} empty="Sem presente escolhido" />
              </div>
            </Row>
          ))}
        </ul>
      )}
      {[
        { label: "Não poderão comparecer", list: declined },
        { label: "Ainda sem resposta", list: waiting },
      ].map(
        ({ label, list }) =>
          list.length > 0 && (
            <details key={label} className="mt-4 rounded-xl border px-4 py-3" style={{ borderColor: LINE }}>
              <summary className="cursor-pointer font-sans text-[14px]" style={{ color: INK }}>
                {label} ({list.length})
              </summary>
              <p className="mt-2 font-sans text-[14px] leading-relaxed" style={{ color: SOFT }}>
                {list.map((g) => g.name).join(" · ")}
              </p>
            </details>
          ),
      )}
    </>
  );
}

function Gifts({ rows }: { rows: AdminGiftRow[] }) {
  const cats: { name: string; items: AdminGiftRow[] }[] = [];
  for (const r of rows) {
    const last = cats[cats.length - 1];
    if (last && last.name === r.category) last.items.push(r);
    else cats.push({ name: r.category, items: [r] });
  }
  return (
    <div className="flex flex-col gap-6">
      {cats.map((c) => (
        <div key={c.name}>
          <h3 className="t-eyebrow m-0" style={{ fontSize: 11.5 }}>
            {c.name || "Presentes"}
          </h3>
          <ul className="m-0 mt-2 list-none p-0">
            {c.items.map((g) => {
              const full = g.takenBy.length >= g.quantity;
              return (
                <Row key={g.id}>
                  <div className="flex min-w-0 items-center gap-3 sm:w-[44%]">
                    <span className="font-display text-[19px] font-medium leading-tight" style={{ color: INK }}>
                      {g.name}
                    </span>
                    <Chip tone={full ? "full" : g.takenBy.length > 0 ? "ok" : "wait"}>
                      {full ? "Esgotado" : `${g.takenBy.length}/${g.quantity}`}
                    </Chip>
                  </div>
                  <div className="font-sans text-[14px] sm:flex-1" style={{ color: g.takenBy.length ? INK : SOFT }}>
                    {g.takenBy.length ? g.takenBy.join(" · ") : <span className="italic">Ninguém ainda</span>}
                  </div>
                </Row>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ data, tz, actions }: { data: AdminOverview; tz: string; actions: ReactNode }) {
  const god = data.guests.filter((g) => g.kind === "GODPARENT");
  const common = data.guests.filter((g) => g.kind !== "GODPARENT");
  const confirmed = data.guests.filter((g) => g.status === "CONFIRMED").length;
  const declined = data.guests.filter((g) => g.status === "DECLINED").length;
  const waiting = data.guests.length - confirmed - declined;
  const godYes = god.filter((g) => g.status === "CONFIRMED").length;
  const commonYes = common.filter((g) => g.status === "CONFIRMED").length;
  const commonGifts = common.filter((g) => g.status === "CONFIRMED" && g.gifts.length > 0).length;
  const taken = data.gifts.reduce((n, g) => n + g.takenBy.length, 0);
  const capacity = data.gifts.reduce((n, g) => n + g.quantity, 0);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="t-eyebrow m-0" style={{ fontSize: 11.5 }}>
            Painel dos noivos
          </p>
          <h1 className="font-display mt-1 text-[38px] font-medium italic leading-none" style={{ color: INK }}>
            {data.couple}
          </h1>
        </div>
        {actions}
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={confirmed} label="Confirmaram" />
        <Stat value={declined} label="Não poderão ir" />
        <Stat value={waiting} label="Sem resposta" />
        <Stat value={`${taken}/${capacity}`} label="Presentes escolhidos" />
      </div>

      <Section title="Padrinhos e madrinhas" hint={`${godYes} de ${god.length} ${godYes === 1 ? "aceitou" : "aceitaram"} o convite`}>
        <Godparents rows={god} tz={tz} />
      </Section>

      <Section
        title="Convidados"
        hint={`${commonYes} ${commonYes === 1 ? "confirmou" : "confirmaram"} · ${commonGifts} ${commonGifts === 1 ? "já escolheu" : "já escolheram"} presente`}
      >
        <Guests rows={common} tz={tz} />
      </Section>

      <Section title="Presentes" hint="Quem escolheu cada presente, na ordem da lista.">
        <Gifts rows={data.gifts} />
      </Section>

      <p className="text-center font-sans text-[12px]" style={{ color: SOFT }}>
        Atualizado em {when(data.generatedAt, tz)}
      </p>
    </div>
  );
}
