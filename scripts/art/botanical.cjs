"use strict";
/**
 * Gerador procedural da arte botânica do convite (papelaria em relevo + aquarela Serenity).
 * Tudo é SVG com filtros (sombra, deslocamento) — depois renderizado para WebP por generate.cjs.
 */

/* ---------- utilitários ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const f = (n) => Number(n.toFixed(2));
const deg = (rad) => (rad * 180) / Math.PI;

const C = {
  line: "#7F93BC",
  lineSoft: "#A6B6D5",
  shadow: "#5870A3",
  petalBase: "#D3DDF0",
  wash1: "#93ABD9",
  wash2: "#B8C9E8",
  wash3: "#A5B9E0",
};

function defs() {
  return `<defs>
  <linearGradient id="gPetal" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="${C.petalBase}"/><stop offset=".5" stop-color="#F1F5FB"/><stop offset="1" stop-color="#FFFFFF"/>
  </linearGradient>
  <linearGradient id="gPetal2" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#C8D5EC"/><stop offset=".55" stop-color="#EAF0FA"/><stop offset="1" stop-color="#FBFCFF"/>
  </linearGradient>
  <linearGradient id="gLeaf" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#9DB1D8"/><stop offset=".6" stop-color="#C9D6EE"/><stop offset="1" stop-color="#E9EFFA"/>
  </linearGradient>
  <linearGradient id="gLeafLight" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#C3D0EA"/><stop offset=".6" stop-color="#E2EAF7"/><stop offset="1" stop-color="#F7F9FD"/>
  </linearGradient>
  <radialGradient id="gPearl" cx=".34" cy=".3" r=".75">
    <stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#EEF2FA"/><stop offset="1" stop-color="#B9C7E2"/>
  </radialGradient>
  <filter id="sh" x="-30%" y="-30%" width="165%" height="165%">
    <feDropShadow dx="1.8" dy="2.8" stdDeviation="2.6" flood-color="${C.shadow}" flood-opacity=".38"/>
  </filter>
  <filter id="shS" x="-40%" y="-40%" width="180%" height="180%">
    <feDropShadow dx="1" dy="1.6" stdDeviation="1.3" flood-color="${C.shadow}" flood-opacity=".4"/>
  </filter>
  <filter id="shL" x="-30%" y="-30%" width="165%" height="165%">
    <feDropShadow dx="1.4" dy="2.2" stdDeviation="2" flood-color="${C.shadow}" flood-opacity=".3"/>
  </filter>
  <filter id="wc" x="-35%" y="-35%" width="170%" height="170%">
    <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="5"/>
  </filter>
</defs>`;
}

/* ---------- formas ---------- */
function petalPath(L, W, r) {
  const j = () => (r() - 0.5) * 0.14;
  const w = W / 2;
  return (
    `M0 0 C ${f(-w * 0.45)} ${f(-L * 0.12)} ${f(-w * (1.15 + j()))} ${f(-L * 0.5)} ${f(-w * (0.95 + j()))} ${f(-L * 0.8)} ` +
    `C ${f(-w * 0.8)} ${f(-L * (1 + j() * 0.3))} ${f(-w * 0.2)} ${f(-L * 1.03)} 0 ${f(-L * 0.95)} ` +
    `C ${f(w * 0.2)} ${f(-L * 1.03)} ${f(w * 0.8)} ${f(-L * (1 + j() * 0.3))} ${f(w * (0.95 + j()))} ${f(-L * 0.8)} ` +
    `C ${f(w * (1.15 + j()))} ${f(-L * 0.5)} ${f(w * 0.45)} ${f(-L * 0.12)} 0 0 Z`
  );
}

function veins(L, W) {
  const w = W / 2;
  const s = `stroke="${C.line}" stroke-opacity=".42" stroke-width=".9" fill="none" stroke-linecap="round"`;
  return (
    `<path d="M0 ${f(-L * 0.1)} Q ${f(w * 0.12)} ${f(-L * 0.45)} 0 ${f(-L * 0.8)}" ${s}/>` +
    `<path d="M${f(-w * 0.1)} ${f(-L * 0.08)} Q ${f(-w * 0.62)} ${f(-L * 0.38)} ${f(-w * 0.52)} ${f(-L * 0.72)}" ${s}/>` +
    `<path d="M${f(w * 0.1)} ${f(-L * 0.08)} Q ${f(w * 0.62)} ${f(-L * 0.38)} ${f(w * 0.52)} ${f(-L * 0.72)}" ${s}/>`
  );
}

