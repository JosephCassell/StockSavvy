from .db import db, environment, SCHEMA, add_prefix_for_prod

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(30), nullable=False)

    user = db.relationship('User', back_populates='watchlists')
    watchlist_table = db.relationship('WatchlistStock', back_populates='watchlists', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name
        }
