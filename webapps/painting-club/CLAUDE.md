# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack template: PostgreSQL + FastAPI + React + nginx, all containerized with Docker Compose.

## Commands

### Docker (primary development method)
```bash
docker compose up --build      # Start all services
docker compose down            # Stop all services
docker compose logs -f api     # Tail API logs
```

### Backend (FastAPI)
```bash
pip install -e .                           # Install local package for imports
pip install -r src/api/requirements.txt    # Install dependencies
pytest tests/                              # Run all tests
pytest tests/test_api.py -v                # Run specific test file
```

### Frontend (React/Vite)
```bash
cd src/ui
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run lint         # Run ESLint
```

## Architecture

```
Browser → nginx:80
            ├── /api/* → api:8000 (FastAPI)
            └── /*     → frontend:5173 (Vite)

api:8000 → db:5432 (PostgreSQL)
```

**Key paths:**
- `src/api/main.py` - FastAPI application with routes
- `src/db/client.py` - Async SQLAlchemy PostgreSQL client
- `src/db/queries.py` - SQL query builder
- `src/config.py` - Pydantic settings for DB configuration
- `src/nginx/nginx.conf` - Reverse proxy routing
- `src/ui/` - React frontend (Vite)

**Database pattern:** Query methods in `queries.py` return SQL strings → `client.get_result(query)` executes via async SQLAlchemy/asyncpg.

## Environment Variables

Set in `.env` (used by docker-compose):
```
PG_USER, PG_PASSWORD, PG_NAME, PG_HOST, PG_PORT
```

## Ports

- 80: nginx (external entry point)
- 8000: FastAPI (internal)
- 5173: Vite dev server (internal)
- 5432: PostgreSQL (internal)
