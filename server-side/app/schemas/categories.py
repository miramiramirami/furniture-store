from pydantic import BaseModel
from typing import List

class CategoryImage(BaseModel):
      id: int
      url: str

      class Config:
            from_attributes = True

class CategoryBase(BaseModel):
	title: str
	description: str

class CategoryCreate(CategoryBase):
	pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    images: List[CategoryImage]

    class Config:
        from_attributes = True