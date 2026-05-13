from models import Trend

def generate_top_idea(domain, query):
    trends = Trend.query.filter_by(domain=domain).order_by(Trend.engagement.desc()).limit(5).all()
    if not trends:
        return {"top_idea": "No trends available yet. Click Refresh."}
    best = trends[0]
    return {
        "title": best.title,
        "description": best.description,
        "expected_reach": f"~{best.engagement} engagements",
        "why_viral": f"From {best.source} – trending in {domain} with high engagement.",
        "source_hint": best.source
    }