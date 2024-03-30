from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db
import requests, os
search = Blueprint('search', __name__)


api_key = '5749959e9f6a67949de1a7e4457b47fb'

@search.route('/stocks', methods=['GET'])
def search_stocks():
    query = request.args.get('query')
    if query:
        return jsonify(search_stocks_from_api(query))
    return jsonify([])

def search_stocks_from_api(query):
    url = f'https://financialmodelingprep.com/api/v3/search?query={query}&limit=10&exchange=NASDAQ&apikey={api_key}'
    response = requests.get(url)
    print(response.text)
    if response.status_code == 200:
        return response.json()
    return []    