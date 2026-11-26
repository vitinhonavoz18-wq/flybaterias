/**
 * Worker de produção da FlyBaterias.
 * Serve o site estático (gerado pelo `next build` em out/) empacotado dentro do
 * próprio Worker, com cabeçalhos de segurança, cache e HTTPS obrigatório.
 * O mapa de arquivos (.worker/manifest.mjs) é gerado por scripts/build-worker.mjs.
 */
import { files, campaigns } from "../.worker/manifest.mjs";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://connect.facebook.net https://www.googleadservices.com https://googleads.g.doubleclick.net https://static.cloudflareinsights.com",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://*.facebook.com https://cloudflareinsights.com",
    "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://www.facebook.com",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; "),
};

function cacheControl(path) {
  if (path.startsWith("/_next/static/")) return "public, max-age=31536000, immutable";
  if (/\.(html|txt|xml)$/.test(path)) return "public, max-age=0, must-revalidate";
  if (path.startsWith("/fonts/")) return "public, max-age=31536000, immutable";
  return "public, max-age=2592000"; // imagens e ícones: 30 dias
}

/** Campanha ativa agora (relógio do servidor). CLOCK_OFFSET_MS só é usado em testes. */
function currentCampaign(now) {
  return campaigns.find((c) => now >= c.start && now <= c.end) || null;
}

function respond(path, entry, status, method, ctx) {
  const headers = new Headers(SECURITY_HEADERS);
  const isHtml = entry[1].startsWith("text/html");
  headers.set("Content-Type", entry[1]);
  if (ctx.campaign) headers.set("X-Campaign", ctx.campaign.id);
  if (isHtml) {
    // HTML sempre revalidado (a versão muda quando a campanha começa/termina)
    headers.set("Cache-Control", "no-cache");
    const res = new Response(method === "HEAD" ? null : entry[0], { status, headers });
    if (method === "HEAD") return res;
    // Hora do servidor para o contador corrigir relógios de aparelhos desajustados
    return new HTMLRewriter()
      .on("html", { element: (el) => el.setAttribute("data-server-now", String(ctx.now)) })
      .transform(res);
  }
  headers.set("Cache-Control", status === 200 ? cacheControl(path) : "no-store");
  headers.set("ETag", entry[2]);
  return new Response(method === "HEAD" ? null : entry[0], { status, headers });
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const now = Date.now() + (Number(env?.CLOCK_OFFSET_MS) || 0);
    const campaign = currentCampaign(now);
    const ctx = { now, campaign };
    const find = (p) => (campaign && campaign.files[p]) || files[p];

    // HTTP → HTTPS
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    let path;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      path = url.pathname;
    }
    if (path.includes("..")) path = "/";

    const lookup = path.endsWith("/") ? path + "index.html" : path;
    const entry = find(lookup);
    if (entry) {
      if (!entry[1].startsWith("text/html") && request.headers.get("If-None-Match") === entry[2]) {
        return new Response(null, { status: 304, headers: { ETag: entry[2], "Cache-Control": cacheControl(lookup) } });
      }
      return respond(lookup, entry, 200, request.method, ctx);
    }

    // URL sem barra final de uma página existente → redireciona para a versão canônica
    if (!path.endsWith("/") && find(path + "/index.html")) {
      url.pathname = path + "/";
      return Response.redirect(url.toString(), 301);
    }

    return respond("/404.html", find("/404.html"), 404, request.method, ctx);
  },
};

export default worker;
