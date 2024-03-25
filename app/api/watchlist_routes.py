from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import WatchlistForm
from app.models import User, Watchlist, WatchlistStock, Stock, db

watchlist_routes = Blueprint('watchlists', __name__)


@watchlist_routes.route('/<int:id>')
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
    return form.errors, 401

@watchlist_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist(id):
    watchlist = Watchlist.query.filter_by(id=id, user_id=current_user.id).first()
    if watchlist is None:
        return {'errors': {'message': 'Watchlist not found'}}, 404
    db.session.delete(watchlist)
    db.session.commit()
    return jsonify({'message': 'Watchlist successfully deleted.'}), 200
