from pydantic import BaseModel, Field
from typing import List, Annotated
from pydantic.types import StringConstraints

Phone = Annotated[
    str,
    StringConstraints(pattern=r"^\d{11}$")
]

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: int  

class OrderCreate(BaseModel):
    address: str = Field(..., min_length=5)
    phone: Phone
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: int

    class Config:
        orm_mode = True

class OrderResponse(BaseModel):
    id: int
    amount: int
    status: str
    payment_id: str
    address: str
    phone: str
    user_email: str
    items: List[OrderItemResponse] = []

    class Config:
        orm_mode = True
