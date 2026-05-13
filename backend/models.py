from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Trend(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(20))  # google, youtube, reddit
    domain = db.Column(db.String(50))  # gaming, education, business, general
    title = db.Column(db.String(500))
    description = db.Column(db.Text, nullable=True)
    engagement = db.Column(db.Integer)  # search volume, views, upvotes
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    url = db.Column(db.String(500), nullable=True)