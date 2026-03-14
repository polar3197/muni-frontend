import os
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

from db.models import Member

JWT_SECRET = os.getenv("JWT_SECRET")
HASH_ALGORITHM = "HS256"

def create_token(member: Member):

    payload = {
        "sub": str(member.id),
        "exp": (datetime.utcnow() + timedelta(hours=2)).timestamp()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=HASH_ALGORITHM)
