from .db import db, environment, SCHEMA, add_prefix_for_prod

class Stock(db.Model):
    __tablename__ = 'stocks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    name = db.Column(db.String(30), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    company_info = db.Column(db.String)
    quantity = db.Column(db.Integer, default=0)
    total_investment = db.Column(db.Float, default=0.0)

    user = db.relationship('User', back_populates='stocks')
    stock_watch_table = db.relationship('WatchlistStock', back_populates='stocks')
    stock_port_table = db.relationship('PortfolioStock', back_populates='stocks')
    
    def to_dict(self):
        average_cost = self.total_investment / self.quantity if self.quantity > 0 else 0
        equity = self.current_price * self.quantity
        total_return = (self.current_price - average_cost) * self.quantity
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'symbol': self.symbol,
            'current_price': self.current_price,
            'company_info': self.company_info,
            'quantity': self.quantity,
            'total_investment': self.total_investment,
            'average_cost': average_cost,
            'total_return': total_return,
            'equity': equity
        }

