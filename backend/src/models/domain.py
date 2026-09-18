import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text,
    ForeignKey, Enum, ARRAY, BigInteger
)
from sqlalchemy.orm import relationship
from src.core.database import Base


class UserRole(str, enum.Enum):
    customer = "customer"
    provider = "provider"
    admin = "admin"


class ProviderCategory(str, enum.Enum):
    live_band = "live_band"
    solo_artist = "solo_artist"
    dj = "dj"
    venue = "venue"


class BookingStatus(str, enum.Enum):
    requested = "requested"
    confirmed = "confirmed"
    completed = "completed"
    settled = "settled"
    cancelled = "cancelled"


class MediaType(str, enum.Enum):
    image = "image"
    video = "video"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.customer, nullable=False)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    provider_profile = relationship("Provider", back_populates="user", uselist=False)
    bookings = relationship("Booking", back_populates="customer", foreign_keys="Booking.customer_id")
    reviews = relationship("Review", back_populates="customer")


class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(Enum(ProviderCategory), nullable=False)
    city = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    cover_image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="provider_profile")
    packages = relationship("Package", back_populates="provider", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="provider", foreign_keys="Booking.provider_id")
    reviews = relationship("Review", back_populates="provider")
    media = relationship("Media", back_populates="provider", cascade="all, delete-orphan")
    facilities = relationship("Facility", back_populates="provider", cascade="all, delete-orphan")


class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    name = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    price = Column(BigInteger, nullable=False)
    features = Column(Text, nullable=True)  # JSON string list
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    provider = relationship("Provider", back_populates="packages")
    bookings = relationship("Booking", back_populates="package")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_ref = Column(String, unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=False)
    event_date = Column(DateTime, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.requested, nullable=False)
    total_amount = Column(BigInteger, nullable=False)
    advance_amount = Column(BigInteger, nullable=False)
    final_amount = Column(BigInteger, nullable=False)
    notes = Column(Text, nullable=True)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="bookings", foreign_keys=[customer_id])
    provider = relationship("Provider", back_populates="bookings", foreign_keys=[provider_id])
    package = relationship("Package", back_populates="bookings")
    review = relationship("Review", back_populates="booking", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    rating = Column(Float, nullable=False)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="review")
    customer = relationship("User", back_populates="reviews")
    provider = relationship("Provider", back_populates="reviews")


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    url = Column(String, nullable=False)
    media_type = Column(Enum(MediaType), default=MediaType.image)
    caption = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    provider = relationship("Provider", back_populates="media")


class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("providers.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    icon = Column(String, nullable=True)

    provider = relationship("Provider", back_populates="facilities")
