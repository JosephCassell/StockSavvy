"""Initial migration

Revision ID: ffdc0a98111c
Revises: 
Create Date: 2024-03-28 21:05:45.951576
"""

# revision identifiers, used by Alembic.
from alembic import op
import sqlalchemy as sa
import os

environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")

revision = 'ffdc0a98111c'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('first_name', sa.String(length=25), nullable=False),
        sa.Column('last_name', sa.String(length=25), nullable=False),
        sa.Column('username', sa.String(length=40), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('cash', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )
    op.create_table('stocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(length=30), nullable=False),
        sa.Column('symbol', sa.String(length=10), nullable=False),
        sa.Column('current_price', sa.Float(), nullable=False),
        sa.Column('company_info', sa.String(), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=True),
        sa.Column('total_investment', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=30), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=30), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolio_stocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('portfolio_id', sa.Integer(), nullable=False),
        sa.Column('stock_id', sa.Integer(), nullable=False),
        sa.Column('stock_symbol', sa.String(length=10), nullable=True),
        sa.Column('shares', sa.Float(), nullable=False),
        sa.Column('total_investment', sa.Float(), nullable=False),
        sa.Column('average_cost', sa.Float(), nullable=False),
        sa.Column('total_return', sa.Float(), nullable=False),
        sa.Column('equity', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['portfolio_id'], ['portfolios.id']),
        sa.ForeignKeyConstraint(['stock_id'], ['stocks.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlist_stocks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('watchlist_id', sa.Integer(), nullable=False),
        sa.Column('stock_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['stock_id'], ['stocks.id']),
        sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Move tables to schema in production environment
    if environment == "production":
        tables = ['users', 'stocks', 'portfolios', 'watchlists', 'portfolio_stocks', 'watchlist_stocks']
        for table in tables:
            op.execute(f"ALTER TABLE {table} SET SCHEMA {SCHEMA};")

def downgrade():
    op.drop_table('watchlist_stocks')
    op.drop_table('portfolio_stocks')
    op.drop_table('watchlists')
    op.drop_table('portfolios')
    op.drop_table('stocks')
    op.drop_table('users')
