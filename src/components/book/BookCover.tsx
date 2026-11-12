"use client";

import { SealArt } from "../invitation/Seal";
import { b } from "./BookPages";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .16  0 0 0 0 .24  0 0 0 0 .5  0 0 0 .3 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export const CLOTH =
  "linear-gradient(158deg, #9fb4de 0%, #8199ca 42%, #6a84b8 100%)";

function FoilDivider() {
  return (
    <svg
      viewBox="0 0 120 12"
      style={{
        width: b(30),
        overflow: "visible",
        filter:
          "drop-shadow(0 -0.6px 0 rgba(40,60,110,.45)) drop-shadow(0 0.8px 0 rgba(255,255,255,.35))",
      }}
      aria-hidden
    >
      <path
        d="M2 6H50M70 6H118"
        stroke="#fff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".9"
      />
      <path
        d="M60 1.6 64.4 6 60 10.4 55.6 6Z"
        fill="none"
        stroke="#fff"
        strokeWidth="1"
      />
      <circle cx="60" cy="6" r="1.1" fill="#fff" />
    </svg>
  );
}

export function BookCoverArt({ initials }: { initials: [string, string] }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        borderRadius: `${b(0.9)} ${b(2.4)} ${b(2.4)} ${b(0.9)}`,
        background: `${GRAIN}, repeating-linear-gradient(0deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(40,60,110,.05) 0 1px, transparent 1px 3px), ${CLOTH}`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.45), inset 0 -2px 3px rgba(34,52,102,.35), inset -2px 0 4px rgba(34,52,102,.22)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, rgba(255,255,255,.3) 0%, rgba(255,255,255,0) 42%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: b(8),
          background:
            "linear-gradient(90deg, rgba(34,52,102,.45) 0, rgba(34,52,102,.12) 55%, rgba(255,255,255,.12) 62%, rgba(34,52,102,.14) 70%, rgba(34,52,102,0) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{
          left: b(6.2),
          width: 1,
          background: "rgba(30,48,98,.38)",
          boxShadow: "1px 0 0 rgba(255,255,255,.3)",
        }}
      />

      <div
        className="pointer-events-none absolute"
        style={{
          inset: `${b(5)} ${b(5)} ${b(5)} ${b(10.4)}`,
          borderRadius: b(2),
          border: "1px solid rgba(255,255,255,.62)",
          boxShadow:
            "0 1px 0 rgba(34,52,102,.3), inset 0 1px 0 rgba(34,52,102,.28)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          inset: `${b(6.8)} ${b(6.8)} ${b(6.8)} ${b(12.2)}`,
          borderRadius: b(1.4),
          border: "1px solid rgba(255,255,255,.34)",
        }}
      />

      <img
        src="/art/corner-tl.webp"
        alt=""
        draggable={false}
        className="pointer-events-none absolute"
        style={{ left: b(6), top: b(-1), width: b(70), opacity: 0.96 }}
      />
      <img
        src="/art/corner-br.webp"
        alt=""
        draggable={false}
        className="pointer-events-none absolute"
        style={{ right: b(-4), bottom: b(-3), width: b(52), opacity: 0.96 }}
      />

      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{ inset: `${b(14)} ${b(8)} ${b(14)} ${b(13)}` }}
      >
        <div style={{ width: b(19), aspectRatio: "120 / 150" }}>
          <SealArt initials={initials} />
        </div>
        <FoilDivider />
        <h2
          className="font-display italic"
          style={{
            marginTop: b(3.2),
            fontSize: `max(22px, ${b(10.2)})`,
            lineHeight: 1.02,
            fontWeight: 500,
            color: "#fff",
            textShadow:
              "0 -1px 0 rgba(34,52,102,.55), 0 1px 0 rgba(255,255,255,.4), 0 2px 5px rgba(34,52,102,.3)",
          }}
        >
          Lista de
          <br />
          presentes
        </h2>
      </div>
    </div>
  );
}
