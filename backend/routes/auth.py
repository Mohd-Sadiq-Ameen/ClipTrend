from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from models import db, User
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed = generate_password_hash(data['password'])
    user = User(email=data['email'], password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=24)},
        Config.SECRET_KEY,
        algorithm='HS256'
    )
    return jsonify({'token': token, 'user': {'email': user.email}})

# Decorator to protect routes
from functools import wraps
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token missing'}), 401
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            request.current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'error': 'Invalid token'}), 401
        return f(*args, **kwargs)
    return decorated