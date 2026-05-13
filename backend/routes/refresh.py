from flask import Blueprint, jsonify
from scrapers.google_trends import fetch_google_trends
from scrapers.youtube import fetch_youtube_trends
from scrapers.reddit import fetch_reddit_trends
from routes.auth import token_required

refresh_bp = Blueprint('refresh', __name__)

@refresh_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_data():
    # Run all scrapers (you can add domain param)
    fetch_google_trends()
    fetch_youtube_trends()
    fetch_reddit_trends()
    return jsonify({'status': 'refreshed', 'items_added': 'check logs'})