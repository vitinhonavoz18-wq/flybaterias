/**
 * Gera as imagens estáticas da bateria a partir do modelo 3D
 * (fallback do 3D, vitrine e imagem do hero).
 *
 * Uso: 1) npm run dev -- -p 3100   2) npm run render:assets
 * Requer Python 3 com Pillow (conversão para WebP/AVIF).
 */
import { chromium } from "./pw.mjs";
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const BASE = process.env.LAB_URL || "http://localhost:3100";
const OUT = "public/renders";
fs.mkdirSync(OUT, { recursive: true });

const jobs = [
  { name: "battery-hero", variant: "hero", angle: -0.62, w: 1100, h: 860 },
  { name: "battery-car", variant: "car", angle: -0.5, w: 900, h: 700 },
  { name: "battery-efb", variant: "efb", angle: -0.5, w: 900, h: 700 },
  { name: "battery-agm", variant: "agm", angle: -0.5, w: 900, h: 700 },
  { name: "battery-heavy", variant: "heavy", angle: -0.5, w: 900, h: 700 },
  { name: "battery-moto", variant: "moto", angle: -0.5, w: 900, h: 700 },
];

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const j of jobs) {
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/render-lab/?variant=${j.variant}&angle=${j.angle}`, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForSelector("body[data-ready=true]", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(250);
  const png = `${OUT}/${j.name}.png`;
  await page.screenshot({ path: png, omitBackground: true });
  await page.close();
  execFileSync("python3", [
    "-c",
    `from PIL import Image
im=Image.open('${png}').convert('RGBA'); im=im.crop(im.getchannel('A').point(lambda a: 255 if a>12 else 0).getbbox())
im.save('${OUT}/${j.name}.webp', quality=86, method=6)
im.save('${OUT}/${j.name}.avif', quality=62)
print('${j.name}', im.size)`,
  ], { stdio: "inherit" });
  fs.unlinkSync(png);
}
await browser.close();
