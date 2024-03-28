import os
import requests
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import PortfolioForm
from app.models import User, Portfolio, PortfolioStock, Stock, db

portfolio_stock_routes = Blueprint('portfolio_stocks', __name__)

API_KEY = os.environ.get('STOCK_API_KEY')

@portfolio_stock_routes.route('<symbol>/buy', methods=['GET', 'POST'])
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
    shares = 0
    portfolio_stock = PortfolioStock(
        portfolio_id=portfolio.id,
        stock_id=stock.id,
        stock_symbol=stock.symbol,
        shares=shares+1,
        average_cost=0,
        total_return=0,
        equity=0
    )
    if portfolio_stock.shares > 0:
        portfolio_stock.average_cost = stock.current_price / portfolio_stock.shares
