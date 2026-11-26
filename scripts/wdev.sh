#!/usr/bin/env bash
# Sobe o Worker localmente com o relógio simulado. Uso: scripts/wdev.sh "2026-11-28T12:00:00-03:00" [porta]
TARGET="$1"; PORT="${2:-8799}"
OFFSET=$(node -e "console.log(Date.parse(process.argv[1]) - Date.now())" "$TARGET")
pkill -f "wrangler dev" 2>/dev/null; sleep 1
CLOUDFLARE_API_TOKEN=proxy-injected WRANGLER_SEND_METRICS=false nohup npx wrangler dev --local --local-protocol https --port "$PORT" --var "CLOCK_OFFSET_MS:$OFFSET" > /tmp/wdev-$PORT.log 2>&1 &
for i in $(seq 1 40); do curl -sk -o /dev/null --noproxy '*' "https://127.0.0.1:$PORT/" && break; sleep 1; done
echo "Worker em https://127.0.0.1:$PORT (relógio simulado: $TARGET)"
