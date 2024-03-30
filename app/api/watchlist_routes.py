from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import WatchlistForm
from app.models import User, Watchlist, WatchlistStock, Stock, db
from .stock_details import get_stock_details
watchlist_routes = Blueprint('watchlists', __name__)


@watchlist_routes.route('user/<int:id>')
@login_required
def user_watchlists(id):
    """
    Query for all watchlists owned by current user
    """
    if current_user.id != id:
        return {'errors': {'message': 'Unauthorized'}}, 401

    user = User.query.get(id)
    if user:
        watchlists_data = []
        for watchlist in user.watchlists:
            watchlist_stocks = watchlist.watchlist_table
            watchlist_stocks_data = []
            for watchlist_stock in watchlist_stocks:
                stock = Stock.query.get(watchlist_stock.stock_id)

                stock_data = {
                    'id': stock.id,
                    'name': stock.name,
                    'symbol': stock.symbol,
                    'current_price': stock.current_price,
                    'company_info': stock.company_info
                }

                watchlist_stock_data = {
                    'id': watchlist_stock.id,
                    'watchlist_id': watchlist_stock.watchlist_id,
                    'stock_id': watchlist_stock.stock_id,
                    'stock': stock_data
                }

                watchlist_stocks_data.append(watchlist_stock_data)

            watchlists_data.append({
                'id': watchlist.id,
                'user_id': watchlist.user_id,
                'name': watchlist.name,
                'watchlist_stocks': watchlist_stocks_data
            })
        return jsonify(watchlists_data)
    else:
        return {'errors': {'message': 'User not found'}}, 404

@watchlist_routes.route('/new', methods=['GET', 'POST'])
@login_required
def create_watchlist():
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        watchlist = Watchlist(
            name=form.data['name'],
            user_id=current_user.id
        )
        db.session.add(watchlist)
        db.session.commit()
        return watchlist.to_dict()
    return form.errors, 400

@watchlist_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_watchlist(id):
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()
    if watchlist is None:
        return {'errors': {'message': 'Watchlist not found'}}, 404
    data = request.get_json()
    new_name = data.get('name')
    if new_name is None:
        return {'errors': {'message': 'New name is required'}}, 400
    watchlist.name = new_name
    db.session.commit()
    return jsonify(watchlist.to_dict()), 200

@watchlist_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist(id):
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()
    if watchlist is None:
        return {'errors': {'message': 'Watchlist not found'}}, 404
    db.session.delete(watchlist)
    db.session.commit()
    return jsonify({'message': 'Watchlist successfully deleted.'}), 200

# Add a stock to a watchlist
@watchlist_routes.route('/<int:watchlist_id>/stocks', methods=['POST'])
@login_required
def add_stock_to_watchlist(watchlist_id):
    data = request.get_json()
    stock_symbol = data.get('symbol')

    watchlist = Watchlist.query.filter_by(id=watchlist_id, user_id=current_user.id).first()
    if watchlist is None:
        return {'errors': {'message': 'Watchlist not found'}}, 404

    stock_details_response = get_stock_details(stock_symbol)
    if stock_details_response.status_code != 200:
        return {'errors': {'message': 'Stock details not found'}}, 404

    stock_details = stock_details_response.get_json()
    stock = Stock.query.filter_by(symbol=stock_symbol).first()
    if not stock:
        stock = Stock(symbol=stock_symbol, name=stock_details['name'], current_price=stock_details['price'])
        db.session.add(stock)

    existing_entry = WatchlistStock.query.filter_by(watchlist_id=watchlist_id, stock_id=stock.id).first()
    if existing_entry:
        return {'errors': {'message': 'Stock already in watchlist'}}, 400

    watchlist_stock = WatchlistStock(
        watchlist_id=watchlist_id,
        stock_id=stock.id
    )
    db.session.add(watchlist_stock)
    db.session.commit()
    return jsonify(watchlist_stock.to_dict()), 201



@watchlist_routes.route('/<int:watchlist_id>/stocks/<int:stock_id>', methods=['DELETE'])
@login_required
def delete_stock_from_watchlist(watchlist_id, stock_id):
    watchlist_stock = WatchlistStock.query.filter_by(watchlist_id=watchlist_id, stock_id=stock_id).first()
    if watchlist_stock is None:
        return {'errors': {'message': 'Stock not found in watchlist'}}, 404
    db.session.delete(watchlist_stock)
    db.session.commit()
    return {'message': 'Stock removed from watchlist'}, 200
