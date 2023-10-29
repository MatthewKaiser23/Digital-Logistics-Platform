# routes/data_routes.py
from flask import Blueprint, render_template, request, jsonify, session
from models.data_model import DataModel
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv('venv/.env')

# create a Blueprint named 'admin'
admin = Blueprint('admin', __name__)

# create an instance of the DataModel class
data_model = DataModel()


# toute for the admin page
@admin.route('/admin')
def adminPage():
    return render_template("admin.html")

# route to save admin information
@admin.route('/admin_information' , methods=['POST'])
def admin_information():
    # add all the saved data to a list
    if(session.get('result_string')):
        admin_data = request.get_json(force=True)
        admin_data["rating"] = int(session.get('rating')/2)
        data_model.information.append(admin_data)

    # send the saved data to a HDFS
    data_model.save_data_to_hdfs(data_model.information)

    return jsonify({'success': True})


# route to get admin information
@admin.route('/get_admin_information' , methods=['GET'])
def get_admin_information():
    # add all the location data to a list
    if(session.get('result_string')):
        data_model.locations.append([session.get('start'), session.get('end')])

    # get the saved data from the HDFS
    information_data = data_model.get_data_from_hdfs()

    # return all the data
    return ({ "0":information_data, "1":data_model.locations, "3":os.getenv("OPENROUTESERVICE_API"), "4":os.getenv('OPENROUTESERVICE_URL_GEOJSON')})
