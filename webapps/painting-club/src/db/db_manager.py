from db.database import Base, engine
from db.models import Member

def init_db():
    print(f"Tables to create: {list(Base.metadata.tables.keys())}")  # Debug line
    Base.metadata.create_all(engine)
    print("Database tables created!")

def empty_db():
    print(f"Tables to drop: {list(Base.metadata.tables.keys())}")  # Debug line
    Base.metadata.drop_all(engine)
    print("Database tables dropped!")