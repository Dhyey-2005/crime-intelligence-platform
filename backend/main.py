import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.analytics_router import router as analytics_router
from database.connection import engine, Base

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO if os.getenv("DEBUG", "True").lower() == "true" else logging.WARNING,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("crimeshield.main")

# Initialize FastAPI application
app = FastAPI(
    title=os.getenv("APP_NAME", "CrimeShield Intelligence API"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="Enterprise-grade AI Crime Intelligence & GIS Analytics Backend powered by PostgreSQL.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for Next.js Frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(analytics_router)


@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler.
    Checks database connectivity and initializes SQLAlchemy tables if required.
    """
    logger.info("Initializing CrimeShield Intelligence API...")
    try:
        # Check database connection
        with engine.connect() as connection:
            logger.info("Successfully connected to PostgreSQL database!")
    except Exception as e:
        logger.warning(
            f"PostgreSQL connection could not be established on startup: {str(e)}\n"
            "API will start and serve fallback analytics until the database is connected."
        )


@app.get("/", tags=["Health & Status"])
def read_root():
    """
    Root endpoint for health checks and platform status.
    """
    return {
        "status": "active",
        "platform": os.getenv("APP_NAME", "CrimeShield Intelligence API"),
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "documentation": "/docs",
        "database_engine": "PostgreSQL + SQLAlchemy",
    }
