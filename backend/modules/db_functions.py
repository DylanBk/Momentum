import bcrypt
from sqlalchemy import and_, or_

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

def create_todo(id: int, group: int, title: str, description: str):
    with Session() as s:
        todo = ToDo(user=id, group=group, title=title, description=description)

        s.add(todo)
        s.commit()

def get_todo(id: int) -> dict | bool:
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()

    if todo:
        todo_dict = todo.to_dict()

        return todo_dict
    return False

def get_todos_filtered(**kwargs: int | list) -> list[dict] | bool:
    state = kwargs.get('state', None)
    groups = kwargs.get('groups', None)
    print('s, g', state, groups)

    with Session() as s:
        todos = []

        # if all groups
        if groups and groups[0] == '*':
            groups = None

        # if ungrouped
        if groups and groups[0] == '!':
            todos = s.query(ToDo).filter(and_(ToDo.state == state, ToDo.group == None)).all()
        elif state and not groups:
            todos = s.query(ToDo).filter(ToDo.state == state).all()
        elif groups and not state:
            for group in groups:
                group_todos = s.query(ToDo).filter(ToDo.group == group).all()
                todos.extend(group_todos)  # Use extend to flatten the list
        elif state and groups:
            for group in groups:
                group_todos = s.query(ToDo).filter(and_(ToDo.state == state, ToDo.group == group)).all()
                todos.extend(group_todos)  # Use extend to flatten the list
        else:
            todos = s.query(ToDo).all()

    todos = [todo.to_dict() for todo in todos]

    return todos if todos else False

def get_todos_all(id: int) -> dict | bool:
    with Session() as s:
        todos = s.query(ToDo).filter(ToDo.user == id).all()

    if todos:
        todos_lst = []

        for i in todos:
            todo_dict = i.to_dict()
            todos_lst.append(todo_dict)

        return todos_lst
    return False

def update_todo(id: int, updates: dict) -> None:
    print(id, updates)
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()
        print(todo)

        if todo:
            for i, v in updates.items():
                print(i)
                print(v)
                setattr(todo, i, v)

        s.commit()

def delete_todo(id: int) -> None:
    with Session() as s:
        todo = s.query(ToDo).filter(ToDo.id == id).one_or_none()

        if todo:
            s.delete(todo)
            s.commit()

# -- GROUP FUNCTIONS --

# - GROUP CRUD -

def create_group(id: int, name: str):
    print(id, name)
    with Session() as s:
        group = Group(id, name)

        s.add(group)
        s.commit()

def get_group(**kwargs: int | str) -> dict | bool:
    user = kwargs.get('user', None)
    id = kwargs.get('id', None)
    name = kwargs.get('name', None)

    with Session() as s:
        if id:
            group = s.query(Group).filter(Group.id == id).one_or_none()
        else:
            group = s.query(Group).filter(and_(Group.user == user, Group.name == name)).one_or_none()

        print(user, name)

    if group:
        group_dict = group.to_dict()

        return group_dict
    return False

def get_groups_all(id: int) -> dict | bool:
    with Session() as s:
        groups = s.query(Group).filter(Group.user == id).all()

    if groups:
        groups_lst = []

        for i in groups:
            groups_lst.append(i.to_dict())

        return groups_lst
    return False

def update_group(user_id: int, id: int, updates: dict) -> None:
    with Session() as s:
        print(user_id, id, updates)
        group = s.query(Group).filter(and_(Group.user == user_id, Group.id == id)).one_or_none()

        print(group)

        for i, v in updates.items():
            print(i,v)
            setattr(group, i, v)

        s.commit()

def delete_group(user_id: int, id: int) -> None:
    with Session() as s:
        group = s.query(Group).filter(and_(Group.user == user_id, Group.id == id)).one_or_none()

        s.delete(group)
        s.commit()