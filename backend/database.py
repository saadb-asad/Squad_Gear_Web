import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

load_dotenv(override=True)

# Setup SlowAPI Limiter
limiter = Limiter(key_func=get_remote_address)

# Supabase gives postgresql:// but SQLAlchemy async needs postgresql+asyncpg://
DATABASE_URL = os.getenv("DATABASE_URL", "")
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Disable connection pooling for Supabase pooler (if connecting via port 6543, pool_pre_ping=True helps)
# The Supabase transaction pooler handles pooling externally, so we keep poolclass to NullPool, 
# or just standard SQLAlchemy settings. For simplicity, we use standard settings.
engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    connect_args={"prepared_statement_cache_size": 0}
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

# Dependency for FastAPI
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
