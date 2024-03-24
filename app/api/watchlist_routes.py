from flask import Blueprint, jsonify
from flask_login import login_required, current_user
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
