from pydantic import BaseModel
from typing import Optional, List
from app.schemas.categories import Category

class ProductImage(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True

class CategorySchema(BaseModel):
    id: int
    title: str

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    category_id: Optional[int] = None
   
    
class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    category: Optional[Category]
    images: List[ProductImage] = []

    class Config:
        from_attributes = True