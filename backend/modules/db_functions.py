import bcrypt

from . import models
from . import db_config

User = models.User
ToDo = models.ToDo
Group = models.Group

Session = db_config.Session


# --- DATABASE FUNCTIONS ---

def setup():
    with Session() as s:
        check = s.query(User).filter(User.email == 'admin@momentum.com').one_or_none()
        print(check)

        if not check:
            pw = enc_pw('password')
            admin = User(username='Admin', email='admin@momentum.com', password=pw, role='Admin')

            s.add(admin)
            s.commit()
            print('admin created')
    print("database setup complete")


# -- USER FUNCTIONS --

# - AUTH -

def user_exists(email: str):
    with Session() as s:
        user = s.query(User).filter(User.email == email).one_or_none()

    if user:
        return True
    return False

def enc_pw(pw: str):
    s = bcrypt.gensalt(10)
    b = pw.encode('utf-8')

    return bcrypt.hashpw(b, s)

def check_pw(email: str, pw: str):
    with Session() as s:
        b = pw.encode('utf-8')
        user_pw = s.query(User.password).filter(User.email == email).one_or_none()

    return bcrypt.checkpw(b, user_pw[0])

# - USER CRUD -

def create_user(username: str, email: str, pw: str):
    pw = enc_pw(pw)

    user = User(username, email, pw)
    print(user)
    
    with Session() as s:
        s.add(user)
        s.commit()

def get_user(**kwargs: int | str) -> User | bool:
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

def get_users_all() -> list[User] | bool:
    with Session() as s:
        users = s.query(User).all()

    if users:
        return users
    return False

def update_user(id: int, updates: dict):
    with Session() as s:
        user = s.query(User).filter(User.id == id).one_or_none()

        for i, v in updates.items():
            setattr(user, i, v)

        s.commit()

def delete_user(id: int):
    with Session() as s:
        user = s.query(User).filter(User.id == id).one_or_none()

        if user:
            s.delete(user)
            s.commit()


# -- TODO FUNCTIONS --

# - TODO CRUD -

def create_todo(id: int, group: str, title: str, description: str):
    with Session() as s:
        todo = ToDo(id, group, title, description)

        s.add(todo)
        s.commit()

def get_todo(id: int) -> dict | bool:
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()

    if todo:
        todo_dict = {}

        for v in todo:
            todo_dict[0] = {
                'group': v.group,
                'title': v.title,
                'description': v.description,
                'state': v.state,
                'created': v.created,
            }

        return todo_dict
    return False

def get_todos_all(id: int) -> dict | bool:
    with Session() as s:
        todos = s.query(ToDo).filter(ToDo.user == id).all()

    if todos:
        todos_lst = []

        for i in todos:
            todo = {
                'group': i.group,
                'title': i.title,
                'description': i.description,
                'state': i.state,
                'created': i.created.strftime('%d/%m/%Y'),
            }
            todos_lst.append(todo)
        
        print(todos_lst)

        return todos_lst
    return False

def update_todo(id: int, updates: dict):
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()

        if todo:
            for i, v in updates.items():
                setattr(todo, i, v)

        s.commit()

def delete_todo(id: int):
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()

        if todo:
            s.delete(todo)
            s.commit()

# -- GROUP FUNCTIONS --

# - GROUP CRUD -

def create_group(id: int, name: str):
    with Session() as s:
        group = Group(id, name)

        s.add(group)
        s.commit()

def get_group(id) -> dict | bool:
    with Session() as s:
        group = s.query(Group).filter(Group.id == id).one_or_none()

    if group:
        group_dict = {}

        for v in group:
            group_dict[0] = {
                'name': v.name
            }

        return group_dict
    return False

def get_groups_all(id: int) -> dict | bool:
    with Session() as s:
        groups = s.query(Group).filter(Group.user == id).all()

    if groups:
        groups_lst = []

        for i in groups:
            group = {
                'name': i.name
            }
            groups_lst.append(group)

        return groups_lst
    return False