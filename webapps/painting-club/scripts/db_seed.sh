#!/usr/bin/env bash
set -euo pipefail

docker compose exec -T db psql -U "${PG_USER:-postgres}" -d "${PG_NAME:-app}" <<'SQL'
INSERT INTO users (username, email)
VALUES ('demo', 'demo@example.com')
ON CONFLICT (username) DO NOTHING;
SQL

echo "Seed complete."
