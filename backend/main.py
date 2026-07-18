from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db, limiter
from models import Order, OrderItem, User, Product
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from fastapi import Response, Form

from payfast_utils import generate_signature, validate_itn, PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_URL

app = FastAPI(title="SquadGear API")

# Rate Limiting Setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# --- Endpoints ---

@app.get("/api/orders")
@limiter.limit("20/minute")
async def get_orders(request: Request, db: AsyncSession = Depends(get_db)):
    # Fetch orders from database with related users and items
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.user))
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .order_by(Order.created_at.desc())
    )
    db_orders = result.scalars().all()
    
    # Format to match the frontend expectations
    formatted_orders = []
    for order in db_orders:
        formatted_orders.append({
            "id": order.id,
            "customerName": f"{order.user.first_name} {order.user.company_name or ''}".strip() if order.user else "Unknown",
            "totalAmount": float(order.total_amount),
            "status": order.status,
            "date": order.created_at.isoformat() + "Z",
            "items": [
                {
                    "id": item.id,
                    "productName": item.product.name if item.product else "Unknown Product",
                    "quantity": item.quantity,
                    "price": float(item.price_at_purchase)
                } for item in order.items
            ]
        })
    return formatted_orders

@app.put("/api/orders/{order_id}/status")
@limiter.limit("10/minute")
async def update_order_status(request: Request, order_id: str, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        return {"error": "Order not found"}
        
    order.status = status
    await db.commit()
    
    # Broadcast the change via WebSockets
    await manager.broadcast({
        "type": "ORDER_UPDATED",
        "order_id": order_id,
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {"id": order.id, "status": order.status}

@app.websocket("/ws/admin")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/checkout")
@limiter.limit("5/minute")
async def create_checkout(request: Request, db: AsyncSession = Depends(get_db)):
    # This is a simplified checkout. In reality, you'd receive cart items in the request body.
    # For now, let's create a dummy order for testing the gateway.
    
    # Check if a test user exists, otherwise create one
    result = await db.execute(select(User).where(User.email == "test@squadgear.com"))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(
            email="test@squadgear.com", 
            password_hash="fake", 
            account_type="customer", 
            first_name="Test", 
            company_name="SquadGear"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    order = Order(user_id=user.id, total_amount=150.00, status="pending")
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Generate Payfast form data
    # Note: notify_url must be publicly accessible (e.g., via ngrok) for Payfast to send the ITN
    payfast_data = {
        "merchant_id": PAYFAST_MERCHANT_ID,
        "merchant_key": PAYFAST_MERCHANT_KEY,
        "return_url": "http://localhost:5173/payment-success",
        "cancel_url": "http://localhost:5173/payment-cancelled",
        "notify_url": "https://clean-tools-win.loca.lt/api/payfast/itn",
        "name_first": user.first_name,
        "email_address": user.email,
        "m_payment_id": order.id,
        "amount": f"{order.total_amount:.2f}",
        "item_name": "SquadGear Order",
    }
    
    signature = generate_signature(payfast_data)
    payfast_data["signature"] = signature
    
    return {"payfast_url": PAYFAST_URL, "payment_data": payfast_data}

@app.post("/api/payfast/itn")
async def payfast_itn(request: Request, db: AsyncSession = Depends(get_db)):
    form_data = await request.form()
    data_dict = dict(form_data)
    
    client_host = request.client.host if request.client else ""
    
    is_valid = await validate_itn(data_dict, client_host)
    if not is_valid:
        return Response(status_code=400, content="Invalid ITN")
        
    order_id = data_dict.get("m_payment_id")
    payment_status = data_dict.get("payment_status")
    
    if order_id and payment_status == "COMPLETE":
        result = await db.execute(select(Order).where(Order.id == order_id))
        order = result.scalar_one_or_none()
        if order:
            order.status = "paid"
            await db.commit()
            
            # Broadcast the change via WebSockets
            await manager.broadcast({
                "type": "ORDER_UPDATED",
                "order_id": order.id,
                "status": "paid",
                "timestamp": datetime.utcnow().isoformat()
            })
            
    return Response(status_code=200, content="OK")
