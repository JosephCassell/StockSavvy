from app.models import db, PortfolioStock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolio_stocks():
    
    db.session.commit()
#     demo3 = PortfolioStock(portfolio_id=1, stock_id=3, shares=1, average_cost=168.16, total_return=0, equity=0)
#     demo4 = PortfolioStock(portfolio_id=1, stock_id=4, shares=1, average_cost=610.76, total_return=0, equity=0)
#     demo5 = PortfolioStock(portfolio_id=1, stock_id=5, shares=1, average_cost=494.80, total_return=0, equity=0)
#     demo6 = PortfolioStock(portfolio_id=1, stock_id=6, shares=1, average_cost=416.69, total_return=0, equity=0)
#     demo7 = PortfolioStock(portfolio_id=1, stock_id=7, shares=1, average_cost=2.22, total_return=0, equity=0)
#     demo8 = PortfolioStock(portfolio_id=1, stock_id=8, shares=1, average_cost=91.85, total_return=0, equity=0)
#     demo9 = PortfolioStock(portfolio_id=1, stock_id=9, shares=1, average_cost=170.00, total_return=0, equity=0)
#     demo10 = PortfolioStock(portfolio_id=1, stock_id=10, shares=1, average_cost=3.67, total_return=0, equity=0)
#     marnie1 = PortfolioStock(portfolio_id=2, stock_id=11, shares=1, average_cost=191.73, total_return=0, equity=0)
#     marnie2 = PortfolioStock(portfolio_id=2, stock_id=12, shares=1, average_cost=61.57, total_return=0, equity=0)
#     marnie3 = PortfolioStock(portfolio_id=2, stock_id=13, shares=1, average_cost=36.44, total_return=0, equity=0)
#     marnie4 = PortfolioStock(portfolio_id=2, stock_id=14, shares=1, average_cost=58.44, total_return=0, equity=0)
#     marnie5 = PortfolioStock(portfolio_id=2, stock_id=15, shares=1, average_cost=248.55, total_return=0, equity=0)
#     marnie6 = PortfolioStock(portfolio_id=2, stock_id=16, shares=1, average_cost=162.30, total_return=0, equity=0)
#     marnie7 = PortfolioStock(portfolio_id=2, stock_id=17, shares=1, average_cost=100.64, total_return=0, equity=0)
#     marnie8 = PortfolioStock(portfolio_id=2, stock_id=18, shares=1, average_cost=199.98, total_return=0, equity=0)
#     marnie9 = PortfolioStock(portfolio_id=2, stock_id=19, shares=1, average_cost=211.00, total_return=0, equity=0)
#     marnie10 = PortfolioStock(portfolio_id=2, stock_id=20, shares=1, average_cost=2722.69, total_return=0, equity=0)
#     bobbie1 = PortfolioStock(portfolio_id=3, stock_id=21, shares=1, average_cost=89.41, total_return=0, equity=0)
#     bobbie2 = PortfolioStock(portfolio_id=3, stock_id=22, shares=1, average_cost=252.00, total_return=0, equity=0)
#     bobbie3 = PortfolioStock(portfolio_id=3, stock_id=23, shares=1, average_cost=1101.40, total_return=0, equity=0)
#     bobbie4 = PortfolioStock(portfolio_id=3, stock_id=24, shares=1, average_cost=62.55, total_return=0, equity=0)
#     bobbie5 = PortfolioStock(portfolio_id=3, stock_id=25, shares=1, average_cost=343.68, total_return=0, equity=0)
#     bobbie6 = PortfolioStock(portfolio_id=3, stock_id=26, shares=1, average_cost=140.61, total_return=0, equity=0)
#     bobbie7 = PortfolioStock(portfolio_id=3, stock_id=27, shares=1, average_cost=209.00, total_return=0, equity=0)
#     bobbie8 = PortfolioStock(portfolio_id=3, stock_id=28, shares=1, average_cost=5.01, total_return=0, equity=0)
#     bobbie9 = PortfolioStock(portfolio_id=3, stock_id=29, shares=1, average_cost=109.52, total_return=0, equity=0)
#     bobbie10 = PortfolioStock(portfolio_id=3, stock_id=30, shares=1, average_cost=52.51, total_return=0, equity=0)
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
def undo_portfolio_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolio_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM portfolio_stocks"))

    db.session.commit()
