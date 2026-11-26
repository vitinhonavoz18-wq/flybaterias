/**
 * Worker de produção da FlyBaterias.
 * Serve o site estático (gerado pelo `next build` em out/) empacotado dentro do
 * próprio Worker, com cabeçalhos de segurança, cache e HTTPS obrigatório.
 * O mapa de arquivos (.worker/manifest.mjs) é gerado por scripts/build-worker.mjs.
 */
import { files } from "../.worker/manifest.mjs";

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

function respond(path, entry, status, method) {
  const headers = new Headers(SECURITY_HEADERS);
  headers.set("Content-Type", entry[1]);
  headers.set("Cache-Control", status === 200 ? cacheControl(path) : "no-store");
  headers.set("ETag", entry[2]);
  return new Response(method === "HEAD" ? null : entry[0], { status, headers });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

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
    const entry = files[lookup];
    if (entry) {
      if (request.headers.get("If-None-Match") === entry[2]) {
        return new Response(null, { status: 304, headers: { ETag: entry[2], "Cache-Control": cacheControl(lookup) } });
      }
      return respond(lookup, entry, 200, request.method);
    }

    // URL sem barra final de uma página existente → redireciona para a versão canônica
    if (!path.endsWith("/") && files[path + "/index.html"]) {
      url.pathname = path + "/";
      return Response.redirect(url.toString(), 301);
    }

    return respond("/404.html", files["/404.html"], 404, request.method);
  },
};
