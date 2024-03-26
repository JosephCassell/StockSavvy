import os
import requests
from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text

API_KEY = os.environ.get('STOCK_API_KEY')

def fetch_stock_data(symbol):
    url = f'https://financialmodelingprep.com/api/v3/profile/{symbol}'
    params = {'apikey': API_KEY}
    res = requests.get(url, params=params)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception('Failed to fetch data for the given symbol.')

def seed_stocks():
    symbols = ['GME', 'AAPL', 'AMD', 'TSLA', 'NFLX', 'META', 'MSFT', 'GRPO', 'SBUX', 'GE', 'NOK', 'JPM', 'WMT', 'BAC', 'WFC', 'LOW', 'PG', 'SIEGY', 'PGR', 'WM', 'CMG', 'CL', 'MAR', 'ORLY', 'MNST', 'MSI', 'COF', 'HLT', 'RYCEY', 'EBAY']
    for symbol in symbols:
        data = fetch_stock_data(symbol)
        if data:
            data = data[0]
            stock = Stock(
                name=data['companyName'],
                symbol=symbol,
                current_price=data['price'],
                company_info=data['description']
            )
            db.session.add(stock)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
