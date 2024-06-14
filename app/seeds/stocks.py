import os
from flask import jsonify
import requests
from app.models import db, Stock, environment, SCHEMA
from sqlalchemy.sql import text

api_key = os.environ.get('STOCK_API_KEY')

def fetch_live_stock_data(symbol):
    url = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={api_key}'
    response = requests.get(url)
    if response.status_code != 200:
        print(f'Failed to fetch data for {symbol}: Status code {response.status_code}')
        return None

    data = response.json()
    if not data:
        print(f'No data found for {symbol}')
        return None
    stock_data = data[0]
    return stock_data

def seed_stocks():
    symbols = ['AAPL', 'AMD', 'TSLA']
    for symbol in symbols:
        stock_data = fetch_live_stock_data(symbol)
        if stock_data is None:
            print(f'Skipping {symbol} due to fetch error')
            continue

        name = stock_data.get('companyName')
        current_price = stock_data.get('price')
        if name is None or current_price is None:
            print(f'Skipping {symbol} due to missing data')
            continue
        stock = Stock(
            user_id=1,
            name=name,
            symbol=symbol,
            current_price=current_price,
            quantity=5,
            total_investment=current_price * 5
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
