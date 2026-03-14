# src/db/session.py
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from db.database import engine

# Create session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# Dependency for FastAPI
def get_db():
    """Dependency for FastAPI routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Context manager for scripts
@contextmanager
def get_db_session():
    """Context manager for standalone scripts"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()