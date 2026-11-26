/**
 * Gera .worker/manifest.mjs: importa cada arquivo de out/ como módulo binário
 * para o Worker servir o site sem depender do upload de "static assets".
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const OUT = path.resolve("out");
const DEST = path.resolve(".worker");
const SKIP = new Set(["/_headers", "/404/index.html", "/_not-found/index.html"]);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

const list = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else list.push(full);
  }
})(OUT);

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });
let imports = "";
let entries = "";
let total = 0;
list.forEach((full, i) => {
  const rel = "/" + path.relative(OUT, full).split(path.sep).join("/");
  if (SKIP.has(rel)) return;
  const type = TYPES[path.extname(full)] || "application/octet-stream";
  const buf = fs.readFileSync(full);
  total += buf.length;
  const etag = '"' + crypto.createHash("sha1").update(buf).digest("hex").slice(0, 16) + '"';
  // .bin garante que o Wrangler trate o arquivo como binário (regra "Data")
  const target = path.join(DEST, "f", String(i) + ".bin");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(full, target);
  imports += `import f${i} from "./f/${i}.bin";\n`;
  entries += `  ${JSON.stringify(rel)}: [f${i}, ${JSON.stringify(type)}, ${JSON.stringify(etag)}],\n`;
});
fs.writeFileSync(path.join(DEST, "manifest.mjs"), `${imports}\nexport const files = {\n${entries}};\n`);
console.log(`Worker manifest: ${entries.split("\n").length - 1} arquivos, ${(total / 1024 / 1024).toFixed(2)} MB (antes da compressão).`);
