#!/usr/bin/env bash
# Aplica migrations SQL ao Postgres do Supabase Docker (com tracking)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCKER_DIR="$ROOT/docker/supabase"
MIGRATIONS_DIR="$ROOT/supabase/migrations"

cd "$DOCKER_DIR"

if [ ! -f .env ]; then
  echo "Erro: $DOCKER_DIR/.env não existe. Execute scripts/bootstrap-supabase.sh primeiro."
  exit 1
fi

POSTGRES_PASSWORD="$(grep '^POSTGRES_PASSWORD=' .env | head -n1 | cut -d= -f2- | tr -d '\r"')"

echo "A aguardar Postgres..."
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 <<'SQL'
create table if not exists public.kulex_migrations (
  id text primary key,
  applied_at timestamptz not null default now()
);
SQL

for migration in "$MIGRATIONS_DIR"/*.sql; do
  [ -f "$migration" ] || continue
  name="$(basename "$migration")"

  already="$(docker compose exec -T db psql -U postgres -d postgres -tAc \
    "select 1 from public.kulex_migrations where id = '$name' limit 1" 2>/dev/null | tr -d '[:space:]')"

  if [ "$already" = "1" ]; then
    echo "↷ $name (já aplicada)"
    continue
  fi

  echo "→ $name"
  docker compose exec -T db psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "$migration"
  docker compose exec -T db psql -U postgres -d postgres -c \
    "insert into public.kulex_migrations (id) values ('$name') on conflict do nothing"
done

echo "Migrations aplicadas."
