from googleapiclient.discovery import build
from models import db, Trend
from config import Config
from datetime import datetime

def fetch_youtube_trends(domain='general'):
    if not Config.YOUTUBE_API_KEY:
        print("YouTube API key missing")
        return
    youtube = build('youtube', 'v3', developerKey=Config.YOUTUBE_API_KEY)
    query_map = {
        'gaming': 'viral gaming shorts',
        'education': 'educational viral',
        'business': 'business viral',
        'general': 'viral video'
    }
    query = query_map.get(domain, 'trending')
    request = youtube.search().list(
        part='snippet',
        q=query,
        type='video',
        maxResults=5,
        order='viewCount'
    )
    response = request.execute()
    for item in response.get('items', []):
        title = item['snippet']['title']
        video_id = item['id']['videoId']
        url = f"https://youtube.com/watch?v={video_id}"
        # Get actual view count (requires videos.list)
        stats_req = youtube.videos().list(part='statistics', id=video_id)
        stats = stats_req.execute()
        views = int(stats['items'][0]['statistics'].get('viewCount', 0))
        trend = Trend(
            source='youtube',
            domain=domain,
            title=title,
            description=item['snippet']['description'][:200],
            engagement=views,
            url=url,
            timestamp=datetime.utcnow()
        )
        db.session.add(trend)
    db.session.commit()