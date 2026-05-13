from pytrends.request import TrendReq
from models import db, Trend
from datetime import datetime

def fetch_google_trends(domain='general'):
    pytrends = TrendReq(hl='en-US', tz=360)
    keywords = {
        'gaming': 'gaming',
        'education': 'online learning',
        'business': 'business ideas',
        'general': 'trending now'
    }
    kw = keywords.get(domain, 'trending')
    
    try:
        pytrends.build_payload(kw_list=[kw], timeframe='now 7-d')
        data = pytrends.interest_over_time()
        if data.empty:
            print("No Google Trends data")
            return
        
        # Get the latest value as engagement
        latest_value = int(data[kw].iloc[-1]) if not data.empty else 0
        
        trend = Trend(
            source='google',
            domain=domain,
            title=f"Google search trend: {kw}",
            description=f"Interest over last 7 days. Peak: {data[kw].max()}",
            engagement=latest_value,
            timestamp=datetime.utcnow()
        )
        db.session.add(trend)
        db.session.commit()
        print(f"Saved Google Trends for {domain}")
    except Exception as e:
        print(f"Google Trends error: {e}")