function pearl(cx, cy, rad) {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="url(#gPearl)" stroke="${C.lineSoft}" stroke-opacity=".55" stroke-width=".6" filter="url(#shS)"/>`;
}

function pearlsAround(cx, cy, rad, n, r, sMin = 2.6, sMax = 4.6) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2;
    const d = rad * Math.sqrt(r());
    s += pearl(
      cx + Math.cos(a) * d,
      cy + Math.sin(a) * d,
      lerp(sMin, sMax, r()),
    );
  }
  return s;
}

/** Rosácea (peônia/ranúnculo): anéis de pétalas do maior para o menor. */
function rosette(cx, cy, R, rings, r, o = {}) {
  let s = "";
  for (let k = 0; k < rings; k++) {
    const t = rings === 1 ? 0 : k / (rings - 1);
    const n = Math.round(lerp(o.nOuter || 11, o.nInner || 5, t));
    const L = R * lerp(1, 0.36, Math.pow(t, 0.85));
    const W = L * lerp(o.wOuter || 0.92, o.wInner || 0.8, t);
    const off = r() * Math.PI * 2;
    const grad = k % 2 === 0 ? "gPetal" : "gPetal2";
    for (let i = 0; i < n; i++) {
      const ang = deg(off + (i / n) * Math.PI * 2) + (r() - 0.5) * 12;
      const l = L * (0.92 + r() * 0.16);
      const w = W * (0.9 + r() * 0.2);
      const lift = L * lerp(0.1, 0.0, t);
      s +=
        `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)}) translate(0 ${f(-lift)})">` +
        `<path d="${petalPath(l, w, r)}" fill="url(#${grad})" stroke="${C.line}" stroke-opacity=".55" stroke-width="1.05" filter="url(#sh)"/>` +
        veins(l, w) +
        `</g>`;
    }
  }
  // miolo de pérolas
  s += pearlsAround(cx, cy, R * 0.1, o.core || 9, r, 2.8, 4.4);
  return s;
}

function blossom(cx, cy, R, rot, r) {
  let s = "";
  for (let i = 0; i < 5; i++) {
    const ang = rot + i * 72 + (r() - 0.5) * 8;
    s +=
      `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})">` +
      `<path d="${petalPath(R, R * 0.95, r)}" fill="url(#gPetal)" stroke="${C.line}" stroke-opacity=".55" stroke-width="1" filter="url(#sh)"/>` +
      veins(R, R * 0.95) +
      `</g>`;
  }
  s += pearlsAround(cx, cy, R * 0.16, 6, r, 2.2, 3.4);
  return s;
}

function bud(cx, cy, R, rot, r) {
  let s = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)})">`;
  for (const a of [-24, 24, 0]) {
    s += `<g transform="rotate(${a})"><path d="${petalPath(R, R * 0.7, r)}" fill="url(#gPetal)" stroke="${C.line}" stroke-opacity=".55" stroke-width="1" filter="url(#sh)"/>${veins(R, R * 0.7)}</g>`;
  }
  return s + `</g>`;
}

function leafPath(L, W, round) {
  if (round) {
    return `M0 0 C ${f(W)} ${f(-L * 0.1)} ${f(W * 1.05)} ${f(-L * 0.85)} 0 ${f(-L)} C ${f(-W * 1.05)} ${f(-L * 0.85)} ${f(-W)} ${f(-L * 0.1)} 0 0 Z`;
  }
  return `M0 0 C ${f(W * 0.95)} ${f(-L * 0.22)} ${f(W * 0.62)} ${f(-L * 0.78)} 0 ${f(-L)} C ${f(-W * 0.62)} ${f(-L * 0.78)} ${f(-W * 0.95)} ${f(-L * 0.22)} 0 0 Z`;
}

function leaf(x, y, ang, L, W, o = {}) {
  const grad = o.light ? "gLeafLight" : "gLeaf";
  const sv = `stroke="${C.line}" stroke-opacity=".5" stroke-width=".85" fill="none" stroke-linecap="round"`;
  let v = `<path d="M0 ${f(-L * 0.03)} L0 ${f(-L * 0.9)}" ${sv}/>`;
  if (!o.noVeins) {
    const nv = o.round ? 3 : 5;
    for (let k = 1; k <= nv; k++) {
      const y0 = -L * (k / (nv + 1));
      const span = W * (o.round ? 0.7 : 0.55) * (1 - k / (nv + 2));
      v += `<path d="M0 ${f(y0)} L${f(span)} ${f(y0 - L * 0.12)}" ${sv}/><path d="M0 ${f(y0)} L${f(-span)} ${f(y0 - L * 0.12)}" ${sv}/>`;
    }
  }
  return (
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">` +
    `<path d="${leafPath(L, W, o.round)}" fill="url(#${grad})" stroke="${C.line}" stroke-opacity=".55" stroke-width="1" filter="url(#shL)"/>` +
    v +
    `</g>`
  );
}

