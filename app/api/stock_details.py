from flask import Blueprint, jsonify
from app.models import Stock, db
import requests

stock_details = Blueprint('stockDetails', __name__)
api_key = '5749959e9f6a67949de1a7e4457b47fb'

@stock_details.route('/stocks/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    url = f'https://financialmodelingprep.com/api/v3/profile/{symbol}?apikey={api_key}'
    response = requests.get(url)
   
    data = response.json()
    if not data:
        return jsonify({'error': 'No data found for the given symbol'}), 404
    stock_data = data[0]

    stock = Stock.query.filter_by(symbol=symbol).first()
    if stock:
        stock.current_price = stock_data['price']
        stock.name = stock_data['companyName']
    else:
        stock = Stock(symbol=symbol, current_price=stock_data['price'], name=stock_data['companyName'])
        db.session.add(stock)
    db.session.commit()

    return jsonify({'name': stock_data['companyName'], 'price': stock_data['price']})
# Get routes for 3M-All
@stock_details.route('/<symbol>/history/all', methods=['GET'])
def get_stock_history(symbol):
    url = f'https://financialmodelingprep.com/api/v3/historical-price-full/{symbol}?serietype=line&timeseries={365*30}&apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    if not data:
        return jsonify({'error': 'No historical data found for the given symbol'}), 404
    return jsonify(data)
# Get routes for 1d
@stock_details.route('/<symbol>/history/1d', methods=['GET'])
def get_stock_history_1d(symbol):
    url = f'https://financialmodelingprep.com/api/v3/historical-chart/5min/{symbol}?apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    if not data:
        return jsonify({'error': 'No historical data found for the given symbol'}), 404
    return jsonify(data)
# Get routes for 1w
@stock_details.route('/<symbol>/history/1w', methods=['GET'])
def get_stock_history_1w(symbol):
    url = f'https://financialmodelingprep.com/api/v3/historical-chart/1hour/{symbol}?serietype=line&timeseries=7&apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    if not data:
        return jsonify({'error': 'No historical data found for the given symbol'}), 404
    return jsonify(data)
# # Get routes for 1m
@stock_details.route('/<symbol>/history/1m', methods=['GET'])
def get_stock_history_1m(symbol):
    url = f'https://financialmodelingprep.com/api/v3/historical-chart/2hour/{symbol}?serietype=line&timeseries=30&apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    if not data:
        return jsonify({'error': 'No historical data found for the given symbol'}), 404
    return jsonify(data)
