from fastapi import HTTPException
from app.models.products import Product

class FavoriteService:
	def get(current_user):
		return {"favorites": current_user.favorites}
	
	def add(product_id, current_user, db):
		product = db.query(Product).filter(Product.id == product_id).first()
		
		if not product:
			raise HTTPException(status_code=404, detail="Товар не найден")
    
		if product in current_user.favorites:  
			raise HTTPException(status_code=400, detail="Товар уже в избранном")
		
		current_user.favorites.append(product)
		db.commit()
		
		return {"message": "Товар был добавлен в избранное", "product_id": product_id}
	
	def remove(product_id, current_user, db):
		product = db.query(Product).filter(Product.id == product_id).first()

		if not product:
			raise HTTPException(status_code=404, detail="Товар не найден")
    
		if product not in current_user.favorites:
			raise HTTPException(status_code=400, detail="Товара нет в избранных")
		
		current_user.favorites.remove(product)
		db.commit()
		
		return {"message": "Товар удален из избранного"}

	