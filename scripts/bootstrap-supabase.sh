#!/usr/bin/env bash
# Bootstrap Supabase self-hosted para desenvolvimento local (Kulex)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCKER_DIR="$ROOT/docker/supabase"

cd "$DOCKER_DIR"

if [ ! -f docker-compose.yml ]; then
  echo "Erro: docker-compose.yml não encontrado em $DOCKER_DIR"
  echo "Execute primeiro: git sparse-checkout do repositório supabase/docker"
  exit 1
fi

if [ ! -f .env.example ]; then
  echo "A transferir .env.example do repositório oficial..."
  curl -fsSL \
    "https://raw.githubusercontent.com/supabase/supabase/master/docker/.env.example" \
    -o .env.example
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Criado .env a partir de .env.example"
  NEED_VOLUME_RESET=1
elif [ "${KULEX_SUPABASE_RESET:-}" = "1" ]; then
  NEED_VOLUME_RESET=1
fi

if [ "${NEED_VOLUME_RESET:-0}" = "1" ]; then
  echo "A recriar volumes Docker (primeira vez ou reset)..."
  docker compose down -v 2>/dev/null || true
  if [ -d volumes/db/data ]; then
    echo "A remover volumes/db/data..."
    rm -rf volumes/db/data
  fi
fi

# URLs locais (simulador iOS/Android: use o IP da máquina em vez de localhost)
LOCAL_URL="${KULEX_SUPABASE_URL:-http://127.0.0.1:8000}"

patch_env() {
  local key="$1"
  local value="$2"
  if grep -q "^${key}=" .env; then
    sed -i.bak "s|^${key}=.*|${key}=${value}|" .env
  else
    echo "${key}=${value}" >> .env
  fi
}

patch_env "SUPABASE_PUBLIC_URL" "$LOCAL_URL"
patch_env "API_EXTERNAL_URL" "$LOCAL_URL"
patch_env "SITE_URL" "http://localhost:3000"
patch_env "ENABLE_EMAIL_AUTOCONFIRM" "true"
patch_env "ENABLE_PHONE_AUTOCONFIRM" "true"
patch_env "DISABLE_SIGNUP" "false"

rm -f .env.bak

echo "A gerar chaves JWT e passwords..."
if [ "${NEED_VOLUME_RESET:-0}" = "1" ]; then
  sh utils/generate-keys.sh --update-env 2>/dev/null || sh utils/generate-keys.sh --update-env
else
  echo "(A manter chaves existentes em .env — use KULEX_SUPABASE_RESET=1 para regenerar)"
fi

if [ -f utils/add-new-auth-keys.sh ]; then
  sh utils/add-new-auth-keys.sh --update-env 2>/dev/null || true
fi

echo ""
echo "A puxar imagens Docker (pode demorar na primeira vez)..."
docker compose pull

echo ""
echo "A iniciar Supabase..."
docker compose up -d --wait

echo ""
echo "A aplicar schema Kulex..."
"$ROOT/scripts/apply-migrations.sh"

echo ""
echo "=== Supabase pronto ==="
echo "API + Studio: $LOCAL_URL"
echo "  Utilizador Studio: supabase (ver DASHBOARD_PASSWORD em docker/supabase/.env)"
echo ""
echo "Copie as chaves para o .env na raiz do projeto:"
echo "  npm run supabase:keys"
echo ""
echo "Depois reinicie o Expo: npm run dev"
