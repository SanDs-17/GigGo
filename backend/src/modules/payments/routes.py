from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import razorpay
from src.dependencies.database import get_db
from src.dependencies.auth import get_current_user
from src.repositories.booking_repo import BookingRepository
from src.models import User
from src.models.domain import BookingStatus
from src.core.config import settings

router = APIRouter(prefix="/payments", tags=["payments"])

# Initialize Razorpay Client
# If keys are missing, we can handle it gracefully but let's assume they are provided
razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateOrderRequest(BaseModel):
    booking_id: int

class CreateOrderResponse(BaseModel):
    razorpay_order_id: str
    amount: int
    currency: str = "INR"

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order", response_model=CreateOrderResponse)
def create_order(
    request: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = BookingRepository(db)
    booking = repo.get_by_id(request.booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if booking.status != BookingStatus.confirmed:
        raise HTTPException(status_code=400, detail="Booking must be confirmed to pay advance")

    # Advance amount is already calculated and stored in DB (in INR)
    # Razorpay expects amount in paise (1 INR = 100 paise)
    amount_in_paise = booking.advance_amount * 100
    
    # Create order in Razorpay
    try:
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"receipt_booking_{booking.id}",
            "notes": {
                "booking_ref": booking.booking_ref
            }
        }
        order = razorpay_client.order.create(data=order_data)
        
        # Save order id to database
        booking.razorpay_order_id = order['id']
        repo.update(booking)
        
        return CreateOrderResponse(
            razorpay_order_id=order['id'],
            amount=amount_in_paise
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
def verify_payment(
    request: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = BookingRepository(db)
    
    # Validate signature with Razorpay
    try:
        params_dict = {
            'razorpay_order_id': request.razorpay_order_id,
            'razorpay_payment_id': request.razorpay_payment_id,
            'razorpay_signature': request.razorpay_signature
        }
        razorpay_client.utility.verify_payment_signature(params_dict)
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid payment signature")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    # Find the booking with this order_id
    booking = db.query(repo.model_class).filter(repo.model_class.razorpay_order_id == request.razorpay_order_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found for this order ID")
        
    if booking.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    booking.razorpay_payment_id = request.razorpay_payment_id
    
    repo.update(booking)
    
    return {"status": "success", "message": "Payment verified successfully"}
