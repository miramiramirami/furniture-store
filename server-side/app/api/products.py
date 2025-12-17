from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.products import Product, ProductCreate
from app.services.product_service import ProductService

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=list[Product])
def read_products(db: Session = Depends(get_db)):
    items = ProductService.get_products(db)
    return items

@router.get('/latest', response_model=list[Product])
def get_latest_products(db: Session = Depends(get_db)):
    return ProductService.get_latest_products(db)

@router.get('/{product_id}', response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return ProductService.get_product(db, product_id)


