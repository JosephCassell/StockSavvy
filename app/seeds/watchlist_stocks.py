from app.models import db, WatchlistStock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_watchlist_stocks():
     db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
