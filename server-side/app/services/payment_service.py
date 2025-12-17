import requests
import base64
from app.models.orders import Order
import uuid

YOOKASSA_SHOP_ID = "1223068"
YOOKASSA_SECRET_KEY = "test_roYI3PluVNG8dx2e6foHQRFomlJov1dE-9GANHJMQT8"

def create_yookassa_payment(order: Order):
    auth = f"{YOOKASSA_SHOP_ID}:{YOOKASSA_SECRET_KEY}"
    auth_bytes = auth.encode("utf-8")
    auth_b64 = base64.b64encode(auth_bytes).decode("utf-8")

    url = "https://api.yookassa.ru/v3/payments"
    headers = {
        "Authorization": f"Basic {auth_b64}",
        "Content-Type": "application/json",
        "Idempotence-Key": str(uuid.uuid4())
    }
    data = {
        "amount": {
            "value": f"{order.amount:.2f}", 
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://localhost:3000/profile"
        },
        "description": f"Order #{order.id}",
        "metadata": {
            "order_id": order.id
        }
    }

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise Exception(f"Payment creation failed: {e.response.text}")

    return response.json()
