// Carrega o Playwright local (se instalado) ou o global da máquina.
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";

const require = createRequire(import.meta.url);
let pw;
try {
  pw = require("playwright");
} catch {
  const root = execSync("npm root -g").toString().trim();
  pw = require(path.join(root, "playwright"));
}
export const { chromium, devices } = pw;
