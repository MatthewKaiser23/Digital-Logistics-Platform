from flask import Flask
from config.settings import Settings
from routes.main_routes import main
from routes.data_routes import data
from routes.admin_routes import admin
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv('venv/.env')

# create a Flask web application instance
app = Flask(__name__)

# configure the application
app.config.from_object(Settings)
# store the secret key environment variable
app.secret_key = os.getenv('SECRET_KEY')

# register blueprints for different parts of the application
app.register_blueprint(main) # main blueprint
app.register_blueprint(data) # data blueprint 
app.register_blueprint(admin) # admin blueprint

# starts the application
if __name__ == '__main__':
    app.run()
