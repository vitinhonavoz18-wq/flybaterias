// Uso: node scripts/screens.mjs <baseUrl> <outDir> [width] [height]
import { chromium } from "./pw.mjs";
import fs from "node:fs";
const [base = "http://localhost:3100", out = "screens", w = "1440", h = "900"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
const errs = [];
p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
p.on("pageerror", (e) => errs.push("PAGEERROR " + e.message));
await p.goto(base + "/", { waitUntil: "networkidle", timeout: 120000 });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
// rola para disparar animações
for (let y = 0; y < H; y += 500) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(120);
}
await p.waitForTimeout(800);
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(1500);
let i = 0;
for (let y = 0; y < H; y += +h) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${out}/${w}-${String(i++).padStart(2, "0")}.png` });
}
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ w, H, overflow, errs }, null, 1));
await b.close();
