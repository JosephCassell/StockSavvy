from flask.cli import AppGroup
from .users import seed_users, undo_users
from .stocks import seed_stocks, undo_stocks
from .watchlists import seed_watchlists, undo_watchlists
from .portfolios import seed_portfolios, undo_portfolios
from .watchlist_stocks import seed_watchlist_stocks, undo_watchlist_stocks
from .portfolio_stocks import  seed_portfolio_stocks, undo_portfolio_stocks

from app.models.db import db, environment, SCHEMA

seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        undo_portfolio_stocks()
        undo_watchlist_stocks()
        undo_portfolios()
        undo_watchlists()
        undo_stocks()
        undo_users()
    seed_users()
    seed_stocks()
    seed_watchlists()
    seed_portfolios()
    seed_watchlist_stocks()
    seed_portfolio_stocks()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_portfolio_stocks()
    undo_watchlist_stocks()
    undo_portfolios()
    undo_watchlists()
    undo_stocks()
    undo_users()
