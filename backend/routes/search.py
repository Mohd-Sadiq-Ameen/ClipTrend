from flask import Blueprint, request, jsonify
from models import Trend
from services.idea_generator import generate_top_idea
from routes.auth import token_required

search_bp = Blueprint('search', __name__)

@search_bp.route('/ask', methods=['POST'])
@token_required
def ask():
    data = request.json
    domain = data.get('domain', 'general')
    source = data.get('source', None)   # 'youtube', 'reddit', 'google'
    query = data.get('query', '')
    
    top_idea = generate_top_idea(domain, source, query)
    return jsonify(top_idea)