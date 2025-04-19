from datetime import timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, session
from flask_cors import CORS

from . import db_functions as db