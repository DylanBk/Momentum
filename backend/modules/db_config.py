import os
from sqlalchemy import MetaData, create_engine, inspect
from sqlalchemy.orm import sessionmaker

from .models import base


# create db file if it doesn't exist

db_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../', 'db'))

if not os.path.exists(db_dir):
    os.makedirs(db_dir)

db_path = os.path.join(db_dir, 'db.db')


# setup db engine and ORM

engine = create_engine(f'sqlite:///{db_path}', echo=True)
base.metadata.create_all(bind=engine)
md = MetaData()
md.reflect(bind=engine)
Session = sessionmaker(bind=engine)
inspector = inspect(engine)