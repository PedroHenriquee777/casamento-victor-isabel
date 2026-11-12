"use strict";
/**
 * Gera a arte estática do convite (relevo floral, aquarela Serenity, papel) em /public/art.
 *
 *   npm run art            (requer Playwright + Chromium instalados)
 *   ART_PREVIEW_DIR=/tmp/preview npm run art   (salva prévias sobre fundo de papel)
 *
 * A arte é determinística (RNG com semente): rodar de novo gera os mesmos arquivos.
 * Para mudar cores, ajuste a paleta em botanical.cjs.
 */
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");
const B = require("./botanical.cjs");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright não encontrado. Instale com: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const { rng, C, svgDoc } = B;
const OUT = path.resolve(__dirname, "../../public/art");
const PREVIEW = process.env.ART_PREVIEW_DIR;

/* ---------- cluster floral ---------- */
/**
 * Monta um buquê "fluindo" para +x/+y em coordenadas locais e o transforma por uma matriz
 * (espelhamento/escala) aplicada apenas aos PONTOS — assim as sombras mantêm a luz vindo
 * sempre do canto superior esquerdo.
 */
function cluster(r, o) {
  const { cx, cy, k = 1, m = [1, 0, 0, 1], focal = "peony", reach = 1, sprays = true, extra = true, ex = reach } = o;
  const T = ([x, y]) => [cx + k * (m[0] * x + m[1] * y), cy + k * (m[2] * x + m[3] * y)];
  const V = ([x, y]) => [m[0] * x + m[1] * y, m[2] * x + m[3] * y];
  const TP = (P) => P.map(T);
  const peony = focal === "peony";
  let s = "";

  const wsh = (x, y, rad, col, op) => {
    const [X, Y] = T([x, y]);
    return B.wash(X, Y, rad * k, col, op, r);
  };
  s += wsh(0, 0, peony ? 200 : 150, C.wash1, 0.2) + wsh(340 * ex, -30, 120, C.wash2, 0.17) + wsh(-70, 350 * ex, 120, C.wash2, 0.15) + wsh(240 * ex, 210 * ex, 150, C.wash3, 0.09);

  if (sprays) {
    const rr = reach;
    s += B.spray(TP([[-210, -60], [70, -260], [320 * rr, 20], [660 * rr, -90]]), { n: Math.round(12 * rr), L: 62 * k, W: 30 * k, round: true, spread: 50 }, r);
    s += B.spray(TP([[-60, -220], [-250, 130], [40, 350 * rr], [-40, 680 * rr]]), { n: Math.round(12 * rr), L: 62 * k, W: 30 * k, round: true, spread: 50 }, r);
    s += B.spray(TP([[-140, -150], [130, 0], [250 * rr, 200 * rr], [470 * rr, 410 * rr]]), { n: Math.round(18 * rr), L: 60 * k, W: 13 * k, round: false, spread: 34, light: true, noVeins: true, taper: 0.45 }, r);
    s += B.spray(TP([[-90, -30], [40, 170 * rr], [-20, 330 * rr], [90, 520 * rr]]), { n: Math.round(15 * rr), L: 50 * k, W: 11 * k, round: false, spread: 36, light: true, noVeins: true, taper: 0.4 }, r);
    s += B.berries(TP([[40, 120], [170, 150], [250 * rr, 330 * rr], [250 * rr, 520 * rr]]), Math.round(9 * rr), r, 4.6 * Math.max(0.8, k));
  }

  // leques de folhas atrás da flor principal
  const [fx, fy] = T([0, 0]);
  const fan = peony ? [-28, 6, 38, 70, 102] : [-20, 22, 62, 100];
  fan.forEach((a, i) => {
    const v = V([Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]);
    s += B.leaf(fx, fy, B.dirDeg(v), (peony ? 300 : 215) * k, (peony ? 86 : 64) * k, { light: i % 2 === 1 });
  });

  // flores
  if (peony) s += B.rosette(fx, fy, 185 * k, 6, r, { nOuter: 11, nInner: 5, core: 11 });
  else s += B.rosette(fx, fy, 120 * k, 7, r, { nOuter: 12, nInner: 5, wOuter: 0.85, core: 9 });

  if (extra) {
    const [rx, ry] = T([(peony ? 345 : 270) * ex, (peony ? -25 : 40)]);
    s += B.rosette(rx, ry, (peony ? 88 : 66) * k, 6, r, { nOuter: 10, nInner: 5, wOuter: 0.85, core: 6 });
    const [b1x, b1y] = T([-70, 345 * ex]);
    s += B.blossom(b1x, b1y, 62 * k, 10, r);
    const [b2x, b2y] = T([390 * ex, 225 * ex]);
    s += B.blossom(b2x, b2y, 46 * k, 40, r);
    const [b3x, b3y] = T([200 * ex, 330 * ex]);
    s += B.bud(b3x, b3y, 54 * k, B.dirDeg(V([1, 1])), r);
  }

  // pérolas soltas
  for (let i = 0; i < 12; i++) {
    const [px, py] = T([-110 + r() * 600 * ex, -110 + r() * 540 * ex]);
    s += B.pearl(px, py, (2.6 + r() * 2.2) * Math.max(0.8, k));
  }
  return s;
}

