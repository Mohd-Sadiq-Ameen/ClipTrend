from flask import Flask
from flask_cors import CORS
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])
    db.init_app(app)
    
    # Import and register blueprints
    from routes.analytics import analytics_bp
    from routes.search import search_bp
    from routes.refresh import refresh_bp
    from routes.auth import auth_bp
    
    app.register_blueprint(analytics_bp, url_prefix='/api')
    app.register_blueprint(search_bp, url_prefix='/api')
    app.register_blueprint(refresh_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)