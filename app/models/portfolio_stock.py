from .db import db, environment, SCHEMA, add_prefix_for_prod

class PortfolioStock(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.id'), nullable=False)
    stock_symbol = db.Column(db.String(10))
    shares = db.Column(db.Float, nullable=False)
    average_cost = db.Column(db.Float, nullable=False)
    total_return = db.Column(db.Float, nullable=False)
    equity = db.Column(db.Float, nullable=False)

    portfolios = db.relationship('Portfolio', back_populates='portfolio_table')
    stocks = db.relationship('Stock', back_populates='stock_port_table')
