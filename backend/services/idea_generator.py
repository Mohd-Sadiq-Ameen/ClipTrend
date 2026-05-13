from models import Trend

def generate_top_idea(domain, source=None, query=""):
    q = Trend.query
    if domain and domain != 'general':
        q = q.filter_by(domain=domain)
    if source:
        q = q.filter_by(source=source)
    
    top = q.order_by(Trend.engagement.desc()).first()
    if not top:
        return {
            "title": f"No trending ideas found for {domain}",
            "description": f"We don't have any trends for '{domain}' yet. Click the Refresh button to fetch latest data from YouTube, Reddit and Google Trends.",
            "expected_reach": "N/A",
            "why_viral": "No data available. Try selecting 'Gaming' which has existing data.",
            "url": None,
            "engagement": 0,
            "domain": domain
        }
    
    return {
        "title": top.title,
        "description": top.description,
        "expected_reach": f"~{top.engagement} engagements",
        "why_viral": f"From {top.source} – trending in {top.domain} with high engagement.",
        "source_hint": top.source,
        "url": top.url,
        "engagement": top.engagement,
        "domain": top.domain
    }