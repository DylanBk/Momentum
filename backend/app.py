from modules import *

load_dotenv()
PORT = os.environ.get('FLASK_PORT')
SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')

app = Flask(__name__, static_folder='../frontend/public')
app.secret_key = SECRET_KEY
app.permanent_session_lifetime = 1,800,000 # 30 mins
CORS(app)


# ROUTES

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if not session:
        if request.method == 'POST':
            data = request.get_json()
            username, email, pw = data.items()

            if not db.user_exists(email):
                db.create_user(username, email, pw)
            return jsonify({"error": "A user with that email already exists"}), 400
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(port=PORT, debug=True)