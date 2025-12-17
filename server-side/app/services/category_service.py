import os
from uuid import uuid4
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.category import Category
from app.models.category_images import CategoryImage
from app.schemas.categories import CategoryCreate

UPLOAD_DIR = "static/uploads/categories"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class CategoryService:
    @staticmethod
    def get_categories(db: Session) -> List[Category]:
        return db.query(Category).order_by(Category.id.desc()).all()
    
    @staticmethod
    def get_latest_categories(db: Session) -> List[Category]:
        return db.query(Category).order_by(Category.id.desc()).limit(3).all()
    
    @staticmethod
    def get_category(db: Session, id: int):
        return db.query(Category).filter(Category.id == id).first()

    @staticmethod
    def create_category(db: Session, category_data: CategoryCreate, files: Optional[List[UploadFile]] = None) -> Category:
        db_item = Category(**category_data.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        
        if files: 
            for file in files:
                filename = f"{uuid4().hex}_{file.filename}"
                filepath = os.path.join(UPLOAD_DIR, filename)

                with open(filepath, 'wb') as f:
                    f.write(file.file.read())

                img = CategoryImage(url = f'/{filepath}', category_id = db_item.id)
                db.add(img)

            db.commit()
            db.refresh(db_item)

        return db_item  
    
    @staticmethod
    def edit_category(
        db: Session, category_id: int, category_data: CategoryCreate, files: Optional[List[UploadFile]] = None):

        category = CategoryService.get_category(db, category_id)

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {category_id} not found"
            )   

        category.title = category_data.title
        category.description = category_data.description

        db.commit()
        db.refresh(category)

        if files:
            for img in category.images:
                try:
                    os.remove(img.url.lstrip("/"))
                except:
                    pass
                db.delete(img)

            db.commit()

            for file in files:
                filename = f"{uuid4().hex}_{file.filename}"
                filepath = os.path.join(UPLOAD_DIR, filename)

                with open(filepath, "wb") as f:
                    f.write(file.file.read())

                img = CategoryImage(url=f"/{filepath}", category_id=category.id)
                db.add(img)

        db.commit()

        db.refresh(category)
        return category
  
    @staticmethod 
    def delete_category(db: Session, id: int):
        category = CategoryService.get_category(db, id)

        if not category:
            return False
        
        db.delete(category)
        db.commit()
        return True