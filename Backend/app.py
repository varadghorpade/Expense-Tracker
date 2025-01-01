from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session  # For session management

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for specific origins
CORS(app, origins=["http://localhost:3000"])

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allow cookies to be sent across sites
app.config['SESSION_COOKIE_SECURE'] = True  # Enforce HTTPS for secure cookie transmission

CORS(app, supports_credentials=True)

# Configure session
app.config['SESSION_TYPE'] = 'filesystem'  # You can also use Redis, Memcached, etc.
app.config['SECRET_KEY'] = 'your-secret-key'  # Used for signing the session cookie
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
Session(app)  # Initialize session


# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Store hashed password


# Define Expense model
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    comments = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('expenses', lazy=True))


# Home route
@app.route('/')
def home():
    return 'Expense Tracker API'


# Route to sign up a user
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Check if the user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to log in
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        session['user_id'] = user.id  # Store user id in session
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


# Route to log out
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user id from session
    return jsonify({"message": "Logged out successfully"}), 200


# Route to get all expenses (requires authentication)
@app.route('/expenses', methods=['GET'])
def get_expenses():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    current_user_id = session['user_id']
    expenses = Expense.query.filter_by(user_id=current_user_id).all()
    expense_list = []
    for expense in expenses:
        expense_list.append({
            'id': expense.id,
            'category': expense.category,
            'amount': expense.amount,
            'comments': expense.comments,
            'created_at': expense.created_at,
            'updated_at': expense.updated_at
        })
    return jsonify(expense_list), 200


# Route to add an expense (requires authentication)
@app.route('/expenses', methods=['POST'])
def add_expense():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401  # Handle unauthorized access

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    new_expense = Expense(
        category=data['category'],
        amount=data['amount'],
        comments=data.get('comments', ''),
        user_id=session['user_id']  # Associate expense with the logged-in user
    )
    try:
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({"message": "Expense added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Run the Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure the database and tables are created
    app.run(debug=True, port=5000)
