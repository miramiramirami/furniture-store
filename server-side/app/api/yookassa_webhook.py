from fastapi import APIRouter, Request, HTTPException, Depends
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.services.order_service import OrderService

router = APIRouter()

@router.post("/webhook/yookassa")
async def yookassa_webhook(request: Request, db: Session = Depends(get_db)):
    payload = await request.json()
    
    order_id = payload.get("object", {}).get("metadata", {}).get("order_id")
    status = payload.get("object", {}).get("status")

    if not order_id:
        raise HTTPException(status_code=400, detail="No order_id in payload")
    
    order = OrderService.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if status == "succeeded":
        order.status = "paid"
        db.commit()
    
    elif status == "canceled":
        order.status = "canceled"
        db.commit()
    
    return {"ok": True}
