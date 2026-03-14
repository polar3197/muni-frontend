#!/usr/bin/env bash
set -euo pipefail

docker compose exec -T db psql -U "${PG_USER:-postgres}" -d "${PG_NAME:-app}" <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO CURRENT_USER;
SQL

docker compose exec api python -m alembic -c /app/alembic.ini upgrade head

echo "Database reset and migrated."
