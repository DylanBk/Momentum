import bcrypt

from . import models
from . import db_config

User = models.User
ToDo = models.ToDo

Session = db_config.Session

# --- DATABASE FUNCTIONS ---

def setup():
    with Session() as s:
        check = s.query(User).filter(User.email == 'admin@domain.com').one_or_none()

        if not check:
            pw = enc_pw('password')
            admin = User(username='Admin', email='admin@domain.com', password=pw, role='Admin')

            s.add(admin)
            s.commit()
    print("database setup complete")

# -- USER FUNCTIONS --

# - AUTH -

def user_exists(email):
    with Session() as s:
        user = s.query(User).filter(User.email == email).one_or_none()

    if user:
        return True
    return False

def enc_pw(pw: str):
    s = bcrypt.gensalt(10)
    b = pw.encode('utf-8')

    return bcrypt.hashpw(b, s)

def check_pw(pw: str):
    with Session() as s:
        b = pw.encode('utf-8')
        userPw = s.query(User.password).filter(User.password == pw).one_or_none()
    return bcrypt.checkpw(b, userPw)

# - USER CRUD -

def create_user(username: str, email: str, pw: str):
    with Session() as s:
        pw = enc_pw(pw)

        user = User(username, email, pw)

        s.add(user)
        s.commit()

def get_user(**kwargs) -> User:
    id = kwargs.get('id', None)
    email = kwargs.get('email', None)

    with Session() as s:
        if id:
            user = s.query(User).filter(User.id == id).one_or_none()
        else:
            user = s.query(User).filter(User.email == email).one_or_none()

    if user:
        return user
    return False

def update_user(id, updates):
    with Session() as s:
        user = s.query(User).filter(User.id == id).one_or_none()

        for i, v in updates.items():
            setattr(user, i, v)

        s.commit()

def delete_user(id):
    with Session() as s:
        user = s.query(User).filter(User.id == id).one_or_none()

        s.delete(user)
        s.commit()