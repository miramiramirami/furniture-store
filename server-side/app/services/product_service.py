import os
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.models.products import Product
from app.schemas.products import ProductCreate
from app.models.product_images import ProductImage
from fastapi import UploadFile, HTTPException, status

UPLOAD_DIR = "static/uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class ProductService:
    @staticmethod
    def get_products(db: Session) -> List[Product]:
        return db.query(Product).order_by(Product.id.desc()).options(joinedload(Product.category)).all()
    
    @staticmethod
    def get_latest_products(db: Session) -> List[Product]:
        return db.query(Product).order_by(Product.id.desc()).limit(4).all()
    
    @staticmethod
    def get_product(db: Session, id: int):
        return db.query(Product).options(joinedload(Product.category)).filter(Product.id == id).first()

    @staticmethod
    def create_product(db: Session, product_data: ProductCreate, files: Optional[List[UploadFile]] = None) -> Product:
        db_item = Product(**product_data.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item, attribute_names=['category'])

        if files: 
            for file in files:
                filename = f"{uuid4().hex}_{file.filename}"
                filepath = os.path.join(UPLOAD_DIR, filename)
                with open(filepath, "wb") as f:
                    f.write(file.file.read())
                img = ProductImage(url=f"/{filepath}", product_id=db_item.id)
                db.add(img)

            db.commit()  
            db.refresh(db_item)  

        return db_item
    
    @staticmethod
    def edit_product(
        db: Session, product_id: int, product_data: ProductCreate, files: Optional[List[UploadFile]] = None):

        product = ProductService.get_product(db, product_id)

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found"
            )   

        product.title = product_data.title
        product.description = product_data.description
        product.price = product_data.price
        product.category_id = product_data.category_id

        db.commit()
        db.refresh(product)



        if files:
            for img in product.images:
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

                img = ProductImage(url=f"/{filepath}", product_id=product.id)
                db.add(img)

        db.commit()

        db.refresh(product)
        return product
    
    @staticmethod
    def delete_product(db: Session, id: int):
        product = ProductService.get_product(db, id)

        if not product:
            return False
        
        db.delete(product)
        db.commit()
        return True