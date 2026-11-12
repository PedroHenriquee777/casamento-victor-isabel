// Gera src/app/opengraph-image.png (1200x630) — prévia do link no WhatsApp.
const path = require("path");
const fs = require("fs");
const os = require("os");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "../..");
const f = (p) => "file://" + path.join(root, p);
const font = (n, w, s) =>
  `@font-face{font-family:C;font-weight:${w};font-style:${s};src:url(${f(`node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-${w}-${s}.woff2`)})}`;
const html = `<style>${font("c", 500, "normal")}${font("c", 500, "italic")}
*{margin:0}body{width:1200px;height:630px;position:relative;overflow:hidden;font-family:C,serif;color:#33456b;
background:#fbfcfe url(${f("public/art/paper.webp")}) 0 0/300px 300px}
.a{position:absolute}.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.e{font-family:sans-serif;font-size:19px;letter-spacing:.42em;text-transform:uppercase;color:#5a73a6}
h1{font-weight:500;font-size:132px;line-height:1;margin:26px 0 22px;text-shadow:0 -1px 0 #fff,0 2px 2px rgba(70,92,140,.25)}
h1 i{font-size:76px;color:#92a8d1;padding:0 .3em}.d{font-style:italic;font-size:38px;color:#55678f}
.r{position:absolute;left:34px;right:34px;top:34px;bottom:34px;border:1.5px solid #a9b9d9;border-radius:18px 160px 18px 18px/18px 120px 18px 18px;opacity:.8}
</style>
<img class=a src="${f("public/art/corner-tl.webp")}" style="left:-60px;top:-70px;width:560px">
<img class=a src="${f("public/art/corner-br.webp")}" style="right:-40px;bottom:-60px;width:430px">
<div class=r></div>
<div class=c><p class=e>Convite de casamento</p><h1>Victor<i>&amp;</i>Isabel</h1><p class=d>04 de abril de 2027 · Nova Russas, CE</p></div>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  const tmp = path.join(os.tmpdir(), "og-convite.html");
  fs.writeFileSync(tmp, html);
  await p.goto("file://" + tmp, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, "src/app/opengraph-image.png") });
  await b.close();
  console.log("ok");
})();
