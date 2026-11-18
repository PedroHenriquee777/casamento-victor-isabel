import type { CSSProperties, ReactElement } from "react";

const S = "#5A73A6";
const D = "#8CA0C9";
const L = "#F6F8FC";
const M = "#D3DDF0";

const glyphs: Record<string, ReactElement> = {
  blender: (
    <>
      <path d="M16 7h16l-2.4 21H18.4Z" fill={L} />
      <path d="M14.5 7h19" />
      <rect x="16" y="28" width="16" height="9" rx="2" fill={M} />
      <path d="M20 32.5h3M26 32.5h2.5" stroke={D} />
      <path d="M13 40.5h22" />
      <path d="M32 12h3.5q2 0 2 2v5q0 2-2 2H31" />
    </>
  ),
  coffee: (
    <>
      <path d="M32 11h6v26h-6" fill={L} />
      <rect x="10" y="7" width="22" height="9" rx="2" fill={L} />
      <path d="M20.5 16v4" stroke={D} />
      <path d="M13 22h15l-1 15H14Z" fill={M} />
      <path d="M28 25q5 0 4.5 5t-5 4.5" />
      <path d="M13.8 30h13.4" stroke={L} />
      <rect x="9" y="37" width="30" height="4" rx="1.5" fill={L} />
    </>
  ),
  pots: (
    <>
      <path
        d="M31 16h13v10a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 31 26Z"
        fill={M}
      />
      <path d="M30 16h15" />
      <path d="M7 25h22v10a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3Z" fill={L} />
      <path d="M6 25h24M16 22h4" />
      <path d="M3.5 29H7M29 29h3.5" />
    </>
  ),
  cutlery: (
    <>
      <path d="M10.5 7v7M13.5 7v7M16.5 7v7M10.5 14q0 4 3 4t3-4M13.5 18v23" />
      <path d="M23 7c3 3 4 9 3 16h-3Z" fill={L} />
      <path d="M23 23v18h3V23" />
      <ellipse cx="36" cy="13.5" rx="4.5" ry="6.5" fill={L} />
      <path d="M36 20v21" />
    </>
  ),
  glasses: (
    <>
      <path d="M9 11h14l-1.6 27H10.6Z" fill={L} />
      <path d="M9.7 19h12.6" stroke={D} />
      <path d="M26 17h14l-1.6 21h-10.8Z" fill={L} />
      <path d="M26.6 24h12.8" stroke={D} />
    </>
  ),
  plates: (
    <>
      <ellipse cx="24" cy="32" rx="17" ry="6" fill={L} />
      <ellipse cx="24" cy="27" rx="17" ry="6" fill={L} />
      <ellipse cx="24" cy="22" rx="17" ry="6" fill={L} />
      <ellipse cx="24" cy="22" rx="10.5" ry="3.4" fill={M} />
    </>
  ),
  cups: (
    <>
      <ellipse cx="20.5" cy="35.5" rx="14" ry="3.2" fill={M} />
      <path d="M30 20h2.5a4 4 0 0 1 0 8H29" />
      <path d="M11 17h19v7a9.5 9.5 0 0 1-19 0Z" fill={L} />
      <path d="M16 8.5q2 2 0 4M22 8.5q2 2 0 4" stroke={D} />
    </>
  ),
  standmixer: (
    <>
      <path d="M12 9h15a8 8 0 0 1 8 8v24h-6.5V19H12Z" fill={L} />
      <path d="M9 41h28" />
      <path d="M18 19v6" />
      <path d="M9 25h20l-2.5 13h-15Z" fill={M} />
    </>
  ),
  microwave: (
    <>
      <rect x="5" y="12" width="38" height="25" rx="3" fill={L} />
      <rect x="9" y="16" width="22" height="17" rx="2" fill={M} />
      <path d="M34.5 16v17" />
      <circle cx="38.7" cy="20" r="1.2" />
      <circle cx="38.7" cy="25" r="1.2" />
      <path d="M36.5 30h4.5" />
      <path d="M9 37v2.5M39 37v2.5" />
    </>
  ),
  immersion: (
    <>
      <path d="M24 5c0-2.5 3.5-3 5.5-1.5" stroke={D} />
      <rect x="19" y="5" width="10" height="21" rx="4" fill={L} />
      <circle cx="24" cy="12" r="1.6" />
      <path d="M21.5 26h5v8h-5Z" fill={M} />
      <path d="M17.5 34h13l-2.5 7h-8Z" fill={L} />
      <path d="M21 37.5h6" stroke={D} />
    </>
  ),
  pitcher: (
    <>
      <path d="M31 15h2.5a5 5 0 0 1 0 11H30" />
      <path
        d="M12 11h19l-1.5 25a2.5 2.5 0 0 1-2.5 2.3H16a2.5 2.5 0 0 1-2.5-2.3Z"
        fill={L}
      />
      <path d="M12 11q-3 0-4-3" />
      <path
        d="M13.2 22h16.6l-.9 14.2a1.5 1.5 0 0 1-1.5 1.4H15.6a1.5 1.5 0 0 1-1.5-1.4Z"
        fill={M}
        stroke="none"
      />
    </>
  ),
  dishes: (
    <>
      <path d="M11 15h26l1.5 7h-29Z" fill={M} />
      <path
        d="M5 22h38l-2.5 10a4 4 0 0 1-3.9 3H11.4a4 4 0 0 1-3.9-3Z"
        fill={L}
      />
      <path d="M5 22H3M43 22h2M9 26h30" />
    </>
  ),
  containers: (
    <>
      <rect x="10" y="10" width="28" height="5" rx="1.5" fill={M} />
      <path d="M12 15h24l-2 9H14Z" fill={L} />
      <rect x="8" y="27" width="32" height="5" rx="1.5" fill={M} />
      <path d="M10 32h28l-2 9H12Z" fill={L} />
    </>
  ),
  spices: (
    <>
      <rect x="9" y="19" width="9" height="17" rx="2" fill={L} />
      <rect x="9.5" y="15" width="8" height="4" rx="1" fill={M} />
      <rect x="19.5" y="16" width="9" height="20" rx="2" fill={L} />
      <rect x="20" y="12" width="8" height="4" rx="1" fill={M} />
      <rect x="30" y="21" width="9" height="15" rx="2" fill={L} />
      <rect x="30.5" y="17" width="8" height="4" rx="1" fill={M} />
      <path d="M11 26h5M22 27h5M32 28h5" stroke={D} />
      <path d="M6 38.5h36" />
    </>
  ),
  wine: (
    <>
      <path d="M9 7h12c0 9-2.5 13-6 13.5S9 16 9 7Z" fill={L} />
      <path d="M9.4 12.5h11.2" stroke={D} />
      <path d="M15 20.5V36M10.5 38.5h9" />
      <path d="M26 7h12c0 9-2.5 13-6 13.5S26 16 26 7Z" fill={L} />
      <path d="M26.4 12.5h11.2" stroke={D} />
      <path d="M32 20.5V36M27.5 38.5h9" />
    </>
  ),
  dessert: (
    <>
      <path d="M16 15c0-5.5 3.5-9 8-9s8 3.5 8 9Z" fill={M} />
      <circle cx="24" cy="4.5" r="1.9" fill={D} />
      <path d="M9 14h30c0 9-6 13-15 13S9 23 9 14Z" fill={L} />
      <path d="M24 27v10.5M17 39.5h14" />
    </>
  ),
  spatulas: (
    <>
      <ellipse cx="18" cy="12" rx="3.6" ry="5" fill={M} />
      <path d="M18 17v9" />
      <path d="M22.5 6.5h6v10h-6Z" fill={M} />
      <path d="M25.5 16.5V26" />
      <circle cx="33" cy="14" r="4" fill={M} />
      <path d="M33 18v8" />
      <path d="M13 26h22l-1.8 14H14.8Z" fill={L} />
      <path d="M12 26h24M14 31.5h20" />
    </>
  ),
  bamboo: (
    <>
      <rect x="10" y="6" width="23" height="34" rx="4" fill={L} />
      <circle cx="21.5" cy="11" r="1.8" />
      <path d="M14.5 18h14M14.5 23h14M14.5 28h14" stroke={M} />
      <path d="M27 41l8.5-22" strokeWidth="2.2" />
      <ellipse
        cx="37"
        cy="14.5"
        rx="3.2"
        ry="5"
        transform="rotate(22 37 14.5)"
        fill={M}
      />
    </>
  ),
  tablecloth: (
    <>
      <path d="M10 37v6M38 37v6" />
      <path d="M9 17h30l5 16H4Z" fill={L} />
      <path d="M17 18l-2 14M24 18v15M31 18l2 14" stroke={M} />
      <path
        d="M4 33q3.3 4 6.6 0q3.3 4 6.6 0q3.3 4 6.6 0q3.3 4 6.6 0q3.3 4 6.6 0q3.3 4 6.6 0"
        fill={L}
      />
    </>
  ),
  placemat: (
    <>
      <rect x="5" y="14" width="38" height="22" rx="3" fill={M} />
      <circle cx="24" cy="25" r="7" fill={L} />
      <circle cx="24" cy="25" r="4" />
      <path d="M10 19v14M8.5 19v5M11.5 19v5" />
      <path d="M38 19v14M38 19c-1.8 2-1.8 6 0 8" />
    </>
  ),
  roundpan: (
    <>
      <path d="M8 19v12c0 3.5 7 6 16 6s16-2.5 16-6V19" fill={L} />
      <ellipse cx="24" cy="19" rx="16" ry="6" fill={L} />
      <ellipse cx="24" cy="19" rx="12.5" ry="4.2" fill={M} />
    </>
  ),
  squarepan: (
    <>
      <path d="M7 20l7-7h28l-7 7Z" fill={M} />
      <path d="M7 20h28v14H7Z" fill={L} />
      <path d="M35 20l7-7v14l-7 7Z" fill={L} />
      <path d="M10 23h22" stroke={D} />
    </>
  ),
  bed: (
    <>
      <path d="M6 12v28M42 28v12" />
      <path d="M9 19c0-2 1.5-3 3.5-3h8c2 0 3.5 1 3.5 3v6H9Z" fill={M} />
      <path d="M25 20c0-2 1.5-3 3.5-3h8c2 0 3.5 1 3.5 3v5H25Z" fill={M} />
      <rect x="6" y="25" width="36" height="9" rx="2" fill={L} />
      <path d="M6 30h36" stroke={D} />
      <path d="M6 34v6M42 34v6" />
    </>
  ),
  mattress: (
    <>
      <path d="M6 26l8-8h28l-8 8Z" fill={L} />
      <path d="M6 26h28v8H6Z" fill={M} />
      <path d="M34 26l8-8v8l-8 8Z" fill={M} />
      <path d="M10 22l6-4M18 22l6-4M26 22l6-4" stroke={D} />
      <path d="M9 30h22" stroke={L} strokeDasharray="2 2" />
    </>
  ),
  curtain: (
    <>
      <path d="M4 9h40" />
      <circle cx="4" cy="9" r="1.4" fill={M} />
      <circle cx="44" cy="9" r="1.4" fill={M} />
      <path d="M7 10h14c-1 8 3 12 3 14s-5 5-5 15H7Z" fill={L} />
      <path d="M41 10H27c1 8-3 12-3 14s5 5 5 15h12Z" fill={L} />
      <path d="M12 10v29M16 10v9M36 10v29M32 10v9" stroke={M} />
    </>
  ),
  cushions: (
    <>
      <path d="M24 5l15 6-3 14-13-3Z" fill={M} />
      <path
        d="M8 20c8-3 17-2 24 1 2 7 1 14-1 19-8 2-17 2-24-1-2-6-1-13 1-19Z"
        fill={L}
      />
      <circle cx="20" cy="30" r="1.6" />
      <path d="M10.5 24c6-2 13-2 19 1" stroke={D} strokeDasharray="2 2" />
    </>
  ),
  fan: (
    <>
      <circle cx="24" cy="19" r="14" fill={L} />
      <path d="M24 19c-3-6-1-11 3-11 3 3 2 8-3 11Zm0 0c6-2 11 0 11 4-3 3-8 1-11-4Zm0 0c-1 7-6 9-10 6 0-4 4-7 10-6Z" fill={M} />
      <circle cx="24" cy="19" r="2.2" fill="#fff" />
      <path d="M24 33v7M17 41h14" strokeWidth="2.4" />
    </>
  ),
  towels: (
    <>
      <rect x="6" y="29" width="36" height="9" rx="2" fill={M} />
      <rect x="8" y="20" width="32" height="9" rx="2" fill={L} />
      <rect x="10" y="11" width="28" height="9" rx="2" fill={M} />
      <path d="M6.5 33.5h35M8.5 24.5h31M10.5 15.5h27" stroke={D} />
    </>
  ),
  rug: (
    <>
      <path
        d="M17 11.5l-.7 3M21 11.5l-.5 3M25 11.5v3M29 11.5v3M33 11.5v3M37 11.5v3M41 11.5l.5 3"
        stroke={D}
      />
      <path d="M14 15h30l-6 22H6Z" fill={L} />
      <path d="M17.5 19h22.6l-4.3 15H12.9Z" fill={M} />
      <path d="M28 21l7 6.5-7 6.5-7-6.5Z" fill={L} />
      <path
        d="M9 37l-.8 3M13 37l-.6 3M17 37l-.4 3M21 37v3M25 37v3M29 37v3M33 37v3"
        stroke={D}
      />
    </>
  ),
};

export const GLYPH_NAMES = Object.keys(glyphs);

export function GiftGlyph({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      style={style}
      fill="none"
      stroke={S}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {glyphs[name] ?? glyphs.blender}
    </svg>
  );
}

export function GiftArt({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (src.startsWith("glyph:"))
    return (
      <GiftGlyph name={src.slice(6)} className={className} style={style} />
    );
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      className={className}
      style={{ objectFit: "cover", ...style }}
    />
  );
}
