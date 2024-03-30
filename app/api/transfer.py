from flask import Blueprint, jsonify, request
from app.models import db, User


transfer = Blueprint('transfer', __name__)

@transfer.route('/get_balance/<int:user_id>', methods=['GET'])
def get_balance(user_id):
    account = User.query.filter_by(id=user_id).first()
    if account:
        return jsonify({'balance': account.cash})
    else:
        return jsonify({'message': 'Account not found'}), 404


@transfer.route('/', methods=['POST'])
def transfer_money():
    user_id = request.json.get('user_id')
    amount = request.json.get('amount')
    account = User.query.filter_by(id=user_id).first()
    
    if account:
        account.cash += amount
        db.session.commit()
        return jsonify({'message': 'Transfer successful', 'new_balance': account.cash})
    else:
        return jsonify({'message': 'Account not found'}), 404