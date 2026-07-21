from sqlalchemy.ext.asyncio import create_async_engine
import inspect

try:
    engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db", prepared_statement_cache_size=0)
    print("Direct kwarg worked")
except Exception as e:
    print(f"Direct kwarg failed: {e}")

try:
    engine2 = create_async_engine("postgresql+asyncpg://user:pass@localhost/db", connect_args={"statement_cache_size": 0})
    print("connect_args statement_cache_size worked")
except Exception as e:
    print(f"connect_args statement_cache_size failed: {e}")
