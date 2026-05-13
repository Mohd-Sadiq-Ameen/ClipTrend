import praw
from models import db, Trend
from config import Config
from datetime import datetime

def fetch_reddit_trends(domain='general'):
    if not Config.REDDIT_CLIENT_ID or not Config.REDDIT_CLIENT_SECRET:
        print("Reddit API keys missing")
        return
    reddit = praw.Reddit(
        client_id=Config.REDDIT_CLIENT_ID,
        client_secret=Config.REDDIT_CLIENT_SECRET,
        user_agent=Config.REDDIT_USER_AGENT
    )
    subreddit_map = {
        'gaming': 'gaming',
        'education': 'education',
        'business': 'entrepreneur',
        'general': 'all'
    }
    sub_name = subreddit_map.get(domain, 'all')
    subreddit = reddit.subreddit(sub_name)
    for post in subreddit.hot(limit=5):
        trend = Trend(
            source='reddit',
            domain=domain,
            title=post.title,
            description=post.selftext[:300],
            engagement=post.score,
            url=post.url,
            timestamp=datetime.utcnow()
        )
        db.session.add(trend)
    db.session.commit()