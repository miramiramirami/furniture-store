from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class CategoryImage(Base):
	__tablename__ = 'category_images'

	id = Column(Integer, primary_key=True, index=True)
	url = Column(String, nullable = False)
	category_id = Column(Integer, ForeignKey('categories.id', ondelete='CASCADE'))

	category = relationship('Category', back_populates='images')