/* ---------- curvas ---------- */
function bez(P, t) {
  const u = 1 - t;
  return [
    u * u * u * P[0][0] +
      3 * u * u * t * P[1][0] +
      3 * u * t * t * P[2][0] +
      t * t * t * P[3][0],
    u * u * u * P[0][1] +
      3 * u * u * t * P[1][1] +
      3 * u * t * t * P[2][1] +
      t * t * t * P[3][1],
  ];
}
function bezTan(P, t) {
  const u = 1 - t;
  const dx =
    3 * u * u * (P[1][0] - P[0][0]) +
    6 * u * t * (P[2][0] - P[1][0]) +
    3 * t * t * (P[3][0] - P[2][0]);
  const dy =
    3 * u * u * (P[1][1] - P[0][1]) +
    6 * u * t * (P[2][1] - P[1][1]) +
    3 * t * t * (P[3][1] - P[2][1]);
  return [dx, dy];
}
const dirDeg = ([dx, dy]) => deg(Math.atan2(dx, -dy)); // 0° = para cima

/** Ramo com folhas ao longo de uma curva de Bézier. */
function spray(P, o, r) {
  const {
    n = 10,
    L = 60,
    W = 28,
    round = true,
    spread = 48,
    tipPearls = true,
    light = false,
    taper = 0.55,
  } = o;
  const stem = `M${f(P[0][0])} ${f(P[0][1])} C ${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])} ${f(P[3][0])} ${f(P[3][1])}`;
  let s =
    `<path d="${stem}" fill="none" stroke="#FFFFFF" stroke-opacity=".95" stroke-width="3.6" stroke-linecap="round"/>` +
    `<path d="${stem}" fill="none" stroke="${C.line}" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"/>`;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.7) / (n + 0.4);
    const [x, y] = bez(P, t);
    const base = dirDeg(bezTan(P, t));
    const side = i % 2 === 0 ? 1 : -1;
    const sc = 1 - taper * t;
    const l = L * sc * (0.88 + r() * 0.24);
    const w = W * sc * (0.9 + r() * 0.2);
    s += leaf(x, y, base + side * (spread + (r() - 0.5) * 14), l, w, {
      round,
      light: light ? r() > 0.3 : r() > 0.75,
      noVeins: o.noVeins,
    });
  }
  // folha terminal
  const tipDir = dirDeg(bezTan(P, 1));
  s += leaf(
    P[3][0],
    P[3][1],
    tipDir,
    L * (1 - taper) * 0.95,
    W * (1 - taper) * 0.95,
    { round, noVeins: o.noVeins },
  );
  if (tipPearls)
    s += pearlsAround(
      P[3][0] + Math.sin((tipDir * Math.PI) / 180) * L * 0.5,
      P[3][1] - Math.cos((tipDir * Math.PI) / 180) * L * 0.5,
      9,
      3,
      r,
      2.2,
      3.6,
    );
  return s;
}

/** Ramo de pérolas (galho fino com bagas). */
function berries(P, n, r, size = 4.6) {
  const stem = `M${f(P[0][0])} ${f(P[0][1])} C ${f(P[1][0])} ${f(P[1][1])} ${f(P[2][0])} ${f(P[2][1])} ${f(P[3][0])} ${f(P[3][1])}`;
  let s =
    `<path d="${stem}" fill="none" stroke="#FFFFFF" stroke-opacity=".9" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="${stem}" fill="none" stroke="${C.line}" stroke-opacity=".65" stroke-width="1.1" stroke-linecap="round"/>`;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const [x, y] = bez(P, t);
    const base = dirDeg(bezTan(P, t));
    const side = i % 2 === 0 ? 1 : -1;
    const a = ((base + side * 62) * Math.PI) / 180;
    const len = 12 + r() * 12;
    const ex = x + Math.sin(a) * len;
    const ey = y - Math.cos(a) * len;
    s +=
      `<path d="M${f(x)} ${f(y)} L${f(ex)} ${f(ey)}" stroke="${C.line}" stroke-opacity=".6" stroke-width="1" fill="none"/>` +
      pearl(ex, ey, size * (0.8 + r() * 0.5));
  }
  const [tx, ty] = bez(P, 1);
  s += pearl(tx, ty, size * 1.1);
  return s;
}

/** Mancha de aquarela (Serenity) */
function wash(cx, cy, rad, color, op, r, n = 12) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = rad * (0.7 + r() * 0.5);
    pts.push([
      cx + Math.cos(a) * rr,
      cy + Math.sin(a) * rr * (0.85 + r() * 0.3),
    ]);
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n],
      p1 = pts[i],
      p2 = pts[(i + 1) % n],
      p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `<path d="${d} Z" fill="${color}" fill-opacity="${op}" stroke="${color}" stroke-opacity="${f(op * 1.5)}" stroke-width="2.6" filter="url(#wc)"/>`;
}

function svgDoc(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}${body}</svg>`;
}

module.exports = {
  rng,
  lerp,
  f,
  C,
  defs,
  svgDoc,
  rosette,
  blossom,
  bud,
  leaf,
  spray,
  berries,
  pearl,
  pearlsAround,
  wash,
  bez,
  bezTan,
  dirDeg,
};
