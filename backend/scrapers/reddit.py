import requests
from models import db, Trend
from datetime import datetime

def fetch_reddit_trends(domain='general'):
    subreddit_map = {
        'gaming': 'gaming',
        'education': 'education',
        'business': 'entrepreneur',
        'general': 'all'
    }
    sub_name = subreddit_map.get(domain, 'all')
    url = f"https://www.reddit.com/r/{sub_name}/hot.json?limit=10"
    headers = {'User-Agent': 'ClipTrend/0.1 (college project)'}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Reddit API status: {response.status_code}")
        if response.status_code != 200:
            print(f"Failed: {response.status_code}")
            return
        
        data = response.json()
        posts = data['data']['children']
        print(f"Found {len(posts)} posts from r/{sub_name}")
        
        new_count = 0
        for post in posts:
            p = post['data']
            title = p['title']
            # Avoid duplicates: skip if title already exists for this source+domain
            existing = Trend.query.filter_by(source='reddit', domain=domain, title=title).first()
            if existing:
                continue
            
            trend = Trend(
                source='reddit',
                domain=domain,
                title=title,
                description=p.get('selftext', '')[:300],
                engagement=p.get('score', 0),
                url=f"https://reddit.com{p['permalink']}",
                timestamp=datetime.utcnow()
            )
            db.session.add(trend)
            new_count += 1
        
        db.session.commit()
        print(f"Added {new_count} new Reddit trends for {domain}")
    except Exception as e:
        print(f"Reddit error: {e}")