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
    # Live data primary seeders
    live_symbols = ['AAPL', 'AMD', 'TSLA']
    for symbol in live_symbols:
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

    # Hardcoded secondary seeders
    hc_stock1 = Stock(
        user_id=1,
        name='Texas Instruments Incorporated',
        symbol='TXN',
        current_price=196.28,
        quantity=5,
        total_investment=196.28 * 5
    )

    hc_stock1 = Stock(
        user_id=1,
        name='Texas Instruments Incorporated',
        symbol='TXN',
        current_price=196.28,
        quantity=5,
        total_investment=196.28 * 5
    )

    hc_stock2 = Stock(
        user_id=1,
        name='Meta Platforms, Inc.',
        symbol='META',
        current_price=504.10,
        quantity=5,
        total_investment=504.10 * 5
    )

    hc_stock3 = Stock(
        user_id=1,
        name='Zillow Group, Inc.',
        symbol='Z',
        current_price=48.50,
        quantity=5,
        total_investment=48.50 * 5
    )

    db.session.add(hc_stock1)
    db.session.add(hc_stock2)
    db.session.add(hc_stock3)
    db.session.commit()



def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
