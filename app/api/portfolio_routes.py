from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import PortfolioForm
from app.models import User, Portfolio, PortfolioStock, Stock, db

portfolio_routes = Blueprint('portfolios', __name__)


@portfolio_routes.route('/<int:id>')
@login_required
def user_portfolios(id):
    """
    Query for all portfolios owned by current user
    """
    if current_user.id != id:
        return {'errors': {'message': 'Unauthorized'}}, 401

    user = User.query.get(id)
    if user:
        portfolios_data = []
        for portfolio in user.portfolios:
            portfolio_stocks = portfolio.portfolio_table
            portfolio_stocks_data = []
            for portfolio_stock in portfolio_stocks:
                stock = Stock.query.get(portfolio_stock.stock_id)

                stock_data = {
                    'id': stock.id,
                    'name': stock.name,
                    'symbol': stock.symbol,
                    'current_price': stock.current_price,
                    'company_info': stock.company_info
                }

                portfolio_stock_data = {
                    'id': portfolio_stock.id,
                    'portfolio_id': portfolio_stock.portfolio_id,
                    'stock_id': portfolio_stock.stock_id,
                    'shares': portfolio_stock.shares,
                    'average_cost': portfolio_stock.average_cost,
                    'total_return': portfolio_stock.total_return,
                    'equity': portfolio_stock.equity,
                    'current_price': portfolio_stock.current_price,
                    'stock': stock_data
                }

                portfolio_stocks_data.append(portfolio_stock_data)

            portfolios_data.append({
                'id': portfolio.id,
                'user_id': portfolio.user_id,
                'name': portfolio.name,
                'portfolio_stocks': portfolio_stocks_data
            })
        return jsonify(portfolios_data)
    else:
        return {'errors': {'message': 'User not found'}}, 404

@portfolio_routes.route('/new', methods=['GET', 'POST'])
@login_required
def create_portfolio():
    form = PortfolioForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        portfolio = Portfolio(
            name=form.data['name'],
            user_id=current_user.id
        )
        db.session.add(portfolio)
        db.session.commit()
        return portfolio.to_dict()
    return form.errors, 401

@portfolio_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_portfolio(id):
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()
    if portfolio is None:
        return {'errors': {'message': 'Portfolio not found'}}, 404
    db.session.delete(portfolio)
    db.session.commit()
    return jsonify({'message': 'Portfolio successfully deleted.'}), 200
