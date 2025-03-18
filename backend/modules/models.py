from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

base = declarative_base()

class User(base):
    """
    User data model
    """

    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, unique=True)
    username = Column(String, unique=True)
    email = Column(String, unqiue=True)
    password = Column(String)

    def __init__(self, username: str, email: str, password: str, role=None):
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

    id = Column(Integer, primary_key=True, unique=True)
    user = Column(Integer, ForeignKey('Users.id'))
    group = Column(String)
    title = Column(String)
    description = Column(String)
    done = Column(Boolean, default=False)