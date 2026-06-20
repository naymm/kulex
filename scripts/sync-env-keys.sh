#!/usr/bin/env bash
# Copia ANON_KEY e URL do docker/supabase/.env para .env na raiz do projeto
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCKER_ENV="$ROOT/docker/supabase/.env"
APP_ENV="$ROOT/.env"

if [ ! -f "$DOCKER_ENV" ]; then
  echo "Erro: $DOCKER_ENV não encontrado. Execute npm run supabase:bootstrap primeiro."
  exit 1
fi

read_env() {
  grep "^$1=" "$DOCKER_ENV" | head -n1 | cut -d= -f2- | tr -d '\r"'
}

ANON_KEY="$(read_env ANON_KEY)"
PUBLISHABLE="$(read_env SUPABASE_PUBLISHABLE_KEY)"
URL="${KULEX_SUPABASE_URL:-http://127.0.0.1:8000}"

# React Native / supabase-js: usar JWT anon key (eyJ...), não a publishable key (sb_publishable_...)
KEY="${ANON_KEY:-$PUBLISHABLE}"

cat > "$APP_ENV" <<EOF
# Gerado por scripts/sync-env-keys.sh — não commitar
EXPO_PUBLIC_SUPABASE_URL=${URL}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${KEY}
EOF

echo "Escrito $APP_ENV"
echo "  EXPO_PUBLIC_SUPABASE_URL=${URL}"
echo "  EXPO_PUBLIC_SUPABASE_ANON_KEY=${KEY:0:20}..."
