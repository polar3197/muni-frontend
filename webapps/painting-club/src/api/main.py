from fastapi import Depends, FastAPI, HTTPException, status
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from jose import JWTError, jwt
from typing import List
import uuid

from db.db_ops import create_member, login_user, get_members
from db.session import get_db
from db.db_manager import init_db, empty_db
from db.models import Member

from api.auth import create_token

class MemberIn(BaseModel):
    username: str
    password: str

class MemberOut(BaseModel):
    id: uuid.UUID
    username: str

class Profile(BaseModel):
    first_name: str
    last_name: str
    media: List[str]   # just a list of media that the member works with
    bio: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# create members table
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield
    # empty_db()

app = FastAPI(lifespan=lifespan, title="painting-club", root_path="/api")

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

# ====================== MEMBER DETAILS =========================

# create new member
@app.post("/members/new", response_model=MemberOut, status_code=status.HTTP_201_CREATED)
def create_member_endpoint(payload: MemberIn, db: Session = Depends(get_db)) -> MemberOut:
    try:
        member = create_member(db, payload.username, payload.password)
        return MemberOut(id=member.id, username=member.username)
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Username already exists")

# login existing member
@app.post("/members/login", response_model=Token)
def login_member_endpoint(payload: MemberIn, db: Session = Depends(get_db)) -> Token:
    # will return JWT token
    member = login_user(db, payload.username, payload.password)
    if not member:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(member)
    return Token(access_token=token)

# return list of all members
@app.get("/members", response_model=list[MemberOut])
def list_members(db: Session = Depends(get_db)) -> list[MemberOut]:
    members = get_members(db)
    print(members)
    return [MemberOut(id=m.id, username=m.username) for m in members]

@app.get("members/{username}")
async def get_member(userna: str) -> Profile:
