from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.favorites import UserFavoritesResponse
from app.api.dependencies import get_current_user
from app.services.favorites import FavoriteService
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/favorites", tags=["favorites"])

@router.api_route("/{product_id}", methods=["OPTIONS"])
async def options_favorites(product_id: int):
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        }
    )

@router.get('/', response_model=UserFavoritesResponse)
async def get(
    current_user: str = Depends(get_current_user)
):
	return FavoriteService.get(current_user)

@router.post("/{product_id}", response_model=dict)
async def add(
    product_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return FavoriteService.add(product_id, current_user, db)

@router.delete("/{product_id}")
async def remove(
    product_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    return FavoriteService.remove(product_id, current_user, db)