COMPOSE := docker compose

.PHONY: up down logs ps test lint migrate seed db-reset

up:
	cp -n .env.example .env || true
	$(COMPOSE) up --build -d


down:
	$(COMPOSE) down


logs:
	$(COMPOSE) logs -f --tail=200


ps:
	$(COMPOSE) ps


migrate:
	$(COMPOSE) exec api python -m alembic -c /app/alembic.ini upgrade head


seed:
	bash scripts/db_seed.sh


db-reset:
	bash scripts/db_reset.sh


test:
	PYTHONPATH=src pytest tests -q


lint:
	cd src/ui && npm run lint
