from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from app.models import Stock, db, User, Portfolio, PortfolioStock

profile = Blueprint('profile', __name__)

@profile.route('/user', methods=['GET'])
@login_required
def get_user_profile():

    user_id = current_user.id
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_stocks = Stock.query.filter_by(user_id=user_id).all()
    user_portfolios = Portfolio.query.filter_by(user_id=user_id).all()

    stocks = [stock.to_dict() for stock in user_stocks]
    portfolios = []
    for portfolio in user_portfolios:
        portfolio_stocks = PortfolioStock.query.filter_by(portfolio_id=portfolio.id).all()
        portfolio_data = {
            "id": portfolio.id,
            "name": portfolio.name,
            "stocks": [
                {
                    "stock_id": ps.stock_id,
                    "shares": ps.shares,
                    "average_cost": ps.average_cost,
                    "total_return": ps.total_return,
                    "equity": ps.equity,
                    "current_price": ps.current_price,
                } for ps in portfolio_stocks
            ],
        }
        portfolios.append(portfolio_data)

    return jsonify({
        "balance": user.cash,
        "stocks": stocks,
        "portfolios": portfolios
    })
