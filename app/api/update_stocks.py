from flask import Blueprint, jsonify, request
from app.models import Stock, db, User, Portfolio, PortfolioStock
from flask_login import current_user, login_required
import requests
update_stocks = Blueprint('updateStocks', __name__)
api_key = '5749959e9f6a67949de1a7e4457b47fb'

# Get current user's stock by symbol
@update_stocks.route('/user/<symbol>', methods=['GET'])
@login_required
def check_ownership(symbol):
    user_id = current_user.id
    stock = Stock.query.filter_by(user_id=user_id, symbol=symbol).first()
    owns_stock = stock is not None and stock.quantity > 0
    return jsonify({'owns_stock': owns_stock})

# Buy stock
@update_stocks.route('/buy', methods=['POST'])
@login_required
def buy_stock():
    data = request.json
    symbol = data['symbol']
    quantity = int(data['quantity'])
    user = User.query.get(current_user.id)


    total_cost = 0

    stock = Stock.query.filter_by(symbol=symbol, user_id=current_user.id).first()

    if not stock:
        api_url = f'https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey={api_key}'
        response = requests.get(api_url)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch stock data'}), 500

        stock_data = response.json()[0]
        current_price = stock_data['price']
        total_cost = current_price * quantity
        stock = Stock(
            user_id=current_user.id,
            name=stock_data['name'],
            symbol=symbol,
            current_price=current_price,
            company_info=stock_data.get('description', ''),
            quantity=quantity,
            total_investment=total_cost
        )
        db.session.add(stock)
    else:
        total_cost = stock.current_price * quantity
        stock.quantity += quantity
        stock.total_investment += total_cost

    if user.cash < total_cost:
        return jsonify({'error': 'Error: Insufficient funds'}), 400

    user.cash -= total_cost
    db.session.commit()
    updated_stocks = [stock.to_dict() for stock in user.stocks]
    return jsonify({'message': 'Stock purchased successfully', 'stocks': updated_stocks}), 200

# Sell stock
@update_stocks.route('/sell', methods=['POST'])
@login_required
def sell_stock():
    data = request.json
    symbol = data['symbol']
    quantity = int(data['quantity'])
    stock = Stock.query.filter_by(symbol=symbol, user_id=current_user.id).first()
    user = User.query.get(current_user.id)

    if not stock or stock.quantity < quantity:
        return jsonify({'error': 'Error: Not enough shares to sell'}), 400

    total_revenue = stock.current_price * quantity
    user.cash += total_revenue
    stock.quantity -= quantity

    if stock.quantity == 0:
        db.session.delete(stock)

    db.session.commit()
    return jsonify({'message': 'Stock sold successfully'}), 200


