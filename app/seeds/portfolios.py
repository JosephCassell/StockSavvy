from app.models import db, Portfolio, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolios():
    demo1 = Portfolio(user_id=1, name='Demo\'s First Portfolio')
    demo2 = Portfolio(user_id=1, name='Demo\'s Second Portfolio')
    marnie1 = Portfolio(user_id=2, name='Marnie\'s First Portfolio')
    marnie2 = Portfolio(user_id=2, name='Marnie\'s Second Portfolio')
    bobbie1 = Portfolio(user_id=3, name='Bobbie\'s First Portfolio')
    bobbie2 = Portfolio(user_id=3, name='Bobbie\'s Second Portfolio')

    db.session.add(demo1)
    db.session.add(demo2)
    db.session.add(marnie1)
    db.session.add(marnie2)
    db.session.add(bobbie1)
    db.session.add(bobbie2)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolios"))

    db.session.commit()
