from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from src.models.domain import UserRole, ProviderCategory, BookingStatus, MediaType


# ─── Auth ───────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: UserRole = UserRole.customer


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: UserRole
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ─── Provider ───────────────────────────────────────────────────────────
class PackageOut(BaseModel):
    id: int
    name: str
    duration: str
    price: int
    features: Optional[List[str]] = []
    is_active: bool

    class Config:
        from_attributes = True


class ProviderOut(BaseModel):
    id: int
    slug: str
    name: str
    category: ProviderCategory
    city: str
    tagline: Optional[str] = None
    bio: Optional[str] = None
    rating: float
    review_count: int
    verified: bool
    cover_image: Optional[str] = None
    packages: List[PackageOut] = []

    class Config:
        from_attributes = True


class ProviderCreate(BaseModel):
    name: str
    category: ProviderCategory
    city: str
    tagline: Optional[str] = None
    bio: Optional[str] = None


# ─── Packages ────────────────────────────────────────────────────────────
class PackageCreate(BaseModel):
    name: str
    duration: str
    price: int
    features: Optional[List[str]] = []


class PackageUpdate(PackageCreate):
    is_active: Optional[bool] = True


# ─── Bookings ────────────────────────────────────────────────────────────
class BookingCreate(BaseModel):
    provider_id: int
    package_id: int
    event_date: datetime
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    booking_ref: str
    provider_id: int
    package_id: int
    event_date: datetime
    status: BookingStatus
    total_amount: int
    advance_amount: int
    final_amount: int
    notes: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime
    provider: Optional[ProviderOut] = None
    package: Optional[PackageOut] = None

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


# ─── Reviews ─────────────────────────────────────────────────────────────
class ReviewCreate(BaseModel):
    booking_id: int
    rating: float
    content: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    booking_id: int
    rating: float
    content: Optional[str] = None
    created_at: datetime
    customer: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ─── Media ───────────────────────────────────────────────────────────────
class MediaOut(BaseModel):
    id: int
    url: str
    media_type: MediaType
    caption: Optional[str] = None

    class Config:
        from_attributes = True


# ─── Studio ──────────────────────────────────────────────────────────────
class StudioOverview(BaseModel):
    total_revenue: int
    revenue_change: float
    pending_requests: int
    expiring_soon: int
    upcoming_events: int
    next_event_date: Optional[str]
    acceptance_rate: float


class ActivityItem(BaseModel):
    customer_name: str
    package_name: str
    event_date: str
    amount: int
    status: BookingStatus

# ─── Aliases for Routes ──────────────────────────────────────────────────
AuthResponse = Token
UserResponse = UserOut
ProviderResponse = ProviderOut
ProviderListResponse = ProviderOut
PackageResponse = PackageOut
BookingResponse = BookingOut
ReviewResponse = ReviewOut
BookingUpdateStatus = BookingStatusUpdate
