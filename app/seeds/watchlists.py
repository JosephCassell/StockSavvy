from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text


def seed_watchlists():
    demo1 = Watchlist(user_id=1, name='Demo\'s First Watchlist')
    demo2 = Watchlist(user_id=1, name='Demo\'s Second Watchlist')
    marnie1 = Watchlist(user_id=2, name='Marnie\'s First Watchlist')
    marnie2 = Watchlist(user_id=2, name='Marnie\'s Second Watchlist')
    bobbie1 = Watchlist(user_id=3, name='Bobbie\'s First Watchlist')
    bobbie2 = Watchlist(user_id=3, name='Bobbie\'s Second Watchlist')

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
def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
