from sqlalchemy import Table, Column, Integer, ForeignKey
from app.core.database import Base

favorite_products = Table(
    'favorite_products',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('product_id', Integer, ForeignKey('products.id'), primary_key=True)
)