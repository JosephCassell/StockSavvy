from app.models import db, WatchlistStock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_watchlist_stocks():
     db.session.commit()
#     demo3 = WatchlistStock(watchlist_id=1, stock_id=3)
#     demo4 = WatchlistStock(watchlist_id=1, stock_id=4)
#     demo5 = WatchlistStock(watchlist_id=1, stock_id=5)
#     demo6 = WatchlistStock(watchlist_id=2, stock_id=6)
#     demo7 = WatchlistStock(watchlist_id=2, stock_id=7)
#     demo8 = WatchlistStock(watchlist_id=2, stock_id=8)
#     demo9 = WatchlistStock(watchlist_id=2, stock_id=9)
#     demo10 = WatchlistStock(watchlist_id=2, stock_id=10)
#     marnie1 = WatchlistStock(watchlist_id=3, stock_id=11)
#     marnie2 = WatchlistStock(watchlist_id=3, stock_id=12)
#     marnie3 = WatchlistStock(watchlist_id=3, stock_id=13)
#     marnie4 = WatchlistStock(watchlist_id=3, stock_id=14)
#     marnie5 = WatchlistStock(watchlist_id=3, stock_id=15)
#     marnie6 = WatchlistStock(watchlist_id=4, stock_id=16)
#     marnie7 = WatchlistStock(watchlist_id=4, stock_id=17)
#     marnie8 = WatchlistStock(watchlist_id=4, stock_id=18)
#     marnie9 = WatchlistStock(watchlist_id=4, stock_id=19)
#     marnie10 = WatchlistStock(watchlist_id=4, stock_id=20)
#     bobbie1 = WatchlistStock(watchlist_id=5, stock_id=21)
#     bobbie2 = WatchlistStock(watchlist_id=5, stock_id=22)
#     bobbie3 = WatchlistStock(watchlist_id=5, stock_id=23)
#     bobbie4 = WatchlistStock(watchlist_id=5, stock_id=24)
#     bobbie5 = WatchlistStock(watchlist_id=5, stock_id=25)
#     bobbie6 = WatchlistStock(watchlist_id=6, stock_id=26)
#     bobbie7 = WatchlistStock(watchlist_id=6, stock_id=27)
#     bobbie8 = WatchlistStock(watchlist_id=6, stock_id=28)
#     bobbie9 = WatchlistStock(watchlist_id=6, stock_id=29)
#     bobbie10 = WatchlistStock(watchlist_id=6, stock_id=30)

#     db.session.add(demo3)
#     db.session.add(demo4)
#     db.session.add(demo5)
#     db.session.add(demo6)
#     db.session.add(demo7)
#     db.session.add(demo8)
#     db.session.add(demo9)
#     db.session.add(demo10)
#     db.session.add(marnie1)
#     db.session.add(marnie2)
#     db.session.add(marnie3)
#     db.session.add(marnie4)
#     db.session.add(marnie5)
#     db.session.add(marnie6)
#     db.session.add(marnie7)
#     db.session.add(marnie8)
#     db.session.add(marnie9)
#     db.session.add(marnie10)
#     db.session.add(bobbie1)
#     db.session.add(bobbie2)
#     db.session.add(bobbie3)
#     db.session.add(bobbie4)
#     db.session.add(bobbie5)
#     db.session.add(bobbie6)
#     db.session.add(bobbie7)
#     db.session.add(bobbie8)
#     db.session.add(bobbie9)
#     db.session.add(bobbie10)


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
