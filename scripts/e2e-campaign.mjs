/**
 * Testes da campanha (Black Friday) com o relógio do Worker SIMULADO.
 * Uso: npm run build:all && npm run build:worker && node scripts/e2e-campaign.mjs
 * Sobe `wrangler dev` várias vezes (scripts/wdev.sh) com datas diferentes.
 */
import { chromium } from "./pw.mjs";
import { execSync } from "node:child_process";
import fs from "node:fs";

const PORT = 8799;
// E2E_BASE: testa um site publicado (somente o cenário "durante", com o relógio real)
const PROD = process.env.E2E_BASE || "";
const BASE = PROD || `https://127.0.0.1:${PORT}`;
const { campaigns } = JSON.parse(fs.readFileSync("src/config/campaigns.json", "utf8"));
const C = campaigns.find((c) => c.id === "black-friday-2026");
const END = Date.parse(C.endsAt);

const results = [];
const ok = (name, cond, detail = "") => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? "✔" : "✘"} ${name}${detail ? " — " + detail : ""}`);
};
const iso = (ms) => new Date(ms).toISOString();
function clock(when) {
  if (PROD) return;
  execSync(`scripts/wdev.sh "${when}" ${PORT}`, { stdio: "ignore", env: { ...process.env } });
}

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-certificate-errors"] });
async function open(viewport = { width: 1440, height: 900 }, extra = {}) {
  const ctx = await browser.newContext({ viewport, ignoreHTTPSErrors: true, ...extra });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  return { ctx, page, errors };
}
const remaining = async (page) =>
  page.$$eval(".countdown-num", (els) => els.map((e) => Number(e.textContent))).then(([d, h, m, s]) => ((d * 24 + h) * 60 + m) * 60 + s);

/* ---------- A. Durante a campanha ---------- */
const DURING = PROD ? new Date().toISOString() : "2026-11-28T12:00:00-03:00";
clock(DURING);
{
  const { ctx, page, errors } = await open();
  ok("[durante] Worker serve a versão da campanha", (await page.getAttribute("html", "data-campaign")) === C.id);
  ok("[durante] barra promocional visível", await page.locator(".promo-bar").isVisible());
  const h1 = (await page.textContent("h1")).replace(/\s+/g, " ");
  ok("[durante] título com 30% OFF em todas as baterias", /Black Friday FlyBaterias.*30%.*OFF.*em todas as baterias/i.test(h1), h1.trim());
  ok("[durante] título da página (SEO) da campanha", (await page.title()).includes("Black Friday"));
  ok("[durante] imagem de compartilhamento da campanha", (await page.getAttribute('meta[property="og:image"]', "content")).includes("og-black-friday"));
  await page.waitForTimeout(1500);
  const r1 = await remaining(page);
  const expected = Math.floor((END - Date.parse(DURING)) / 1000);
  ok("[durante] contador correto pela hora do servidor", Math.abs(r1 - expected) <= 30, `${r1}s restantes (esperado ≈ ${expected}s)`);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const r2 = await remaining(page);
  ok("[durante] contador não reinicia ao atualizar", r2 <= r1 && r1 - r2 < 30, `${r1}s → ${r2}s`);
  const wa = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => decodeURIComponent(a.href)));
  const msg = C.whatsappMessage;
  ok("[durante] botões do WhatsApp com a mensagem da campanha", wa.filter((h) => h.includes(msg)).length >= 8, `${wa.filter((h) => h.includes(msg)).length}/${wa.length}`);
  ok("[durante] links de WhatsApp válidos", wa.every((h) => /^https:\/\/wa\.me\/\d{12,13}/.test(h)));
  ok("[durante] selo de desconto na vitrine", await page.locator("#baterias .promo-badge").isVisible());
  // evento com identificação da campanha
  const [popup] = await Promise.all([page.waitForEvent("popup").catch(() => null), page.locator('a[data-track-location="bf_hero"]').click()]);
  await popup?.close();
  const ev = await page.evaluate(() => (window.dataLayer || []).find((e) => e.event === "whatsapp_click"));
  ok("[durante] clique rastreado com promo_campaign", ev?.promo_campaign === "black-friday-2026" && ev?.cta_location === "bf_hero", JSON.stringify({ ev: ev?.event, c: ev?.promo_campaign, loc: ev?.cta_location }));
  ok("[durante] sem erros no console", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}
// seletor: mensagem começa com a frase da campanha
{
  const { ctx, page } = await open({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
  await page.locator("#seletor").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Fiat", exact: true }).click();
  await page.getByRole("button", { name: "Argo", exact: true }).click();
  await page.getByRole("button", { name: "2021", exact: true }).click();
  await page.getByRole("button", { name: "1.3", exact: true }).click();
  await page.getByRole("button", { name: "Não", exact: true }).click();
  await page.fill("#sel-district", "Pituba");
  await page.getByRole("button", { name: /Ver resumo/ }).click();
  const href = decodeURIComponent((await page.getByRole("link", { name: /Consultar com 30% OFF/ }).getAttribute("href")).split("text=")[1]);
  ok("[durante] seletor: mensagem da campanha + dados do veículo", href.startsWith(C.whatsappMessage) && href.includes("Modelo: Argo") && href.includes("Bairro: Pituba"));
  await ctx.close();
}
// responsividade
for (const w of [360, 390, 768, 1024, 1440, 2560]) {
  const { ctx, page, errors } = await open({ width: w, height: 860 });
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) await page.evaluate((yy) => scrollTo(0, yy), y);
  const wide = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll("header *, main *")].filter((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || r.right <= vw + 1) return false;
      let p = el.parentElement;
      while (p) {
        const o = getComputedStyle(p).overflowX;
        if (o === "hidden" || o === "clip") return false;
        p = p.parentElement;
      }
      return true;
    }).length;
  });
  ok(`[durante ${w}px] sem rolagem horizontal e sem erros`, wide === 0 && errors.length === 0, `${wide} elementos largos; ${errors.length} erros`);
  await ctx.close();
}

if (!PROD) {
/* ---------- B. Limites exatos ---------- */
clock(iso(END - 30_000));
{
  const { ctx, page } = await open();
  ok("[30s antes do fim] ainda em campanha", (await page.getAttribute("html", "data-campaign")) === C.id);
  await ctx.close();
}
clock("2026-12-01T00:00:05-03:00");
{
  const { ctx, page, errors } = await open();
  ok("[depois] site original (sem atributo de campanha)", (await page.getAttribute("html", "data-campaign")) === null);
  ok("[depois] sem barra promocional", (await page.locator(".promo-bar").count()) === 0);
  ok("[depois] hero original de volta", (await page.textContent("h1")).includes("Seu carro"));
  const html = await page.content();
  ok("[depois] nenhum texto de oferta no site", !/Black Friday|30% OFF/i.test(html));
  const wa = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => decodeURIComponent(a.href)));
  ok("[depois] WhatsApp com mensagens originais", wa.every((h) => !h.includes("Black Friday")));
  ok("[depois] sem erros no console", errors.length === 0);
  await ctx.close();
}
clock("2026-11-25T23:59:00-03:00");
{
  const { ctx, page } = await open();
  ok("[antes do início] site original", (await page.getAttribute("html", "data-campaign")) === null);
  await ctx.close();
}

/* ---------- C. Encerramento ao vivo (visitante com a página aberta) ---------- */
clock(iso(END - 8_000));
{
  const { ctx, page } = await open();
  ok("[ao vivo] campanha no ar a 8s do fim", (await page.getAttribute("html", "data-campaign")) === C.id);
  await page.waitForFunction(() => document.body.textContent.includes("Oferta encerrada"), null, { timeout: 15000 }).catch(() => null);
  ok("[ao vivo] contador zera e exibe 'Oferta encerrada'", await page.evaluate(() => document.body.textContent.includes("Oferta encerrada")) || (await page.getAttribute("html", "data-campaign")) === null);
  await page.waitForFunction(() => !document.documentElement.hasAttribute("data-campaign"), null, { timeout: 20000 }).catch(() => null);
  ok("[ao vivo] página recarrega sozinha no site original", (await page.getAttribute("html", "data-campaign")) === null && (await page.textContent("h1")).includes("Seu carro"));
  await ctx.close();
}

}
await browser.close();
try { execSync("pkill -f 'wrangler.*--local-protocol'"); } catch { /* já encerrado */ }
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} verificações da campanha passaram.`);
process.exit(failed.length ? 1 : 0);
