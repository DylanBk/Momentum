import os
from sqlalchemy import MetaData, create_engine, inspect
from sqlalchemy.orm import sessionmaker

from .models import base


# create db file if it doesn't exist

instance_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../', 'instance'))

if not os.path.exists(instance_dir):
    os.makedirs(instance_dir)

db_path = os.path.join(instance_dir, 'db.db')


# setup db engine and ORM

engine = create_engine(f'sqlite:///{db_path}', echo=True)
base.metadata.create_all(bind=engine)
md = MetaData()
md.reflect(bind=engine)
Session = sessionmaker(bind=engine)
inspector = inspect(engine)