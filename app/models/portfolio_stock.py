from .db import db, environment, SCHEMA, add_prefix_for_prod

class PortfolioStock(db.Model):
    __tablename__ = 'portfolio_stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('portfolios.id')), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id')), nullable=False )
    stock_symbol = db.Column(db.String(10))
    shares = db.Column(db.Float, nullable=False)
    total_investment = db.Column(db.Float, nullable=False, default=0)
    average_cost = db.Column(db.Float, nullable=False, default=0)
    total_return = db.Column(db.Float, nullable=False, default=0)
    equity = db.Column(db.Float, nullable=False, default=0)

    portfolios = db.relationship('Portfolio', back_populates='portfolio_stocks')
    stocks = db.relationship('Stock', back_populates='stock_port_table')
    def to_dict(self):
        return {
            'id': self.id,
            'portfolio_id': self.portfolio_id,
            'stock_id': self.stock_id,
            'stock_symbol': self.stock_symbol,
            'shares': self.shares,
            'total_investment': self.total_investment,
            'average_cost': self.average_cost,
            'total_return': self.total_return,
            'equity': self.equity,
        }