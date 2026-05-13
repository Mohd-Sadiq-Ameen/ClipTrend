from app import create_app
from scrapers.youtube import fetch_youtube_trends

app = create_app()
with app.app_context():
    fetch_youtube_trends('gaming')
    print("✅ YouTube trends fetched.")