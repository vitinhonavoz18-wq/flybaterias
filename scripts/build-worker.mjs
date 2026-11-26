/**
 * Gera .worker/manifest.mjs: importa cada arquivo do site como módulo binário
 * para o Worker servir sem depender do upload de "static assets".
 *  - files: site original (out/)
 *  - campaigns: versões de campanha (out-campaigns/<id>/) com início e fim
 * Arquivos idênticos entre versões são incluídos uma única vez.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DEST = path.resolve(".worker");
const SKIP = new Set(["/_headers", "/404/index.html", "/_not-found/index.html"]);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png",
  ".jpg": "image/jpeg", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(path.join(DEST, "f"), { recursive: true });

const bySha = new Map();
let imports = "";
let unique = 0;
let total = 0;

function collect(root) {
  const list = [];
  (function walk(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) walk(full);
      else list.push(full);
    }
  })(root);
  let entries = "";
  for (const full of list) {
    const rel = "/" + path.relative(root, full).split(path.sep).join("/");
    if (SKIP.has(rel)) continue;
    const buf = fs.readFileSync(full);
    const sha = crypto.createHash("sha1").update(buf).digest("hex");
    let name = bySha.get(sha);
    if (!name) {
      name = `f${unique++}`;
      bySha.set(sha, name);
      fs.writeFileSync(path.join(DEST, "f", `${name}.bin`), buf); // .bin → regra "Data" do Wrangler
      imports += `import ${name} from "./f/${name}.bin";\n`;
      total += buf.length;
    }
    const type = TYPES[path.extname(full)] || "application/octet-stream";
    entries += `  ${JSON.stringify(rel)}: [${name}, ${JSON.stringify(type)}, ${JSON.stringify('"' + sha.slice(0, 16) + '"')}],\n`;
  }
  return { entries, count: list.length };
}

const base = collect(path.resolve("out"));
let campaignsCode = "";
const schedulePath = path.resolve("out-campaigns/schedule.json");
const schedule = fs.existsSync(schedulePath) ? JSON.parse(fs.readFileSync(schedulePath, "utf8")) : [];
for (const s of schedule) {
  const dir = path.resolve("out-campaigns", s.id);
  if (!fs.existsSync(dir)) continue;
  const c = collect(dir);
  campaignsCode += `  { id: ${JSON.stringify(s.id)}, start: ${s.start}, end: ${s.end}, files: {\n${c.entries}  } },\n`;
}

fs.writeFileSync(path.join(DEST, "manifest.mjs"), `${imports}\nexport const files = {\n${base.entries}};\n\nexport const campaigns = [\n${campaignsCode}];\n`);
console.log(`Worker manifest: ${unique} arquivos únicos, ${(total / 1024 / 1024).toFixed(2)} MB; campanhas: ${schedule.map((s) => s.id).join(", ") || "nenhuma"}.`);
