from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True, index=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    amount = Column(Integer, nullable=False)  
    status = Column(String, default='pending')
    payment_id = Column(String, unique=True)

    address = Column(String, nullable=False)
    phone = Column(String(11), nullable=False)

    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")


class OrderItem(Base):
    __tablename__ = 'order_items'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'))
    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Integer, nullable=False)  

    order = relationship("Order", back_populates="items")