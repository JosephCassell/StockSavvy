import os
import requests
from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_stocks():
    db.session.commit()



def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
