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
    
    try:
        request = youtube.search().list(
            part='snippet',
            q=query,
            type='video',
            maxResults=5,
            order='viewCount'
        )
        response = request.execute()
        items = response.get('items', [])
        print(f"Found {len(items)} videos for query '{query}'")
        
        new_count = 0
        for item in items:
            title = item['snippet']['title']
            video_id = item['id']['videoId']
            url = f"https://youtube.com/watch?v={video_id}"
            
            # Avoid duplicates: skip if title already exists for this domain
            existing = Trend.query.filter_by(source='youtube', domain=domain, title=title).first()
            if existing:
                print(f"Skipping duplicate: {title}")
                continue
            
            # Get view count
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
            new_count += 1
        
        db.session.commit()
        print(f"Saved {new_count} new YouTube trends for {domain}")
    except Exception as e:
        print(f"YouTube API error: {e}")