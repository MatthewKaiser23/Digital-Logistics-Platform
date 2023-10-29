# models/data_model.py
from data.hdfs_client import hdfs_client
from config.settings import Settings
import pandas as pd
from io import StringIO
from flask import Flask

# get the Flask web application instance
app = Flask(__name__)

# Configure the application
app.config.from_object(Settings)

# define the DataModel class to handle data operations
class DataModel:
    def __init__(self):
        # Initialize data attributes
        self.fsq_id = []
        self.name = []
        self.longitude = []
        self.latitude = []
        self.restaurant_days = []
        self.index = None
        self.lat = None
        self.lon = None
        self.result_string = None
        self.weather_description = []
        self.available_flights = []
        self.city = None
        self.travel_time = []
        self.information = []
        self.rating = None
        self.locations = []
        self.start = None
        self.end = None
        # define dictionaries for mapping day numbers to day names and destination names to airport codes
        self.day_mapping = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday"
        }
        self.destination_code = {
            'Paris': 'CDG',
            'Tokyo': 'HND',
            'New York': 'JFK',
            'San Francisco': 'SFO',
            'Chicago': 'ORD',
            'Barcelona': 'BCN',
            'London': 'LCY',
            'Dubai': 'DXB',
            'Bangkok': 'BKK',
            'Istanbul': 'IST',
            'Rome': 'FCO',
            'Sydney': 'SYD',
            'Hong Kong': 'HKG',
            'Mumbai': 'BOM',
            'Athens': 'ATH',
            'Lisbon': 'LIS',
            'Buenos Aires': 'EZE',
            'Rio de Janeiro': 'GIG',
            'Vancouver': 'YVR',
            'Seoul': 'ICN',
            'Mexico City': 'MEX',
            'Amsterdam': 'AMS',
            'Budapest': 'BUD',
            'Prague': 'PRG',
        }

    # method to save data to HDFS
    def save_data_to_hdfs(self, information):
        df = pd.DataFrame(information)
        with hdfs_client.write(app.config['HDFS_PATH'], overwrite=True) as writer:
            writer.write(df.to_csv(index=False))

    # method to get data from HDFS
    def get_data_from_hdfs(self):
        with hdfs_client.read(app.config['HDFS_PATH']) as reader:
            df = pd.read_csv(StringIO(reader.read().decode('utf-8')))
        # Return the data as a list of dictionaries
        return df.to_dict(orient='records')
