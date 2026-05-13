from app import create_app
from scrapers.reddit import fetch_reddit_trends

app = create_app()
with app.app_context():
    fetch_reddit_trends('gaming')
    print("✅ Reddit trends fetched.")