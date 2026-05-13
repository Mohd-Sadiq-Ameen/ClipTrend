from flask import Blueprint, request, jsonify
from models import Trend
from routes.auth import token_required

analytics_bp = Blueprint('analytics', __name__)   # ← this was missing

@analytics_bp.route('/analytics', methods=['GET'])
@token_required
def get_analytics():
    domain = request.args.get('domain', 'general')
    source = request.args.get('source', None)
    limit = int(request.args.get('limit', 10))

    query = Trend.query
    if domain != 'general':
        query = query.filter_by(domain=domain)
    if source:
        query = query.filter_by(source=source)

    trends = query.order_by(Trend.engagement.desc()).limit(limit).all()

    result = [{
        'title': t.title,
        'description': t.description,
        'engagement': t.engagement,
        'source': t.source,
        'domain': t.domain,
        'url': t.url
    } for t in trends]
    return jsonify(result)