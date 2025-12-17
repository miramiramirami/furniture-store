from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.order_service import OrderService
from app.schemas.orders import OrderCreate, OrderResponse
from app.api.dependencies import get_current_user
from app.services.payment_service import create_yookassa_payment
from app.models.orders import Order
from app.models.user import User
from typing import List


router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=dict)
def create_order_payment(
    order_data: OrderCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    db_order = OrderService.create_order(db, order_data, user.id)

    try:
        payment = create_yookassa_payment(db_order)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment creation failed: {str(e)}")

    return {
        "order_id": db_order.id,
        "amount": db_order.amount,
        "payment_url": payment["confirmation"]["confirmation_url"]
    }

@router.get("/me", response_model=List[OrderResponse])
def get_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.id.desc()).all()
        result = []

        for order in orders:
            order_data = {
                "id": order.id,
                "amount": order.amount,
                "status": order.status,
                "payment_id": order.payment_id,
                "address": order.address,
                "phone": order.phone,
                "user_email": current_user.email,
                "items": order.items
            }
            result.append(order_data)

        return result

    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch orders")

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    order = OrderService.get_order(db, order_id)
    if not order or order.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    return {
        "id": order.id,
        "amount": order.amount,
        "status": order.status,
        "payment_id": order.payment_id,
        "address": order.address,
        "phone": order.phone,
        "user_email": user.email,
        "items": order.items
    }
