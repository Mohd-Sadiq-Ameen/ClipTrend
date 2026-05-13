from pytrends.request import TrendReq
from models import db, Trend
from datetime import datetime

def fetch_google_trends(domain='general'):
    pytrends = TrendReq(hl='en-US', tz=360)
    keywords = {
        'gaming': 'gaming trends',
        'education': 'online learning',
        'business': 'startup ideas',
        'general': 'viral'
    }
    kw = keywords.get(domain, 'trending')
    pytrends.build_payload(kw_list=[kw], timeframe='now 7-d')
    data = pytrends.interest_over_time()
    if data.empty:
        return
    # Simplified: just store the keyword as a trend
    trend = Trend(
        source='google',
        domain=domain,
        title=f"Google search trend: {kw}",
        description=f"Interest over last 7 days",
        engagement=int(data[kw].iloc[-1]) if not data.empty else 0,
        timestamp=datetime.utcnow()
    )
    db.session.add(trend)
    db.session.commit()