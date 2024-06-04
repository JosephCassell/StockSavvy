from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.forms import PortfolioForm
from app.models import User, Portfolio, PortfolioStock, Stock, db

portfolio_routes = Blueprint('portfolios', __name__)

# Get all portfolios of a user
@portfolio_routes.route('user/<int:id>')
@login_required
def user_portfolios(id):
    if current_user.id != id:
        return {'errors': {'message': 'Unauthorized'}}, 401

    user = User.query.get(id)
    if user:
        portfolios_data = []
        for portfolio in user.portfolios:
            portfolio_stocks_data = []
            for portfolio_stock in portfolio.portfolio_stocks:
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
                    'stock_symbol': stock.symbol,
                    'shares': portfolio_stock.shares,
                    'total_investment': portfolio_stock.total_investment,
                    'average_cost': portfolio_stock.average_cost,
                    'total_return': portfolio_stock.total_return,
                    'equity': portfolio_stock.equity,
                    'stock': stock_data
                }
                portfolio_stocks_data.append(portfolio_stock_data)

            portfolio_data = {
                'id': portfolio.id,
                'user_id': portfolio.user_id,
                'name': portfolio.name,
                'portfolio_stocks': portfolio_stocks_data
            }
            portfolios_data.append(portfolio_data)

        return jsonify(portfolios_data)
    else:
        return {'errors': {'message': 'User not found'}}, 404


# Create a portfolio
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
        return jsonify(portfolio.to_dict()), 200
    return form.errors, 400
# Update a portfolio
@portfolio_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_portfolio(id):
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()
    if portfolio is None:
        return {'errors': {'message': 'Portfolio not found'}}, 404
    data = request.get_json()
    new_name = data.get('name')
    if new_name is None:
        return {'errors': {'message': 'New name is required'}}, 400
    portfolio.name = new_name
    db.session.commit()
    return jsonify(portfolio.to_dict()), 200
# Delete a Portfolio
@portfolio_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_portfolio(id):
    portfolio = Portfolio.query.filter_by(id=id, user_id=current_user.id).first()
    if portfolio is None:
        return {'errors': {'message': 'Portfolio not found'}}, 404
    db.session.delete(portfolio)
    db.session.commit()
    return jsonify({'message': 'Portfolio successfully deleted.'}), 200
# Get all shares a user has for each stock across all portfolios
@portfolio_routes.route('/user/<int:id>/total-shares')
@login_required
def user_total_shares(id):
    if current_user.id != id:
        return {'errors': {'message': 'Unauthorized'}}, 401

    user = User.query.get(id)
    if user:
        total_shares = db.session.query(
            Stock.symbol,
            db.func.sum(PortfolioStock.shares).label('total_shares')
        ).join(PortfolioStock).join(Portfolio).filter(Portfolio.user_id == id).group_by(Stock.symbol).all()

        total_shares_data = {stock_symbol: shares for stock_symbol, shares in total_shares}
        return jsonify(total_shares_data)
    else:
        return {'errors': {'message': 'User not found'}}, 404
# Get all portfolios that contain a specific stock
@portfolio_routes.route('/user/<int:id>/stock/<string:stock_symbol>')
@login_required
def user_portfolios_with_stock(id, stock_symbol):
    if current_user.id != id:
        return {'errors': {'message': 'Unauthorized'}}, 401

    user = User.query.get(id)
    if user:
        portfolios_data = []
        for portfolio in user.portfolios:
            for portfolio_stock in portfolio.portfolio_stocks:
                stock = Stock.query.get(portfolio_stock.stock_id)
                if stock.symbol == stock_symbol:
                    stock_data = {
                        'id': stock.id,
                        'name': stock.name,
                        'symbol': stock.symbol,
                        'shares': portfolio_stock.shares,
                    }
                    portfolio_data = {
                        'id': portfolio.id,
                        'name': portfolio.name,
                        'stock': stock_data
                    }
                    portfolios_data.append(portfolio_data)
                    break  # No need to continue once we found the stock in this portfolio

        return jsonify(portfolios_data)
    else:
        return {'errors': {'message': 'User not found'}}, 404
