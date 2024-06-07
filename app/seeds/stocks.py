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
        return jsonify({'error': 'Failed to fetch data'}), response.status_code

    data = response.json()
    if not data:
        return jsonify({'error': 'No data found for the given symbol'}), 404
    stock_data = data[0]
    return stock_data

def seed_stocks():
    symbols = ['AAPL', 'AMD', 'TSLA']
    for symbol in symbols:
        stock_data = fetch_live_stock_data(symbol)
        stock = Stock(
            user_id = 1,
            name = stock_data['companyName'],
            symbol = symbol,
            current_price = stock_data['price'],
            quantity = 5,
            total_investment = (stock_data['price'] * 5)
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
