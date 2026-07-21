"""enable rls on public tables

Revision ID: f58c004c272e
Revises: f53c867fec6d
Create Date: 2026-07-22 00:20:44.604228

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f58c004c272e'
down_revision: Union[str, Sequence[str], None] = 'f53c867fec6d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    tables = [
        "alembic_version",
        "business_inquiries",
        "orders",
        "order_events",
        "users",
        "order_items",
        "products"
    ]
    for table in tables:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;")


def downgrade() -> None:
    """Downgrade schema."""
    tables = [
        "alembic_version",
        "business_inquiries",
        "orders",
        "order_events",
        "users",
        "order_items",
        "products"
    ]
    for table in tables:
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY;")
