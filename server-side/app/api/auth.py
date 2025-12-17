from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.auth_service import (
   	verify_password,
    password_hashed,
    create_access_token,
    create_refresh_token,
    decode_token
)

COOKIE_NAME = 'refresh_token'

router = APIRouter(prefix='/auth', tags=["authentication"])


@router.post('/register', response_model=UserResponse)
async def register(data: UserCreate, db: Session = Depends(get_db)):
	existing_user = db.query(User).filter(User.email == data.email).first()
	if existing_user:
		raise HTTPException(400, "User already exists")
	
	new_user = User(
		email = data.email,
		hashed_password = password_hashed(data.password)
	)

	db.add(new_user)
	db.commit()
	db.refresh(new_user)

	return new_user

@router.post('/login', response_model=Token)
async def login(data: UserCreate, response: Response, db: Session = Depends(get_db)):
	user = db.query(User).filter(User.email == data.email).first()

	if not user or not verify_password(data.password, user.hashed_password):
		raise HTTPException(401, "Wrong credentials")
	
	access = create_access_token(user)
	refresh = create_refresh_token(user)

	response.set_cookie(
        key=COOKIE_NAME,
        value=refresh,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60*60*24*30,
        path="/"
    )

	return {"access_token": access, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(response: Response, request: Request, db: Session = Depends(get_db)):
    refresh = request.cookies.get(COOKIE_NAME)

    if not refresh:
        raise HTTPException(401, "Missing refresh cookie")

    payload = decode_token(refresh, "refresh")
    if not payload:
        raise HTTPException(401, "Invalid refresh token")

    email = payload["sub"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "User not found")

    new_access = create_access_token(user)
    new_refresh = create_refresh_token(user)

    response.set_cookie(
        key=COOKIE_NAME,
        value=new_refresh,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60*60*24*30,
        path="/"
    )

    return {"access_token": new_access, "token_type": "bearer"}

@router.post('/logout')
def logout(response: Response):
      response.delete_cookie('refresh_token', path='/')
      return {"detail": "Logged out"}