import os
import requests
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import PortfolioForm
from app.models import User, Portfolio, PortfolioStock, Stock, db

portfolio_stock_routes = Blueprint('portfolio_stocks', __name__)

API_KEY = os.environ.get('STOCK_API_KEY')

@portfolio_stock_routes.route('/<int:portfolio_id>/<symbol>/<int:quantity>', methods=['POST'])
@login_required
def create_portfolio_stock(portfolio_id, symbol, quantity):
    portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=current_user.id).first()
    if not portfolio:
        return jsonify({'error': 'Portfolio not found'}), 404

    user_stock = Stock.query.filter_by(user_id=current_user.id, symbol=symbol).first()
    if not user_stock or user_stock.quantity < quantity:
        return jsonify({'error': 'User does not own enough shares of this stock'}), 403

    stock = Stock.query.filter_by(symbol=symbol).first()
    if not stock:
        url = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={API_KEY}'
        response = requests.get(url)
        data = response.json()
        if not data:
            return jsonify({'error': 'No data found for the given symbol'}), 404
        stock_data = data[0]
        stock = Stock(symbol=symbol, current_price=stock_data['price'], name=stock_data['companyName'])
        db.session.add(stock)

    portfolio_stock = PortfolioStock.query.filter_by(portfolio_id=portfolio_id, stock_id=stock.id).first()
    if portfolio_stock:
        portfolio_stock.shares += quantity
        portfolio_stock.equity = portfolio_stock.shares * stock.current_price
    else:
        portfolio_stock = PortfolioStock(
            portfolio_id=portfolio_id,
            stock_id=stock.id,
            stock_symbol=stock.symbol,
            shares=quantity,
            average_cost=stock.current_price,
            total_return=0,
            equity=stock.current_price * quantity
        )
        db.session.add(portfolio_stock)

    db.session.commit()
    return jsonify(portfolio_stock.to_dict()), 200


# Remove a stock form a portfolio
@portfolio_stock_routes.route('/<int:portfolio_id>/<int:stock_id>', methods=['DELETE'])
@login_required
def remove_portfolio_stock(portfolio_id, stock_id):
    portfolio_stock = PortfolioStock.query.filter_by(portfolio_id=portfolio_id, stock_id=stock_id).first()
    if not portfolio_stock:
        return jsonify({'error': 'Stock not found in portfolio'}), 404

    db.session.delete(portfolio_stock)
    db.session.commit()
    return jsonify({'message': 'Stock removed from portfolio'}), 200
