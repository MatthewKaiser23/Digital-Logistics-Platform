# routes/main_routes.py
from flask import render_template
from flask import Blueprint

# create a Blueprint named 'data'
main = Blueprint('main', __name__)

# route to home page
@main.route('/')
def index():
    return render_template('index.html')

# route to learn more page
@main.route('/description')
def learnMore():
    return render_template("learn_more.html")

# route to bookings page
@main.route('/bookings')
def Bookings():
    return render_template("bookings.html")