from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolios():
    Primary = Portfolio (
        user_id = 1, name = 'Primary'
    )
    db.session.add(Primary)
    db.session.commit()



def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
