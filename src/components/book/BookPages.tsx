"use client";

import type { CSSProperties, ReactNode } from "react";
import type { GiftView } from "@/lib/types";
import { SealArt } from "../invitation/Seal";
import { Icon } from "../ornaments/Icons";
import { Divider, Flourish } from "../ornaments/Ornaments";
import { GiftArt } from "./GiftGlyph";
import type { BookSection } from "./paginate";

export const b = (n: number) => `calc(var(--bu) * ${n})`;

export interface BookMetrics {
  rowH: number;
  headerH: number;
}

const INK = "#33456b";

export function PageSheet({
  children,
  number,
  footerLeft,
}: {
  children: ReactNode;
  number: number;
  footerLeft?: ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderRadius: `${b(0.4)} ${b(1.6)} ${b(1.6)} ${b(0.4)}`,
        backgroundColor: "#fbfcfe",
        backgroundImage: "url(/art/paper.webp)",
        backgroundSize: "260px 260px",
        boxShadow:
          "inset 0 0 0 1px rgba(169,185,217,.45), inset -1px 0 0 rgba(255,255,255,.9)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: b(9),
          background:
            "linear-gradient(90deg, rgba(62,84,138,.26) 0, rgba(62,84,138,.1) 28%, rgba(62,84,138,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: `${b(3)} ${b(3)} ${b(3)} ${b(5)}`,
          border: "1px solid rgba(169,185,217,.5)",
          borderRadius: b(1.2),
        }}
      />
      <div
        className="absolute flex flex-col"
        style={{ inset: `${b(5.4)} ${b(6.4)} ${b(6.6)} ${b(8.6)}` }}
      >
        {children}
      </div>
      <div
        className="pointer-events-none absolute flex items-center justify-between"
        style={{ left: b(8.6), right: b(6.4), bottom: b(3.7), height: b(3.2) }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: `max(11px, ${b(3)})`,
            color: "#6f82ad",
            minWidth: b(10),
          }}
        >
          {footerLeft}
        </span>
        <span
          className="font-display italic"
          style={{
            fontSize: `max(12px, ${b(3.3)})`,
            color: "#6f82ad",
            fontVariantNumeric: "lining-nums",
          }}
        >
          {number}
        </span>
        <span style={{ minWidth: b(10) }} />
      </div>
    </div>
  );
}

const SWATCHES: { label: string; style: CSSProperties }[] = [
  {
    label: "Branco",
    style: {
      background: "radial-gradient(circle at 35% 30%, #ffffff, #eef1f6)",
      boxShadow: "inset 0 0 0 1px rgba(20,30,50,.55)",
    },
  },
  {
    label: "Preto",
    style: {
      background: "radial-gradient(circle at 35% 30%, #3a3d46, #0b0c0f)",
      boxShadow: "inset 0 0 0 1px rgba(20,30,50,.9)",
    },
  },
  {
    label: "Inox",
    style: {
      background:
        "linear-gradient(115deg, #eef0f3 0%, #b4bac3 28%, #f7f8fa 48%, #9ea5b0 70%, #dde1e6 100%)",
      boxShadow: "inset 0 0 0 1px rgba(20,30,50,.55)",
    },
  },
  {
    label: "Bambu",
    style: {
      background:
        "repeating-linear-gradient(90deg, rgba(150,98,40,.16) 0 1px, rgba(255,255,255,0) 1px 6px), linear-gradient(180deg, #e8c88f, #d9b073)",
      boxShadow: "inset 0 0 0 1px rgba(20,30,50,.55)",
    },
  },
];

