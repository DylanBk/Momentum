import datetime
from sqlalchemy import Boolean, Column, Date, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

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

    def __init__(self: object, user: int, group: str, title: str, description: str):
        self.user = user
        self.group = group
        self.title = title
        self.description = description

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