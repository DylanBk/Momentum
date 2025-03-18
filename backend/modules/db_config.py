import os
from sqlalchemy import MetaData, create_engine, inspect
from sqlalchemy.orm import sessionmaker

from .models import base

base_dir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(base_dir, '...', 'instance')
instance_dir = os.path.abspath(instance_dir)

if not os.path.exists(instance_dir):
    os.makedirs(instance_dir)

db_path = os.path.join(instance_dir, 'db.db')

engine = create_engine(f'sqlite:///{db_path}', echo=True)
base.metadata.create_all(bind=engine)
md = MetaData()
md.reflect(bind=engine)
Session = sessionmaker(bind=engine)
inspector = inspect(engine)