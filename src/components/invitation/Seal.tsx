"use client";

import { motion } from "framer-motion";
import { u } from "@/lib/units";

function Engraved({ x, y, size, italic, children }: { x: number; y: number; size: number; italic?: boolean; children: string }) {
  const common = {
    textAnchor: "middle" as const,
    fontSize: size,
    fontStyle: italic ? ("italic" as const) : ("normal" as const),
    fontWeight: italic ? 500 : 600,
    style: { fontFamily: "var(--font-display)" },
  };
  return (
    <g>
      <text x={x - 0.8} y={y - 0.9} fill="#ffffff" opacity={0.95} {...common}>
        {children}
      </text>
      <text x={x + 0.7} y={y + 1} fill="#4E66A0" opacity={0.3} {...common}>
        {children}
      </text>
      <text x={x} y={y} fill="#6882B4" {...common}>
        {children}
      </text>
    </g>
  );
}

function Laurel({ mirror }: { mirror?: boolean }) {
  const cx = 60;
  const cy = 76;
  const rx = 38;
  const ry = 52;
  const N = 8;
  const leaves: React.ReactElement[] = [];
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const th = ((98 + t * 112) * Math.PI) / 180;
    const x = cx + rx * Math.cos(th);
    const y = cy + ry * Math.sin(th);
    pts.push([x, y]);
    const tx = -rx * Math.sin(th);
    const ty = ry * Math.cos(th);
    const base = (Math.atan2(tx, -ty) * 180) / Math.PI;
    const size = 1.05 - t * 0.28;
    for (const off of [-38, 38]) {
      leaves.push(
        <path
          key={`${i}${off}`}
          transform={`translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(base + off).toFixed(1)}) scale(${size.toFixed(2)})`}
          d="M0 0 C 3.4 -2 5.2 -7.4 0 -12.5 C -5.2 -7.4 -3.4 -2 0 0 Z"
          fill="#EAF0FA"
          stroke="#8CA0C9"
          strokeWidth="0.7"
        />,
      );
    }
  }
  const stem = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <g transform={mirror ? "translate(120 0) scale(-1 1)" : undefined}>
      <path d={stem} fill="none" stroke="#8CA0C9" strokeWidth="0.9" strokeLinecap="round" />
      {leaves}
    </g>
  );
}

export function SealArt({ initials }: { initials: [string, string] }) {
  return (
    <svg
      viewBox="0 0 120 150"
      className="h-full w-full"
      style={{
        overflow: "visible",
        filter: "drop-shadow(0 3px 5px rgba(60,84,140,.3)) drop-shadow(-0.7px -0.7px 0 rgba(255,255,255,.95))",
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="sealRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".55" stopColor="#EDF2FA" />
          <stop offset="1" stopColor="#C6D4EC" />
        </linearGradient>
        <radialGradient id="sealFace" cx=".36" cy=".28" r=".95">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".6" stopColor="#F2F6FC" />
          <stop offset="1" stopColor="#DAE4F4" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="75" rx="57" ry="72" fill="url(#sealRim)" stroke="#B3C3E1" strokeWidth="1" />
      <ellipse cx="60" cy="75" rx="49" ry="64" fill="url(#sealFace)" stroke="#BCCAE6" strokeWidth="1" />
      <ellipse cx="60" cy="75" rx="49" ry="64" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity=".9" transform="translate(-.7 -.9)" />
      <ellipse cx="60" cy="75" rx="43" ry="58" fill="none" stroke="#A9B9D9" strokeWidth="1.1" strokeDasharray="0.1 3.6" strokeLinecap="round" />
      <Laurel />
      <Laurel mirror />
      <Engraved x={38} y={91} size={40}>
        {initials[0]}
      </Engraved>
      <Engraved x={60} y={86} size={21} italic>
        &
      </Engraved>
      <Engraved x={83} y={91} size={40}>
        {initials[1]}
      </Engraved>
      <path d="M52 36 L60 29 L68 36 L60 43 Z" fill="#fff" stroke="#8CA0C9" strokeWidth=".8" />
    </svg>
  );
}

export function Seal({
  initials,
  onPress,
  interactive = true,
}: {
  initials: [string, string];
  onPress: () => void;
  interactive?: boolean;
}) {
  return (
    <div className="relative" style={{ width: u(25), height: u(31.25) }}>
      {interactive && (
        <>
          <span className="seal-ring pointer-events-none absolute inset-0 rounded-[50%] border border-serenity" />
          <span
            className="seal-ring pointer-events-none absolute inset-0 rounded-[50%] border border-serenity"
            style={{ animationDelay: "1.4s" }}
          />
        </>
      )}
      <motion.button
        type="button"
        aria-label="Abrir convite"
        onClick={onPress}
        disabled={!interactive}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        className="absolute inset-0 cursor-pointer rounded-[50%]"
        style={{ touchAction: "manipulation" }}
      >
        <SealArt initials={initials} />
      </motion.button>
    </div>
  );
}
