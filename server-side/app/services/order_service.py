from sqlalchemy.orm import Session
from app.models.orders import Order, OrderItem
from app.schemas.orders import OrderCreate
import uuid
from sqlalchemy.exc import SQLAlchemyError

class OrderService:
    @staticmethod
    def create_order(db: Session, order_data: OrderCreate, user_id: int) -> Order:
        if not order_data.items:
            raise ValueError("Order must contain at least one item")

        for item in order_data.items:
            if item.quantity <= 0 or item.price < 0:
                raise ValueError("Item quantity must be > 0 and price >= 0")

        total_amount = sum(item.price * item.quantity for item in order_data.items)
        payment_id = str(uuid.uuid4())

        db_order = Order(
            user_id=user_id,
            amount=total_amount,
            status='pending',
            payment_id=payment_id,
            address=order_data.address,
            phone=order_data.phone,
        )

        try:
            db.add(db_order)
            db.commit()
            db.refresh(db_order)

            for item in order_data.items:
                db_item = OrderItem(
                    order_id=db_order.id,
                    product_id=item.product_id,
                    quantity=item.quantity,
                    price=item.price
                )
                db.add(db_item)

            db.commit()
            db.refresh(db_order)

        except SQLAlchemyError as e:
            db.rollback()
            raise RuntimeError(f"Failed to create order: {str(e)}")

        return db_order

    @staticmethod
    def get_user_orders(db: Session, user_id: int):
        return db.query(Order).filter(Order.user_id == user_id).order_by(Order.id.desc()).all()

    @staticmethod
    def get_order(db: Session, order_id: int):
        return db.query(Order).filter(Order.id == order_id).first()
    
    @staticmethod
    def delete_order(db: Session, order_id: int):
        order = OrderService.get_order(db, order_id)

        if not order: 
            return False
        
        db.delete(order)
        db.commit()
        return True
