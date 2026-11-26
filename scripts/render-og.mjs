/** Gera public/og-image.jpg (1200x630). Requer `npm run dev -- -p 3100`. */
import { chromium } from "./pw.mjs";
import { execFileSync } from "node:child_process";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto((process.env.LAB_URL || "http://localhost:3100") + "/og-lab/", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
await p.screenshot({ path: "public/og-image.png" });
await b.close();
execFileSync("python3", ["-c", "from PIL import Image; Image.open('public/og-image.png').convert('RGB').save('public/og-image.jpg', quality=86, optimize=True, progressive=True)"]);
execFileSync("rm", ["public/og-image.png"]);
console.log("og-image.jpg ok");
