from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.services.auth_service import decode_token
from app.models.user import User
from app.core.database import get_db

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db) 
):
    if not credentials:
        raise HTTPException(401, "Missing token")
    
    token = credentials.credentials
    payload = decode_token(token, 'access')

    if not payload:
        raise HTTPException(401, "Invalid or expired access token")
    
    email = payload['sub']
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(404, "User not found")

    return user

async def get_current_admin(
    user: User = Depends(get_current_user)
):
    if not user.is_admin:
        raise HTTPException(403, "Admin access required")
    return user