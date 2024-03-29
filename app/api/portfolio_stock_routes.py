import os
import requests
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import PortfolioForm
from app.models import User, Portfolio, PortfolioStock, Stock, db

portfolio_stock_routes = Blueprint('portfolio_stocks', __name__)

API_KEY = os.environ.get('STOCK_API_KEY')

@portfolio_stock_routes.route('<symbol>/buy', methods=['POST'])
@login_required
def create_portfolio_stock(symbol):
    url = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={API_KEY}'
    response = requests.get(url)

    data = response.json()
    if not data:
        return jsonify({'error': 'No data found for the given symbol'}), 404
    stock_data = data[0]

    stock = Stock.query.filter_by(symbol=symbol).first()
    if stock:
        stock.current_price = stock_data['price']
        stock.name = stock_data['companyName']
    else:
        stock = Stock(symbol=symbol, current_price=stock_data['price'], name=stock_data['companyName'])
        db.session.add(stock)
        db.session.commit()

    portfolio = Portfolio.query.filter_by(user_id=current_user.id).first()
    portfolio_stock = PortfolioStock.query.filter_by(portfolio_id=portfolio.id, stock_id=stock.id).first()

    if portfolio_stock:
        portfolio_stock.shares += 1
    else:
        portfolio_stock = PortfolioStock(
            portfolio_id=portfolio.id,
            stock_id=stock.id,
            stock_symbol=stock.symbol,
            shares=1,
            average_cost=stock.current_price,
            total_return=0,
            equity=stock.current_price * 1
        )
        db.session.add(portfolio_stock)

    db.session.commit()
    return jsonify(portfolio_stock.to_dict()), 200
