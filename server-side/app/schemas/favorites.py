from pydantic import BaseModel
from typing import List

class ProductImage(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True

class ProductInFavorite(BaseModel):
    id: int
    title: str
    description: str
    price: float
    images: List[ProductImage] = []  

    class Config:
        from_attributes = True

class UserFavoritesResponse(BaseModel):
    favorites: List[ProductInFavorite]
