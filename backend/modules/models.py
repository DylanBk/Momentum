import datetime
from sqlalchemy import Column, Date, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

base = declarative_base()

class User(base):
    """
    User data model
    """

    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="User")
    created = Column(Date, default=datetime.datetime.utcnow())

    def __init__(self: object, username: str, email: str, password: str, role=None):
        self.username = username
        self.email = email
        self.password = password

        if role:
            self.role = role

    def to_dict(self: object) -> dict:
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'role': self.role,
            'created': self.created
        }

        return user_dict

class ToDo(base):
    """
    ToDo data model
    """

    __tablename__ = "ToDos"

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    user = Column(Integer, ForeignKey('Users.id'))
    group = Column(Integer, ForeignKey('Groups.id'))
    title = Column(String)
    description = Column(String)
    state = Column(Integer, default=0) # 0 = not done, 1 = in progress, 2 = done
    created = Column(Date, default=datetime.date.today())

    def __init__(self: object, user: int, group: str | None, title: str, description: str):
        self.user = user
        self.title = title
        self.description = description

        if group:
            self.group = group

    def to_dict(self: object) -> dict:
        todo_dict = {
            'id': self.id,
            'user': self.user,
            'group': self.group,
            'title': self.title,
            'description': self.description,
            'state': self.state,
            'created': self.created.isoformat()
        }

        return todo_dict

class Group(base):
    """
    Group data model
    """

    __tablename__ = "Groups"

    id = Column(Integer, primary_key=True, unique=True, autoincrement=True)
    user = Column(Integer, ForeignKey('Users.id'))
    name = Column(String, unique=True, default="New Group")

    def __init__(self: object, user: int, name: str):
        self.user = user
        self.name = name

    def to_dict(self: object) -> dict:
        group_dict = {
            'id': self.id,
            'user': self.user,
            'name': self.name
        }

        return group_dict