from app.models import db, PortfolioStock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolio_stocks():
    
    db.session.commit()

def undo_portfolio_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_stocks"))

    db.session.commit()
