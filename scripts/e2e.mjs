/**
 * Testes de ponta a ponta do site exportado (pasta out/).
 * Uso: npm run build && npm run test:e2e
 */
import { chromium } from "./pw.mjs";
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 4173;
const BASE = `http://localhost:${PORT}`;
const OUT = path.resolve("out");

// Servidor estático mínimo (equivalente ao de produção)
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, BASE).pathname);
  let f = path.join(OUT, p);
  if (!f.startsWith(OUT)) return res.writeHead(403).end();
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) {
    res.writeHead(404, { "content-type": types[".html"] });
    return res.end(fs.readFileSync(path.join(OUT, "404.html")));
  }
  res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
void spawn;

const results = [];
const ok = (name, cond, detail = "") => {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? "✔" : "✘"} ${name}${detail ? " — " + detail : ""}`);
};

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

async function open(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  const requests = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  return { ctx, page, errors, requests };
}

// 1. Responsividade, overflow e console em várias larguras
for (const w of [360, 390, 768, 1024, 1440, 2560]) {
  const { ctx, page, errors } = await open({ width: w, height: 900 });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll("main *").forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width > 0 && r.right > vw + 1 && cs.position !== "absolute" && cs.position !== "fixed") {
        let p = el.parentElement, clipped = false;
        while (p) {
          const o = getComputedStyle(p);
          if (o.overflowX === "hidden" || o.overflowX === "clip") { clipped = true; break; }
          p = p.parentElement;
        }
        if (!clipped) bad.push(el.tagName + "." + String(el.className).slice(0, 40));
      }
    });
    return bad.slice(0, 5);
  });
  ok(`[${w}px] sem rolagem horizontal involuntária`, overflow.length === 0, overflow.join(", "));
  ok(`[${w}px] sem erros no console`, errors.length === 0, errors.slice(0, 3).join(" | "));
  await ctx.close();
}

// 2. Links, CTAs e conteúdo
{
  const { ctx, page, requests } = await open({ width: 1440, height: 900 });
  ok("H1 único na página", (await page.locator("h1").count()) === 1);
  const wa = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => a.getAttribute("href")));
  ok("links de WhatsApp válidos", wa.length >= 8 && wa.every((h) => /^https:\/\/wa\.me\/\d{12,13}(\?text=.+)?$/.test(h)), `${wa.length} links`);
  const tel = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute("href")));
  ok("links de telefone presentes", tel.length >= 1 && tel.every((h) => /^tel:\+\d{12,13}$/.test(h)));
  const anchors = await page.$$eval('a[href^="/#"], a[href^="#"]', (as) => as.map((a) => a.getAttribute("href").replace("/", "")));
  const missing = [];
  for (const a of new Set(anchors)) if (a.length > 1 && !(await page.$(a))) missing.push(a);
  ok("âncoras internas existem", missing.length === 0, missing.join(", "));
  ok("JSON-LD válido", await page.$$eval('script[type="application/ld+json"]', (s) => s.every((x) => Array.isArray(JSON.parse(x.textContent)))));
  ok("botão flutuante visível no desktop", await page.locator('a[data-track-location="floating"]').isVisible());
  ok("barra fixa oculta no desktop", !(await page.locator('a[data-track="whatsapp_click"][data-track-location="mobile_bar"]').isVisible()));

  // 3D sob demanda
  const threeBefore = requests.filter((u) => u.includes("/_next/static/chunks/")).length;
  await page.locator("#b3d-title").scrollIntoViewIfNeeded();
  await page.waitForSelector('canvas[aria-label^="Bateria 3D"].opacity-100', { timeout: 20000 }).catch(() => null);
  const threeAfter = requests.filter((u) => u.includes("/_next/static/chunks/")).length;
  ok("Three.js carregado só ao chegar na seção 3D", threeAfter > threeBefore, `${threeBefore} → ${threeAfter} arquivos JS`);
  ok("bateria 3D renderizada", (await page.locator('canvas[aria-label^="Bateria 3D"].opacity-100').count()) === 1);
  await page.locator('canvas[aria-label^="Bateria 3D"]').hover();
  await page.mouse.down();
  await page.mouse.move(900, 500, { steps: 8 });
  await page.mouse.up();
  const dl = await page.evaluate(() => (window.dataLayer || []).map((e) => e.event).filter(Boolean));
  ok("interação 3D rastreada", dl.includes("battery_3d_interaction"));

  // FAQ
  const first = page.locator("#duvidas details").first();
  await first.locator("summary").click();
  ok("FAQ expande", await first.evaluate((d) => d.open));
  await ctx.close();
}

// 3. Seletor inteligente (fluxo completo no celular)
{
  const { ctx, page } = await open({ width: 390, height: 844 }, { hasTouch: true, isMobile: true });
  await page.locator("#seletor").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Fiat", exact: true }).click();
  await page.getByRole("button", { name: "Argo", exact: true }).click();
  await page.getByRole("button", { name: "2021", exact: true }).click();
  await page.getByRole("button", { name: "1.3", exact: true }).click();
  await page.getByRole("button", { name: "Não", exact: true }).click();
  await page.fill("#sel-district", "Pituba");
  await page.getByRole("button", { name: /Ver resumo/ }).click();
  const link = page.getByRole("link", { name: /Consultar opções e preços/ });
  await link.waitFor();
  const href = decodeURIComponent((await link.getAttribute("href")).split("text=")[1]);
  ok(
    "mensagem do seletor completa",
    href.includes("Marca: Fiat") && href.includes("Modelo: Argo") && href.includes("Ano: 2021") && href.includes("Motorização: 1.3") && href.includes("Bairro: Pituba") && href.includes("Gostaria de saber as opções disponíveis e os valores."),
  );
  const ev = await page.evaluate(() => (window.dataLayer || []).map((e) => e.event).filter(Boolean));
  ok("eventos do seletor (início e conclusão)", ev.includes("selector_start") && ev.includes("selector_complete"), ev.join(","));
  const pii = await page.evaluate(() => JSON.stringify(window.dataLayer || []).includes("Pituba"));
  ok("bairro NÃO enviado à camada de rastreamento", !pii);
  ok("barra fixa visível no celular", await page.locator('a[data-track="whatsapp_click"][data-track-location="mobile_bar"]').isVisible());
  await ctx.close();
}

// 4. Movimento reduzido: conteúdo visível
{
  const { ctx, page } = await open({ width: 1440, height: 900 }, { reducedMotion: "reduce" });
  const op = await page.locator("#seletor-title").evaluate((el) => getComputedStyle(el).opacity);
  ok("conteúdo visível com movimento reduzido", op === "1");
  await ctx.close();
}

// 5. Páginas secundárias
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const p of ["/politica-de-privacidade/", "/termos-de-uso/", "/robots.txt", "/sitemap.xml"]) {
    const r = await page.goto(BASE + p);
    ok(`página ${p} responde 200`, r.status() === 200);
  }
  const r404 = await page.goto(BASE + "/nao-existe/");
  ok("página 404 personalizada", r404.status() === 404 && (await page.content()).includes("ficou sem energia"));
  await ctx.close();
}

await browser.close();
server.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram.`);
process.exit(failed.length ? 1 : 0);
