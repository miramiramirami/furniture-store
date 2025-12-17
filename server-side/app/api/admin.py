from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.schemas.products import  Product, ProductCreate
from app.schemas.categories import Category, CategoryCreate
from app.services.product_service import ProductService
from app.services.category_service import CategoryService
from app.models.orders import Order 
from app.schemas.orders import OrderResponse
from app.middleware.admin_auth import get_current_admin
from app.models.user import User
from app.services.order_service import OrderService

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post('/products', response_model=Product)
async def create_product_admin(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    
    product_data = ProductCreate(
        title=title,
        description=description,
        price=price,
        category_id=category_id
    )

    return ProductService.create_product(db, product_data, files)

@router.delete('/products/{product_id}')
def delete_product_admin(
    product_id: int, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    success = ProductService.delete_product(db, product_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {product_id} not found"
        )
    
    return {"detail": f"Category {product_id} deleted successfully"}

@router.put('/products/{product_id}', response_model=Product)
async def update_product_admin(
    product_id: int,
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product_data = ProductCreate(
        title=title,
        description=description,
        price=price,
        category_id=category_id
    )

    updated = ProductService.edit_product(db, product_id, product_data, files)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")

    return updated


@router.post('/category', response_model=Category)
def create_category_admin(
    title: str = Form(...),
    description: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    admin: User = Depends(get_current_admin)
):
    category_data = CategoryCreate(
        title=title,
        description=description,
    )

    return CategoryService.create_category(db, category_data, files)

@router.put('/category/{category_id}', response_model=Category)
async def update_product_admin(
    category_id: int,
    title: str = Form(...),
    description: str = Form(...),
    files: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    category_data = CategoryCreate(
        title=title,
        description=description,
    )

    category_data = CategoryCreate(title=title, description=description)

    updated = CategoryService.edit_category(db, category_id, category_data, files)
    if not updated:
        raise HTTPException(status_code=404, detail="Category not found")

    return updated

@router.delete('/category/{category_id}')
def delete_category_admin(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    success = CategoryService.delete_category(db, category_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {category_id} not found"
        )
    return {"detail": f"Category {category_id} deleted successfully"}


@router.get("/orders", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    orders = (
        db.query(Order)
        .options(
            joinedload(Order.user),
            joinedload(Order.items)
        ).order_by(Order.id.desc())
        .all()
    )

    return [
        {
            "id": o.id,
            "amount": o.amount,
            "status": o.status,
            "payment_id": o.payment_id,
            "address": o.address,
            "phone": o.phone,
            "user_email": o.user.email,  
            "items": o.items
        }
        for o in orders
    ]

@router.delete('/orders/{order_id}')
def delete_product_admin(
    order_id: int, 
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    success = OrderService.delete_order(db, order_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {order_id} not found"
        )
    
    return {"detail": f"Order {order_id} deleted successfully"}