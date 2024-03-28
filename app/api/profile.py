from flask import Blueprint, jsonify
from app.models import Stock, db, User


profile = Blueprint('profile', __name__)

@profile.route('/', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

   
    stock_worth = 0
    for stock in user.stocks:
        stock_price = get_stock_price(stock.symbol) 
        stock_worth += stock_price * stock.quantity


    total_balance = user.cash + stock_worth

    
    return jsonify({
        'user_id': user.id,
        'first_name': user.first_name,
        'last_name': user.cash,
        'username': user.username,
        'email': user.email,
        'total_balance': total_balance
    })