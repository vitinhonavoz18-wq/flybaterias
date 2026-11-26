// Uso: node scripts/shot-lab.mjs <variant> <angle> <out> [w] [h] [bg]
import { chromium } from "./pw.mjs";
const [variant = "hero", angle = "-0.55", out = "lab.png", w = "900", h = "700", bg = ""] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
p.on("console", (m) => m.type() === "error" && console.log("console:", m.text()));
await p.goto(`http://localhost:3100/render-lab/?variant=${variant}&angle=${angle}`, { waitUntil: "networkidle", timeout: 120000 });
await p.waitForSelector("body[data-ready=true]", { timeout: 60000, state: "attached" });
if (bg) await p.evaluate((c) => (document.body.style.background = c), bg);
await p.waitForTimeout(300);
await p.screenshot({ path: out, omitBackground: !bg });
await b.close();
