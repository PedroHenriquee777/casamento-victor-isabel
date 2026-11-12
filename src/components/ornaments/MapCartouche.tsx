import { u } from "@/lib/units";
import { cartouchePath } from "./Ornaments";

const W = 200;
const H = 236;
const LINE = "#8CA0C9";

function MapIllustration({
  street,
  marker,
  coordsLabel,
}: {
  street?: string;
  marker: "church" | "pin";
  coordsLabel?: string;
}) {
  const road = (d: string, w: number) => (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#D2DDEF" strokeWidth={w + 3} />
      <path d={d} stroke="#FFFFFF" strokeWidth={w} />
    </g>
  );
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="pinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6F89BD" />
          <stop offset="1" stopColor="#35508A" />
        </linearGradient>
        <path
          id="roadLabel"
          d="M-10 126 C 40 110 90 140 150 118 S 205 106 215 108"
        />
      </defs>
      <rect width={W} height={H} fill="#EEF3FA" />
      {[
        [6, 14, 26, 36],
        [46, 12, 38, 38],
        [8, 70, 26, 24],
        [48, 66, 34, 20],
        [104, 20, 38, 30],
        [158, 22, 36, 28],
        [158, 68, 36, 22],
        [10, 126, 22, 16],
        [104, 138, 36, 16],
        [160, 128, 34, 18],
        [6, 160, 28, 30],
        [48, 160, 36, 30],
        [98, 160, 44, 30],
        [158, 160, 38, 30],
        [48, 204, 36, 30],
        [98, 204, 44, 30],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#E2EAF6" />
      ))}
      {road("M92 -10 L 86 250", 6)}
      {road("M150 -10 C 148 40 160 80 152 250", 6)}
      {road("M38 -10 C 46 40 30 90 40 250", 6)}
      {road("M-10 56 L 215 64", 5)}
      {road("M-10 150 C 60 144 140 154 215 146", 5)}
      {road("M-10 197 C 60 191 140 201 215 193", 5)}
      {road("M-10 112 C 40 96 90 126 150 104 S 205 92 215 94", 10)}
      {street && (
        <text
          fontSize="6.6"
          letterSpacing="1.1"
          fill="#5F79AD"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <textPath href="#roadLabel" startOffset="50%">
            {street.toUpperCase()}
          </textPath>
        </text>
      )}

      <g transform="translate(172 44)">
        <circle
          r="8.5"
          fill="#fff"
          opacity=".92"
          stroke="#C4D1EA"
          strokeWidth=".8"
        />
        <path d="M0 -6.2 L2.6 2.4 L0 0.8 L-2.6 2.4 Z" fill="#5A73A6" />
        <text
          y="7"
          fontSize="4"
          textAnchor="middle"
          fill="#5A73A6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          N
        </text>
      </g>

      <g transform="translate(106 108)">
        <circle
          r="12"
          fill="none"
          stroke="#5A73A6"
          strokeWidth="1.4"
          style={{
            animation: "pin-pulse 2.4s ease-out infinite",
            transformBox: "fill-box",
            transformOrigin: "center",
          }}
        />
        <ellipse cy="1.5" rx="8" ry="3" fill="#2D4278" opacity=".28" />
        <path
          d="M0 0 C -9 -10 -14 -16 -14 -24 C -14 -32 -8 -38 0 -38 C 8 -38 14 -32 14 -24 C 14 -16 9 -10 0 0 Z"
          fill="url(#pinGrad)"
          stroke="#2F477F"
          strokeWidth="1"
        />
        <circle cy="-24" r={marker === "church" ? 8.8 : 5.6} fill="#fff" />
        {marker === "church" ? (
          <g fill="#35508A">
            <rect x="-0.6" y="-31.4" width="1.2" height="4.8" />
            <rect x="-1.9" y="-30" width="3.8" height="1.1" />
            <polygon points="-5.4,-22.4 0,-27.2 5.4,-22.4" />
            <rect x="-4.2" y="-22.4" width="8.4" height="5.2" />
            <path
              d="M-1.3 -17.2 V-19.7 a1.3 1.3 0 0 1 2.6 0 V-17.2 Z"
              fill="#fff"
            />
          </g>
        ) : (
          <ellipse
            cx="-5"
            cy="-31"
            rx="3"
            ry="2"
            fill="#fff"
            opacity=".35"
            transform="rotate(-30 -5 -31)"
          />
        )}
      </g>

      {coordsLabel && (
        <g>
          <rect
            x="34"
            y="173"
            width="132"
            height="15"
            rx="7.5"
            fill="#fff"
            opacity=".92"
            stroke="#D2DDEF"
            strokeWidth=".8"
          />
          <text
            x="100"
            y="183.2"
            fontSize="5.8"
            letterSpacing=".7"
            textAnchor="middle"
            fill="#5A73A6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {coordsLabel}
          </text>
        </g>
      )}
    </svg>
  );
}

export function MapCartouche({
  mode,
  embedUrl,
  title,
  width = 46,
  street,
  marker = "pin",
  coordsLabel,
}: {
  mode: "illustrated" | "embed";
  embedUrl?: string;
  title: string;
  width?: number;
  street?: string;
  marker?: "church" | "pin";
  coordsLabel?: string;
}) {
  const outer = cartouchePath(W, H, "v");
  return (
    <div
      className="relative"
      style={{ width: u(width), aspectRatio: `${W} / ${H}` }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="emboss-svg absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="mcPearl" cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#AEBEDD" />
          </radialGradient>
        </defs>
        <path
          d={outer}
          fill="#fff"
          stroke={LINE}
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={W / 2}
          cy={H * 0.023}
          r="4"
          fill="url(#mcPearl)"
          stroke={LINE}
          strokeWidth=".6"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={W / 2}
          cy={H * 0.977}
          r="4"
          fill="url(#mcPearl)"
          stroke={LINE}
          strokeWidth=".6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="mapClip" clipPathUnits="objectBoundingBox">
            <path d={cartouchePath(100, 100, "v")} transform="scale(.01)" />
          </clipPath>
        </defs>
      </svg>
      <div
        className="absolute overflow-hidden"
        style={{ inset: "5.2% 6.2%", clipPath: "url(#mapClip)" }}
      >
        {mode === "embed" && embedUrl ? (
          <>
            <iframe
              src={embedUrl}
              title={`Mapa: ${title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none absolute inset-0 h-full w-full border-0"
              style={{ filter: "saturate(.55) contrast(.96) hue-rotate(8deg)" }}
            />
            <div
              className="absolute inset-0"
              style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,.7)" }}
            />
          </>
        ) : (
          <MapIllustration
            street={street}
            marker={marker}
            coordsLabel={coordsLabel}
          />
        )}
      </div>
    </div>
  );
}
