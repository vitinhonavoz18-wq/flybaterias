/** Gera public/og-image.jpg (1200x630). Requer `npm run dev -- -p 3100`. */
import { chromium } from "./pw.mjs";
import { execFileSync } from "node:child_process";
const b = await chromium.launch();
for (const [v, name] of [["", "og-image"], ["bf", "og-black-friday"]]) {
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto((process.env.LAB_URL || "http://localhost:3100") + "/og-lab/?v=" + v, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(600);
  await p.screenshot({ path: `public/${name}.png` });
  await p.close();
  execFileSync("python3", ["-c", `from PIL import Image; Image.open('public/${name}.png').convert('RGB').save('public/${name}.jpg', quality=86, optimize=True, progressive=True)`]);
  execFileSync("rm", [`public/${name}.png`]);
  console.log(`${name}.jpg ok`);
}
