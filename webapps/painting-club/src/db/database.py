# src/db/base.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from config import PostgreSQLConfig

pgconf = PostgreSQLConfig()
# DATABASE_URL = pgconf.connection_string_sync.replace('db:', 'localhost:')
DATABASE_URL = pgconf.connection_string_sync
print(DATABASE_URL)

# Create engine
engine = create_engine(DATABASE_URL, echo=True)  # echo=True shows SQL queries

# Create Base class for models
Base = declarative_base()