/* ---------- composições ---------- */
function cornerTL() {
  const r = rng(11);
  return svgDoc(900, 900, cluster(r, { cx: 175, cy: 185, k: 1, focal: "peony" }));
}

function cornerBR() {
  const r = rng(29);
  return svgDoc(640, 640, cluster(r, { cx: 470, cy: 470, k: 0.62, m: [-1, 0, 0, -1], focal: "ranunculus", reach: 1 }));
}

function cover() {
  const r = rng(5);
  let s = "";
  // O centro (x 380–620) fica livre para a fenda, o selo e o nome do convidado.
  s += cluster(r, { cx: 130, cy: 190, k: 0.6, m: [1, 0, 0, 1], focal: "peony", reach: 0.62 });
  s += cluster(r, { cx: 860, cy: 280, k: 0.86, m: [-1, 0, 0, 1], focal: "peony", reach: 0.62 });
  s += cluster(r, { cx: 90, cy: 930, k: 0.5, m: [1, 0, 0, 1], focal: "ranunculus", reach: 0.5 });
  s += cluster(r, { cx: 925, cy: 1020, k: 0.54, m: [-1, 0, 0, 1], focal: "ranunculus", reach: 0.5 });
  s += cluster(r, { cx: 140, cy: 1700, k: 0.78, m: [1, 0, 0, -1], focal: "peony", reach: 0.46, ex: 0.55 });
  s += cluster(r, { cx: 880, cy: 1740, k: 0.62, m: [-1, 0, 0, -1], focal: "ranunculus", reach: 0.46, ex: 0.55 });
  // ramos que ligam os buquês ao longo das bordas (efeito de renda contínua)
  const vine = (P, n) => B.spray(P, { n, L: 46, W: 22, round: true, spread: 52, taper: 0.35, tipPearls: true }, r);
  s += vine([[40, 430], [-20, 590], [80, 720], [40, 830]], 9);
  s += vine([[60, 1010], [0, 1180], [90, 1330], [40, 1490]], 10);
  s += vine([[950, 560], [1015, 700], [925, 840], [955, 930]], 9);
  s += vine([[975, 1110], [925, 1270], [1005, 1420], [935, 1580]], 10);
  return svgDoc(1000, 2000, s);
}

function paper() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .50  0 0 0 0 .58  0 0 0 0 .76  0 0 0 1.5 -.62"/>
    </filter>
    <filter id="cloud" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves="3" seed="9" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .62  0 0 0 0 .70  0 0 0 0 .86  0 0 0 1.1 -.42"/>
    </filter>
    <filter id="fiber" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018 0.55" numOctaves="2" seed="21" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .62  0 0 0 0 .80  0 0 0 2.4 -1.25"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="#FBFCFE"/>
  <rect width="600" height="600" filter="url(#cloud)" opacity=".34"/>
  <rect width="600" height="600" filter="url(#fiber)" opacity=".28"/>
  <rect width="600" height="600" filter="url(#grain)" opacity=".5"/>
</svg>`;
}

/* ---------- render ---------- */
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (PREVIEW) fs.mkdirSync(PREVIEW, { recursive: true });
  const browser = await chromium.launch();

  async function render(name, svg, w, h, { transparent = true, quality = 82 } = {}) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html><body style="margin:0;background:${transparent ? "transparent" : "#fff"}">${svg}</body></html>`);
    const png = await page.screenshot({ omitBackground: transparent, type: "png", clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
    const webp = await sharp(png).webp({ quality, alphaQuality: 92, effort: 5 }).toBuffer();
    fs.writeFileSync(path.join(OUT, `${name}.webp`), webp);
    console.log(`✓ ${name}.webp  ${w}×${h}  ${(webp.length / 1024).toFixed(0)} KB`);
    if (PREVIEW) {
      const bg = sharp({ create: { width: w, height: h, channels: 3, background: transparent ? "#F6F8FC" : "#fff" } });
      await bg.composite([{ input: png }]).png().toFile(path.join(PREVIEW, `${name}.png`));
    }
  }

  await render("corner-tl", cornerTL(), 900, 900);
  await render("corner-br", cornerBR(), 640, 640);
  await render("cover", cover(), 1000, 2000);
  await render("paper", paper(), 600, 600, { transparent: false, quality: 86 });
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
