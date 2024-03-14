from app.models import db, PortfolioStock, environment, SCHEMA
from sqlalchemy.sql import text


def seed_portfolio_stocks():
    demo1 = PortfolioStock(portfolio_id=1, stock_id=1, shares=, average_cost=, total_return=, equity=, current_price=)
    demo2 = PortfolioStock(portfolio_id=1, stock_id=2, shares=, average_cost=, total_return=, equity=, current_price=)
    demo3 = PortfolioStock(portfolio_id=1, stock_id=3, shares=, average_cost=, total_return=, equity=, current_price=)
    demo4 = PortfolioStock(portfolio_id=1, stock_id=4, shares=, average_cost=, total_return=, equity=, current_price=)
    demo5 = PortfolioStock(portfolio_id=1, stock_id=5, shares=, average_cost=, total_return=, equity=, current_price=)
    demo6 = PortfolioStock(portfolio_id=2, stock_id=6, shares=, average_cost=, total_return=, equity=, current_price=)
    demo7 = PortfolioStock(portfolio_id=2, stock_id=7, shares=, average_cost=, total_return=, equity=, current_price=)
    demo8 = PortfolioStock(portfolio_id=2, stock_id=8, shares=, average_cost=, total_return=, equity=, current_price=)
    demo9 = PortfolioStock(portfolio_id=2, stock_id=9, shares=, average_cost=, total_return=, equity=, current_price=)
    demo10 = PortfolioStock(portfolio_id=2, stock_id=10, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie1 = PortfolioStock(portfolio_id=3, stock_id=11, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie2 = PortfolioStock(portfolio_id=3, stock_id=12, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie3 = PortfolioStock(portfolio_id=3, stock_id=13, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie4 = PortfolioStock(portfolio_id=3, stock_id=14, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie5 = PortfolioStock(portfolio_id=3, stock_id=15, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie6 = PortfolioStock(portfolio_id=4, stock_id=16, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie7 = PortfolioStock(portfolio_id=4, stock_id=17, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie8 = PortfolioStock(portfolio_id=4, stock_id=18, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie9 = PortfolioStock(portfolio_id=4, stock_id=19, shares=, average_cost=, total_return=, equity=, current_price=)
    marnie10 = PortfolioStock(portfolio_id=4, stock_id=20, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie1 = PortfolioStock(portfolio_id=5, stock_id=21, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie2 = PortfolioStock(portfolio_id=5, stock_id=22, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie3 = PortfolioStock(portfolio_id=5, stock_id=23, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie4 = PortfolioStock(portfolio_id=5, stock_id=24, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie5 = PortfolioStock(portfolio_id=5, stock_id=25, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie6 = PortfolioStock(portfolio_id=6, stock_id=26, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie7 = PortfolioStock(portfolio_id=6, stock_id=27, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie8 = PortfolioStock(portfolio_id=6, stock_id=28, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie9 = PortfolioStock(portfolio_id=6, stock_id=29, shares=, average_cost=, total_return=, equity=, current_price=)
    bobbie10 = PortfolioStock(portfolio_id=6, stock_id=30, shares=, average_cost=, total_return=, equity=, current_price=)

    db.session.add(demo1)
    db.session.add(demo2)
    db.session.add(demo3)
    db.session.add(demo4)
    db.session.add(demo5)
    db.session.add(demo6)
    db.session.add(demo7)
    db.session.add(demo8)
    db.session.add(demo9)
    db.session.add(demo10)
    db.session.add(marnie1)
    db.session.add(marnie2)
    db.session.add(marnie3)
    db.session.add(marnie4)
    db.session.add(marnie5)
    db.session.add(marnie6)
    db.session.add(marnie7)
    db.session.add(marnie8)
    db.session.add(marnie9)
    db.session.add(marnie10)
    db.session.add(bobbie1)
    db.session.add(bobbie2)
    db.session.add(bobbie3)
    db.session.add(bobbie4)
    db.session.add(bobbie5)
    db.session.add(bobbie6)
    db.session.add(bobbie7)
    db.session.add(bobbie8)
    db.session.add(bobbie9)
    db.session.add(bobbie10)
    db.session.commit()


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
