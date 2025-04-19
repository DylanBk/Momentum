from modules import *

load_dotenv()
# PORT = os.environ.get('FLASK_PORT') #dev port
PORT = os.environ.get('PORT') #prod port

if not PORT:
    PORT = 5000

SECRET_KEY = os.environ.get('FLASK_SECRET_KEY')

app = Flask(__name__, static_folder='../frontend/public')
app.secret_key = SECRET_KEY
app.permanent_session_lifetime = timedelta(minutes=30)
CORS(app)


# ROUTES


# USERS

@app.route('/api/signup', methods=['GET', 'POST'])
def signup():
    if not session:
        if request.method == 'POST':
            data = request.get_json()
            username, email, pw = data.values()

            if not db.user_exists(email):
                db.create_user(username, email, pw)

                return jsonify({"message": "successfully created user"}), 200
            return jsonify({"error": "A user with that email already exists"}), 400
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are already logged in"}), 400

@app.route('/api/login', methods=['GET', 'POST'])
def login():
    if not session:
        if request.method == 'POST':
            data = request.get_json()
            email, pw = data.values()

            if db.user_exists(email):
                if db.check_pw(email, pw):
                    user = db.get_user(email=email)

                    session['id'] = user.id
                    session['email'] = user.email
                    session['username'] = user.username
                    session['role'] = user.role

                    return jsonify({"message": "successfully logged in"}), 200
                return jsonify({"error": "Email or password incorrect"}), 400
            return jsonify({"error": "Email or password incorrect"}), 400
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are already logged in"}), 400

@app.route('/api/user/get', methods=['GET'])
def get_user_data():
    if session:
        user = db.get_user(id=session['id'])

        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }

        return jsonify({"message": "successfully retrieved user data", "data": user_data}), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/user/update', methods=['GET', 'POST'])
def update_account():
    if session:
        if request.method == 'POST':
            data = request.get_json()

            if db.check_pw(session['email'], data['password']):
                data.pop('password', None) # stops password from being updated too
                db.update_user(session['id'], data)

                return jsonify({"message": "successfully updated user"}), 200
            return jsonify({"error": "Incorrect password"}), 400
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/logout', methods=['GET'])
def logout():
    if session:
        session.clear()

        return jsonify({"message": "successfully logged out"}), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/user/delete', methods=['GET', 'POST'])
def delete_account():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            email, pw = data.values()

            if email == session['email'] and db.check_pw(session['email'], pw):
                db.delete_user(session['id'])
                session.clear()

                return jsonify({"message": "successfully deleted account"}), 200
            return jsonify({"error": "Incorrect email or password"}), 400
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401


# TODOS

@app.route('/api/todo/new', methods=['GET', 'POST'])
def new_todo():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            group, title, description = data.values()

            if group == '_': #TODO think of a better solution to allow symbols in names
                group = None

            if not group:
                db.create_todo(session['id'], None, title, description)
            else:
                group = db.get_group(user=session['id'], name=group)

                if group:
                    db.create_todo(session['id'], group['id'], title, description)

                    return jsonify({"message": "successfully created todo"}), 200
                return jsonify({"error": "Group does not exist"}), 400
            return jsonify({"message": "successfully created todo"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/todos/get', methods=['GET'])
def get_todos_data():
    if session:
        todos = db.get_todos_all(session['id'])

        return jsonify({"message": "successfully retrieved todos", "data": todos}), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/filtered-todos/get', methods=['GET', 'POST'])
def get_filtered_todos():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            state, groups = data.values()

            todos = db.get_todos_filtered(id=session['id'], state=state, groups=groups)

            return jsonify({"message": "successfully retrieved todos", "data": todos}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/todo/get', methods=['GET', 'POST'])
def get_todo_data():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id = data.values()

            todo = db.get_todo(id)

            return jsonify({"message": "successfully retrieved todo data", "data": todo}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/todo/update', methods=['GET', 'POST'])
def update_todo():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id, updates = data.values()

            db.update_todo(id, updates)

            return jsonify({"message": "successfully updated todo"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/todo/delete', methods=['GET', 'POST'])
def delete_todo():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id = data['id']

            db.delete_todo(id)

            return jsonify({"message": "successfully deleted todo"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401


# GROUPS

@app.route('/api/group/new', methods=['GET', 'POST'])
def new_group():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            name = data['name']

            db.create_group(session['id'], name)

            return jsonify({"message": "successfully created group"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/groups/get', methods=['GET', 'POST'])
def get_groups_data():
    if session:
        groups = db.get_groups_all(session['id'])

        return jsonify({"message": "successfully retrieved groups", "data": groups}), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/group/get', methods=['GET', 'POST'])
def get_group_data():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id = data['id']

            group = db.get_group(user=session['id'], id=id)

            return jsonify({"message": "successfully retrieved group data", "data": group}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401


@app.route('/api/group/update', methods=['GET', 'POST'])
def update_group_data():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id, updates = data.values()

            db.update_group(session['id'], id, updates)

            return jsonify({"message": "successfully updated"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401

@app.route('/api/group/delete', methods=['GET', 'POST'])
def delete_group():
    if session:
        if request.method == 'POST':
            data = request.get_json()
            id = data['id']

            db.delete_group(session['id'], id)

            return jsonify({"message": "successfully deleted group"}), 200
        return send_from_directory(app.static_folder, 'index.html'), 200
    return jsonify({"error": "You are not logged in"}), 401


# MAIN

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
    db.setup()