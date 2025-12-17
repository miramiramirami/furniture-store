from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.api.products import router as product_router
from app.api.auth import router as auth_router
from app.api.favorites import router as favorites_router 
from app.api.categories import router as categories_router
from app.api.admin import router as admin_router
from app.api.order import router as order_router
from app.core.database import engine, Base 
from app.api.yookassa_webhook import router as yookassa_webhook
from fastapi.responses import JSONResponse

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "http://127.0.0.1:3000"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

app.mount('/static', StaticFiles(directory='static'), name='static')


app.include_router(product_router)
app.include_router(auth_router)
app.include_router(favorites_router)
app.include_router(categories_router)
app.include_router(admin_router)
app.include_router(order_router)
app.include_router(yookassa_webhook)