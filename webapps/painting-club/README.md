# fs-template

Default full-stack starter with FastAPI, React (Vite), PostgreSQL, and nginx behind Docker Compose.

## What you get
- FastAPI API with health/readiness endpoints
- Async SQLAlchemy + PostgreSQL
- Alembic migrations (auto-run on API startup)
- React app wired to `/api`
- One-command local spinup via `Makefile`

## Project structure
- `src/api` FastAPI app
- `src/db` SQLAlchemy models and DB session setup
- `src/ui` React app
- `src/nginx/nginx.conf` reverse proxy config
- `alembic` migration scripts
- `docker-compose.yaml` local orchestration

## Quick start
1. Create env file:
```bash
cp .env.example .env
```
2. Start the stack:
```bash
make up
```
3. Open the app:
- `http://localhost`

## Default endpoints
- `GET /api/health` liveness
- `GET /api/ready` readiness (checks DB connection)
- `GET /api/users` list users
- `POST /api/users` create user

Example request:
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"demo2","email":"demo2@example.com"}'
```

## Common commands
```bash
make up         # build and start all containers
make down       # stop containers
make logs       # tail service logs
make ps         # container status
make migrate    # run alembic upgrade head
make seed       # insert demo user
make db-reset   # drop schema + re-run migrations
make test       # run backend tests locally
make lint       # run frontend eslint
```

## Environment variables
Set in `.env`:
- `PG_USER`
- `PG_PASSWORD`
- `PG_NAME`
- `PG_HOST`
- `PG_PORT`

For Docker Compose defaults, see `.env.example`.

## Notes
- API container runs migrations before starting Uvicorn.
- `nginx` proxies `/api/*` to FastAPI and `/` to the React app.
