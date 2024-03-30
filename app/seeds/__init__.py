from flask.cli import AppGroup
from .users import seed_users, undo_users
from .stocks import seed_stocks, undo_stocks
from .watchlists import seed_watchlists, undo_watchlists
from .portfolios import seed_portfolios, undo_portfolios
from .watchlist_stocks import seed_watchlist_stocks, undo_watchlist_stocks
from .portfolio_stocks import  seed_portfolio_stocks, undo_portfolio_stocks

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_stocks()
        undo_watchlists()
        undo_portfolios()
        undo_watchlist_stocks()
        undo_portfolio_stocks()
    seed_users()
    seed_stocks()
    seed_watchlists()
    seed_portfolios()
    seed_watchlist_stocks()
    seed_portfolio_stocks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_stocks()
    undo_watchlists()
    undo_portfolios()
    undo_watchlist_stocks()
    undo_portfolio_stocks()
    # Add other undo functions here
