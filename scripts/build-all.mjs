/**
 * Build completo para produção:
 *  1. Uma versão do site para cada campanha habilitada que AINDA NÃO TERMINOU
 *     (NEXT_PUBLIC_CAMPAIGN=<id>) → out-campaigns/<id>/
 *  2. O site original → out/
 *  3. out-campaigns/schedule.json com início/fim de cada campanha
 * O Worker escolhe qual versão servir pelo relógio do servidor.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";

const { campaigns } = JSON.parse(fs.readFileSync("src/config/campaigns.json", "utf8"));
const now = Date.now();
const pending = campaigns.filter((c) => c.enabled && Date.parse(c.endsAt) > now);

fs.rmSync("out-campaigns", { recursive: true, force: true });
fs.mkdirSync("out-campaigns", { recursive: true });

const run = (campaign) =>
  execSync("npx next build", { stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_CAMPAIGN: campaign } });

for (const c of pending) {
  console.log(`\n▶ Build da campanha: ${c.id} (${c.startsAt} → ${c.endsAt})`);
  run(c.id);
  fs.renameSync("out", `out-campaigns/${c.id}`);
}
console.log("\n▶ Build do site original");
run("");

const schedule = pending.map((c) => ({ id: c.id, startsAt: c.startsAt, endsAt: c.endsAt, start: Date.parse(c.startsAt), end: Date.parse(c.endsAt) }));
fs.writeFileSync("out-campaigns/schedule.json", JSON.stringify(schedule, null, 2));
console.log(`\n✔ ${pending.length} campanha(s) empacotada(s):`, schedule.map((s) => s.id).join(", ") || "nenhuma");
