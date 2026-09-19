from fastapi import APIRouter
from src.modules.auth.routes import router as auth_router
from src.modules.giggo.routes import router as provider_router
from src.modules.bookings.routes import router as booking_router
from src.modules.reviews.routes import router as review_router
from src.modules.studio.routes import router as studio_router
from src.modules.payments.routes import router as payments_router
from src.modules.packages.routes import router as packages_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(provider_router)
api_router.include_router(booking_router)
api_router.include_router(review_router)
api_router.include_router(studio_router)
api_router.include_router(payments_router)
api_router.include_router(packages_router)
