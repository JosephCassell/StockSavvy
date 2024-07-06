from flask import Blueprint, jsonify, request
from app.models import Stock, db, User, Portfolio, PortfolioStock
from flask_login import current_user, login_required
import requests, os

update_stocks = Blueprint('updateStocks', __name__)
API_KEY = os.environ.get('STOCK_API_KEY')

# Get current user's stock by symbol
@update_stocks.route('/user/<symbol>', methods=['GET'])
@login_required
def check_ownership(symbol):
    user_id = current_user.id
    stock = Stock.query.filter_by(user_id=user_id, symbol=symbol).first()
    owns_stock = stock is not None and stock.quantity > 0
    return jsonify({'owns_stock': owns_stock})
# Buy a stock
@update_stocks.route('/buy', methods=['POST'])
@login_required
def buy_stock():
    data = request.json
    symbol = data['symbol']
    quantity = int(data['quantity'])
    user = User.query.get(current_user.id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    total_cost = 0

    with db.session.no_autoflush:
        stock = Stock.query.filter_by(symbol=symbol, user_id=current_user.id).first()

        if not stock:
            api_url = f'https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey={API_KEY}'
            response = requests.get(api_url)
            if response.status_code != 200:
                return jsonify({'error': 'Failed to fetch stock data'}), 500

            stock_data = response.json()[0]
            current_price = stock_data['price']
            total_cost = current_price * quantity

            if user.cash < total_cost:
                return jsonify({'error': 'Error: Insufficient funds'}), 400

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
            current_price = stock.current_price
            total_cost = current_price * quantity

            if user.cash < total_cost:
                return jsonify({'error': 'Error: Insufficient funds'}), 400

            stock.quantity += quantity
            stock.total_investment += total_cost

        user.cash -= total_cost
        db.session.commit()

    updated_stocks = [s.to_dict() for s in user.stocks]
    return jsonify({'message': 'Stock purchased successfully', 'stocks': updated_stocks}), 200

# Sell a stock
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