export function IntroPage({
  max,
  number,
}: {
  max: number | null;
  number: number;
}) {
  return (
    <PageSheet number={number}>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Flourish w={22} />
        <h2
          className="t-title emboss"
          style={{ fontSize: `max(21px, ${b(8.6)})`, marginTop: b(3) }}
        >
          Lista de presentes
        </h2>
        <p
          className="t-small italic"
          style={{
            marginTop: b(2.4),
            maxWidth: b(62),
            fontSize: `max(13px, ${b(3.9)})`,
            lineHeight: 1.3,
          }}
        >
          {max === null
            ? "Escolha quantos quiser"
            : `Escolha até ${max} ${max === 1 ? "presente" : "presentes"}`}{" "}
          — é opcional.
        </p>
        <Divider w={20} style={{ marginTop: b(4.6) }} />
        <p
          className="t-eyebrow"
          style={{
            marginTop: b(4.2),
            fontSize: `max(9.5px, ${b(2.8)})`,
            letterSpacing: ".26em",
            paddingLeft: ".26em",
          }}
        >
          Cores indicadas
        </p>
        <p
          className="t-small italic"
          style={{
            marginTop: b(1.8),
            maxWidth: b(66),
            fontSize: `max(12.5px, ${b(3.6)})`,
            lineHeight: 1.3,
          }}
        >
          Indicamos que os presentes sejam nestas cores.
        </p>
        <div
          className="flex items-start justify-center"
          style={{ marginTop: b(3), gap: b(3.6) }}
        >
          {SWATCHES.map((s) => (
            <figure
              key={s.label}
              className="m-0 flex flex-col items-center"
              style={{ gap: b(1.5) }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: `max(34px, ${b(11)})`,
                  height: `max(34px, ${b(11)})`,
                  ...s.style,
                }}
              />
              <figcaption
                className="font-display"
                style={{
                  fontSize: `max(12.5px, ${b(3.5)})`,
                  color: INK,
                  fontWeight: 500,
                }}
              >
                {s.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </PageSheet>
  );
}

function Slots({ gift, selected }: { gift: GiftView; selected: boolean }) {
  const others = gift.quantity - gift.remaining - (gift.reservedByMe ? 1 : 0);
  const filled = Math.min(gift.quantity, others + (selected ? 1 : 0));
  return (
    <span
      className="flex items-center"
      style={{ gap: 4, marginTop: b(1.1) }}
      aria-hidden
    >
      {Array.from({ length: gift.quantity }, (_, i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{
            width: `max(6px, ${b(1.9)})`,
            height: `max(6px, ${b(1.9)})`,
            border: "1px solid #8CA0C9",
            background:
              i < filled
                ? "radial-gradient(circle at 35% 30%, #8AA2D2, #566FA5)"
                : "#fff",
          }}
        />
      ))}
    </span>
  );
}

function GiftRow({
  gift,
  selected,
  blocked,
  rowH,
  onToggle,
}: {
  gift: GiftView;
  selected: boolean;
  blocked: boolean;
  rowH: number;
  onToggle: () => void;
}) {
  const soldOut = !gift.available;
  const dim = soldOut || (blocked && !selected);
  const state = soldOut ? "esgotado" : selected ? "escolhido" : "disponível";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-disabled={dim}
      aria-label={`${gift.name}, ${state}${gift.quantity > 1 && !soldOut ? `, ${gift.remaining} de ${gift.quantity} escolhas livres` : ""}`}
      disabled={soldOut}
      onClick={onToggle}
      className="grid w-full shrink-0 cursor-pointer items-center text-left disabled:cursor-default"
      style={{
        height: rowH,
        gridTemplateColumns: `max(30px, ${b(10.4)}) minmax(0, 1fr) auto`,
        columnGap: b(3),
        padding: `0 ${b(1.2)}`,
        borderBottom: "1px solid rgba(169,185,217,.42)",
        background: selected
          ? "linear-gradient(90deg, rgba(146,168,209,0) 0%, rgba(146,168,209,.2) 35%, rgba(146,168,209,0) 100%)"
          : undefined,
        opacity: dim ? 0.52 : 1,
        transition: "opacity .3s, background .3s",
        touchAction: "manipulation",
      }}
    >
      <span
        className="relative grid place-items-center overflow-hidden rounded-full"
        style={{
          width: `max(30px, ${b(10.4)})`,
          height: `max(30px, ${b(10.4)})`,
          border: "1px solid #8CA0C9",
          background: "#fff",
          boxShadow:
            "0 0 0 2px #fff, 0 0 0 3px rgba(169,185,217,.7), 0 2px 5px rgba(70,95,150,.16)",
          filter: soldOut ? "grayscale(.7)" : undefined,
        }}
      >
        <GiftArt
          src={gift.imageUrl}
          className="block"
          style={{ width: "72%", height: "72%" }}
        />
      </span>

      <span className="block min-w-0">
        <span
          className="font-display block"
          style={{
            fontSize: `max(14px, ${b(4.3)})`,
            fontWeight: selected ? 700 : 600,
            color: soldOut ? "#6f7f9f" : INK,
            lineHeight: 1.08,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {gift.name}
        </span>
        {gift.description && (
          <span
            className="t-small block italic"
            style={{ fontSize: `max(11.5px, ${b(3)})`, lineHeight: 1.2 }}
          >
            {gift.description}
          </span>
        )}
        {gift.quantity > 1 && !soldOut && (
          <Slots gift={gift} selected={selected} />
        )}
      </span>

      {soldOut ? (
        <span
          className="t-eyebrow rounded-full"
          style={{
            fontSize: `max(8.5px, ${b(2.3)})`,
            letterSpacing: ".14em",
            padding: "3px 7px 3px 9px",
            border: "1px solid rgba(140,160,201,.8)",
            color: "#6f7f9f",
          }}
        >
          Esgotado
        </span>
      ) : (
        <span
          className="emboss-svg grid place-items-center rounded-full"
          style={{
            width: `max(24px, ${b(6.6)})`,
            height: `max(24px, ${b(6.6)})`,
            border: "1px solid #8CA0C9",
            background: selected
              ? "radial-gradient(circle at 35% 30%, #8AA2D2, #566FA5)"
              : "#fff",
            transition: "background .3s",
          }}
        >
          {selected && (
            <Icon name="check" size="70%" stroke={2.2} className="text-white" />
          )}
        </span>
      )}
    </button>
  );
}

export function GiftsPage({
  sections,
  number,
  selected,
  selectedCount,
  max,
  metrics,
  onToggle,
}: {
  sections: BookSection[];
  number: number;
  selected: ReadonlySet<string>;
  selectedCount: number;
  max: number | null;
  metrics: BookMetrics;
  onToggle: (id: string) => void;
}) {
  const reached = max !== null && selectedCount >= max;
  return (
    <PageSheet
      number={number}
      footerLeft={
        max !== null ? (
          <span
            className="inline-flex items-center"
            style={{ gap: 4 }}
            aria-label={`${selectedCount} de ${max} presentes escolhidos`}
          >
            <Icon name="gift" size={12} stroke={1.3} />
            {selectedCount}/{max}
          </span>
        ) : null
      }
    >
      <div className="flex h-full flex-col justify-center">
        {sections.map((s) => (
          <section
            key={s.category}
            className="flex flex-col"
            aria-label={s.category}
          >
            <header
              className="flex shrink-0 flex-col items-center justify-center text-center"
              style={{ height: metrics.headerH }}
            >
              <h3
                className="font-display italic"
                style={{
                  fontSize: `max(15px, ${b(4.7)})`,
                  color: INK,
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                {s.category}
              </h3>
              <Divider w={15} style={{ marginTop: b(0.8) }} />
            </header>
            {s.gifts.map((g) => (
              <GiftRow
                key={g.id}
                gift={g}
                selected={selected.has(g.id)}
                blocked={reached}
                rowH={metrics.rowH}
                onToggle={() => onToggle(g.id)}
              />
            ))}
          </section>
        ))}
      </div>
    </PageSheet>
  );
}

export function ClosingPage({
  initials,
  chosen,
  max,
  number,
}: {
  initials: [string, string];
  chosen: string[];
  max: number | null;
  number: number;
}) {
  return (
    <PageSheet number={number}>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Flourish w={22} />
        <div
          style={{ width: b(26), aspectRatio: "120 / 150", marginTop: b(3) }}
        >
          <SealArt initials={initials} />
        </div>
        <Divider w={20} style={{ marginTop: b(4) }} />
        {chosen.length > 0 && (
          <div
            className="soft-scroll w-full"
            style={{ marginTop: b(3.4), maxHeight: b(30) }}
          >
            <p
              className="t-eyebrow"
              style={{
                fontSize: `max(9px, ${b(2.5)})`,
                letterSpacing: ".22em",
                paddingLeft: ".22em",
              }}
            >
              Presentes escolhidos
              {max !== null ? ` · ${chosen.length}/${max}` : ""}
            </p>
            <ul className="m-0 list-none p-0" style={{ marginTop: b(1.6) }}>
              {chosen.map((n) => (
                <li
                  key={n}
                  className="font-display italic"
                  style={{
                    fontSize: `max(14px, ${b(4.2)})`,
                    color: INK,
                    lineHeight: 1.3,
                  }}
                >
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageSheet>
  );
}
