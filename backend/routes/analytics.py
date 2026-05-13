from flask import Blueprint, request, jsonify
from models import Trend
from routes.auth import token_required

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics', methods=['GET'])
@token_required
def get_analytics():
    domain = request.args.get('domain', 'general')
    limit = int(request.args.get('limit', 10))
    
    trends = Trend.query.filter_by(domain=domain).order_by(Trend.engagement.desc()).limit(limit).all()
    result = [{
        'title': t.title,
        'description': t.description,
        'engagement': t.engagement,
        'source': t.source,
        'domain': t.domain,
        'url': t.url
    } for t in trends]
    return jsonify(result)