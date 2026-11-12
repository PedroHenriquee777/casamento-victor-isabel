import type { CSSProperties, ReactNode } from "react";

const LINE = "#A9B9D9";
const LINE_DEEP = "#8CA0C9";

export function Divider({
  w = 40,
  className,
  style,
}: {
  w?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 120 12"
      className={`emboss-svg ${className ?? ""}`}
      style={{ width: `calc(var(--u) * ${w})`, height: "auto", ...style }}
      aria-hidden
    >
      <defs>
        <linearGradient id="dvL" x1="0" x2="1">
          <stop offset="0" stopColor={LINE} stopOpacity="0" />
          <stop offset="1" stopColor={LINE} />
        </linearGradient>
        <linearGradient id="dvR" x1="0" x2="1">
          <stop offset="0" stopColor={LINE} />
          <stop offset="1" stopColor={LINE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="2" y1="6" x2="52" y2="6" stroke="url(#dvL)" strokeWidth="1" />
      <line x1="68" y1="6" x2="118" y2="6" stroke="url(#dvR)" strokeWidth="1" />
      <path
        d="M60 1.6 L64.4 6 L60 10.4 L55.6 6 Z"
        fill="#ffffff"
        stroke={LINE_DEEP}
        strokeWidth="0.9"
      />
      <circle cx="51" cy="6" r="1.1" fill={LINE_DEEP} />
      <circle cx="69" cy="6" r="1.1" fill={LINE_DEEP} />
    </svg>
  );
}

export function Flourish({
  w = 30,
  className,
}: {
  w?: number;
  className?: string;
}) {
  const leaf = (x: number, y: number, a: number, s = 1) => (
    <path
      key={`${x}-${y}`}
      transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}
      d="M0 0 C 2.6 -1.2 4.6 -4.6 0 -8 C -4.6 -4.6 -2.6 -1.2 0 0 Z"
      fill="#EEF3FB"
      stroke={LINE_DEEP}
      strokeWidth="0.7"
    />
  );
  return (
    <svg
      viewBox="0 0 120 26"
      className={`emboss-svg ${className ?? ""}`}
      style={{ width: `calc(var(--u) * ${w})`, height: "auto" }}
      aria-hidden
    >
      <g fill="none" stroke={LINE_DEEP} strokeWidth="0.9" strokeLinecap="round">
        <path d="M56 14 C 46 14 42 8 33 9 C 25 10 20 15 10 14" />
        <path d="M64 14 C 74 14 78 8 87 9 C 95 10 100 15 110 14" />
      </g>
      {leaf(44, 11, -70)}
      {leaf(34, 9.5, -40, 0.9)}
      {leaf(24, 12.5, -20, 0.8)}
      {leaf(44, 15, 130, 0.9)}
      {leaf(30, 13.4, 150, 0.85)}
      {leaf(76, 11, 70)}
      {leaf(86, 9.5, 40, 0.9)}
      {leaf(96, 12.5, 20, 0.8)}
      {leaf(76, 15, -130, 0.9)}
      {leaf(90, 13.4, -150, 0.85)}
      <path
        d="M60 7.5 L64 13 L60 18.5 L56 13 Z"
        fill="#fff"
        stroke={LINE_DEEP}
        strokeWidth="0.9"
      />
      <circle cx="60" cy="13" r="1.5" fill="url(#orPearl)" />
      <defs>
        <radialGradient id="orPearl" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#B7C5E2" />
        </radialGradient>
      </defs>
    </svg>
  );
}

type Seg = [string, ...number[]];
const SEGS: Seg[] = [
  ["M", 100, 6],
  ["C", 118, 6, 128, 24, 150, 28],
  ["C", 176, 32, 192, 56, 192, 90],
  ["L", 192, 170],
  ["C", 192, 204, 176, 228, 150, 232],
  ["C", 128, 236, 118, 254, 100, 254],
  ["C", 82, 254, 72, 236, 50, 232],
  ["C", 24, 228, 8, 204, 8, 170],
  ["L", 8, 90],
  ["C", 8, 56, 24, 32, 50, 28],
  ["C", 72, 24, 82, 6, 100, 6],
  ["Z"],
];

/** Caminho do cartucho. 'v' = pontas em cima/embaixo; 'h' = pontas nas laterais. */
export function cartouchePath(
  W: number,
  H: number,
  orient: "v" | "h" = "v",
): string {
  const vx = orient === "v" ? W / 200 : H / 200;
  const vy = orient === "v" ? H / 260 : W / 260;
  return SEGS.map(([cmd, ...n]) => {
    if (cmd === "Z") return "Z";
    const out: number[] = [];
    for (let i = 0; i < n.length; i += 2) {
      const x = n[i];
      const y = n[i + 1];
      if (orient === "v") out.push(x * vx, y * vy);
      else out.push(y * vy, x * vx);
    }
    return cmd + out.map((v) => +v.toFixed(2)).join(" ");
  }).join(" ");
}

export function Cartouche({
  w,
  h,
  orient = "v",
  children,
  className,
  style,
  inner = true,
}: {
  w: number;
  h: number;
  orient?: "v" | "h";
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  inner?: boolean;
}) {
  const d = cartouchePath(w, h, orient);
  const tip =
    orient === "v"
      ? [
          [w / 2, h * 0.023],
          [w / 2, h * 0.977],
        ]
      : [
          [w * 0.023, h / 2],
          [w * 0.977, h / 2],
        ];
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ aspectRatio: `${w} / ${h}`, ...style }}
    >
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="emboss-svg absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="ctFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".92" />
            <stop offset="1" stopColor="#E9EFF9" stopOpacity=".78" />
          </linearGradient>
          <radialGradient id="ctPearl" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#AEBEDD" />
          </radialGradient>
        </defs>
        <path
          d={d}
          fill="url(#ctFill)"
          stroke={LINE_DEEP}
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />
        {inner && (
          <path
            d={d}
            transform={`translate(${w / 2} ${h / 2}) scale(${orient === "v" ? 0.9 : 0.93} ${orient === "v" ? 0.93 : 0.8}) translate(${-w / 2} ${-h / 2})`}
            fill="none"
            stroke={LINE}
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {tip.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={Math.min(w, h) * 0.022}
            fill="url(#ctPearl)"
            stroke={LINE_DEEP}
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
