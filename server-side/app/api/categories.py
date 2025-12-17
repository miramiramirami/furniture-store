from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.categories import Category, CategoryCreate
from app.services.category_service import CategoryService
from app.models.products import Product as ProductModel
from app.schemas.products import Product as ProductSchema

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("/", response_model=list[Category])
def read_categories(db: Session = Depends(get_db)):
    items = CategoryService.get_categories(db)
    return items

@router.get('/latest', response_model=list[Category])
def get_latest_categories(db: Session = Depends(get_db)):
    return CategoryService.get_latest_categories(db)

@router.get('/{category_id}', response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    return CategoryService.get_category(db, category_id)

@router.get('/{id}/products', response_model=list[ProductSchema])
def get_products_by_category(id: int, db: Session = Depends(get_db)):
    return db.query(ProductModel).filter(ProductModel.category_id == id).all()