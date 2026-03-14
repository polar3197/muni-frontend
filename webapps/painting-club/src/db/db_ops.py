# from jose import JWTError, jwt
# from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.orm import Session
import bcrypt

from db.models import Member

def get_members(db):
    rows = db.query(Member).all()
    print(rows)
    return rows

# Login a user
def login_user(db: Session, username: str, password: str):
    # search for username from db
    member = db.query(Member).filter(Member.username == username).first()
    if member and bcrypt.checkpw(password.encode(), member.password_hash.encode()): 
        return member
    else:
        return None

def create_member(db: Session, username: str, password: str) -> Member:
    # hash password and save member in db
    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()
    member = Member(
        username=username,
        password_hash=password_hash
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    print(f"Successfully created new user: {username}")
    return member

def get_member(db: Session, member_id) -> Profile:

    
