from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.favorites import favorite_products  

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)

    favorited_by = relationship("User", secondary=favorite_products, back_populates="favorites")
    
    category = relationship("Category", back_populates="products")

    images = relationship("ProductImage", back_populates="product", cascade="all, delete")
