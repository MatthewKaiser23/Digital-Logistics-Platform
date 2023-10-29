# routes/data_routes.py
from flask import Blueprint, request, jsonify, session
from models.data_model import DataModel
import requests
from geopy.geocoders import Nominatim
from amadeus import Client, ResponseError
from FlightRadar24 import FlightRadar24API
from pyspark import SparkContext
from dotenv import load_dotenv
import os

# create a blueprint named 'data'
data = Blueprint('data', __name__)

# create an instance of the DataModel class
data_model = DataModel()

# load environment variables
load_dotenv('venv/.env')

# Route to save data from the first form
@data.route('/save_form_data', methods=['POST'])
def save_form_data():

     # initialize a Spark context
    spark = SparkContext("local","MyApp")

    try:
        # empty lists
        data_model.name.clear()
        data_model.latitude.clear()
        data_model.longitude.clear()

        # get city and country from the first form data
        country = request.form.get('countrySelect')
        data_model.city = request.form.get('citySelect')

        # use geopy to get location coordinates
        geolocator = Nominatim(user_agent="myGeocoder")
        location = geolocator.geocode(f"{data_model.city}, {country}")

        # coordinates of selected city
        city_coordinates =f"{location.latitude},{location.longitude}"

        # define Foursquare API and parameters
        url = os.getenv('FORESQUARE_URL')
        Api_Key = os.getenv('FORESQUARE_API_KEY')

        params = {
            "categories":"13065",
            "ll": city_coordinates,
            "radius":"2000",
            "sort":"RATING"
        }

        headers = {
            "Accept": "application/json",
            "Authorization": Api_Key
        }


        # send a GET request to Foursquare API
        response = requests.request("GET", url, params=params, headers=headers)
        # process the response data using parallelization
        live_restaurant_data = response.json()
        live_restaurant_rdd = spark.parallelize(live_restaurant_data['results'])

        # store the processed data
        for venue in live_restaurant_rdd.collect():
            data_model.fsq_id.append(venue["fsq_id"])
            data_model.name.append(venue["name"])
            data_model.longitude.append(venue["geocodes"]["main"]["longitude"])
            data_model.latitude.append(venue["geocodes"]["main"]["latitude"])

        # end the spark context
        spark.stop()
        return jsonify({'success': True})
    
    except Exception as e:
        # end the spark context
        spark.stop()
        return jsonify({'success': False, 'error': str(e)})
    
# route to get data from the first form
@data.route('/get_form_data', methods=['GET'])
def get_form_data():
    return jsonify(data_model.name)

# route to save data from the second form
@data.route('/save_second_form_data', methods=['POST'])
def save_second_form_data():

    # initialize a Spark context
    spark = SparkContext("local","MyApp")

    # empty list
    data_model.restaurant_days.clear()

    #  get restaurant from the second form data
    restaurant = request.form.get('restaurantSelect')

    # get the index of selected restaurant
    if restaurant in data_model.name:
        index = data_model.name.index(restaurant)

    # get the coordinates of selected restaurant
    data_model.lat = data_model.latitude[index]
    data_model.lon = data_model.longitude[index]

    # define the url, params and api key for fetching restaurant details
    fs_url = os.getenv('FORESQUARE_DETAILS_URL')
    fs_params = os.getenv('FORESQUARE_PARAMS')
    authorization = os.getenv('FORESQUARE_API_KEY')

    url = f"{fs_url}{data_model.fsq_id[index]}?{fs_params}"

    headers = {
        "accept": "application/json",
        "Authorization": f"{authorization}"
    }

    # send a GET request to Foursquare API
    response = requests.get(url, headers=headers)
    
    # process the response data using parallelization
    live_days_data = response.json()
    live_days_rdd = spark.parallelize(live_days_data['hours']['regular'])

    # get the restaurants rating
    data_model.rating = live_days_data["rating"]
    session['rating'] = data_model.rating

    # store the processed data
    for entry in live_days_rdd.collect():
        day = data_model.day_mapping[entry["day"]]
        open_time = entry["open"]
        close_time = entry["close"]
        formatted_time = f"{day}: Open {open_time[:-2]}:{open_time[-2:]}, Close {close_time[:-2]}:{close_time[-2:]}"
        data_model.restaurant_days.append(formatted_time)

    # end the spark context
    spark.stop()
    return jsonify({'success': True})


# route to get data from the second form
@data.route('/get_second_form_data', methods=['GET'])
def get_second_form_data():
    return jsonify(data_model.restaurant_days)

# route to save data from the third form
@data.route('/save_third_form_data', methods=['POST'])
def save_third_form_data():

    # initialize a Spark context
    spark = SparkContext("local","MyApp")

    # empty list
    data_model.weather_description.clear()

    # store the open weather api key from eviroment variables
    API_KEY = os.getenv('OPENWEATHER_API_KEY')

    # define the url, api key and params for fetching weather data
    url = os.getenv('OPENWEATHER_URL')
    params = {
        'lat': f'{data_model.lat}',
        'lon': f'{data_model.lon}',
        'appid':API_KEY
    }

    response = requests.post(url, params=params)
    
    # process the response data using parallelization
    live_weather_data = response.json()
    live_weather_rdd = spark.parallelize(live_weather_data['weather'][0]['description'])
    
    # store the processed data
    weather_detail = live_weather_rdd.collect()
    data_model.weather_description.append(''.join(weather_detail))
    
    # end spark context
    spark.stop()
    return jsonify({'success': True})

# route to get data from the third form
@data.route('/get_third_form_data', methods=['GET'])
def get_third_form_data():
    return jsonify(data_model.weather_description)

# route to save data from the fourth form
@data.route('/save_fourth_form_data', methods=['POST'])
def save_fourth_form_data():

    # initialize a Spark context
    spark = SparkContext("local","MyApp")

    # empty lists
    data_model.travel_time.clear()
    data_model.available_flights.clear()

    # store the picked data from the fourth form data
    selected_date = request.form.get('datepicker')
    
    # define the url, params and api key for fetching airline details
    amadeus = Client(
    client_id= os.getenv('AMEDEUS_ID'),
    client_secret= os.getenv('AMEDUES_SECRET')
    )

    try:

        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode='CPT',
            destinationLocationCode=f'{data_model.destination_code[data_model.city]}',
            departureDate=f'{selected_date}',
            adults=1)

        # process the response data using parallelizatio
        live_flight_data = response.data
        live_flight_rdd = spark.parallelize(live_flight_data)


        # Iterate through flight offers and print details
        for offer in live_flight_rdd.collect():
            departure_time = offer['itineraries'][0]['segments'][0]['departure']['at']
            arrival_time = offer['itineraries'][0]['segments'][-1]['arrival']['at']
            airline = offer['validatingAirlineCodes'][0]
            data_model.available_flights.append(f"Airline: {airline} | Departure Time: {departure_time} | Arrival Time: {arrival_time}")     

    except ResponseError as error:
        print(error)

    fr_api = FlightRadar24API(...)

    # get the airport
    airport = fr_api.get_airport(data_model.destination_code[data_model.city])

    # store the coordinates of selected airline
    longitude_ = str(airport.longitude)
    latitude_ = str(airport.latitude)
    coordinates  = longitude_,latitude_
    data_model.result_string = coordinates[0] + ',' + coordinates[1]
    session['result_string'] = data_model.result_string
    airline_coordinates=data_model.result_string
    data_model.start = [float(coord) for coord in airline_coordinates.split(',')]
    session["start"] = data_model.start

    end_placeholder =f"{data_model.lon},{data_model.lat}"
    data_model.end = [float(coord) for coord in end_placeholder.split(',')]
    session["end"] = data_model.end

    # open serve route header
    headers = {

        'Authorization': os.getenv('OPENROUTESERVICE_API'),
    }

    # open serve route payload
    payload = {
        "coordinates": [data_model.start, data_model.end],
        "radiuses": [-1, 5000],  
    }

    # store the open serve route url from environment variables
    url = os.getenv('OPENROUTESERVICE_URL')

    response = requests.post(url, json=payload, headers=headers)

    # process the response data using parallelization
    live_distance_data = response.json()
    live_distance_rdd = spark.parallelize(str(live_distance_data["routes"][0]["segments"][0]["duration"]))
    
    # extract the travel time from the response
    total_time = live_distance_rdd.collect()
    t_time = float(''.join(total_time))

    # calculate the number of hours
    hours = t_time // 3600

    # calculate the remaining seconds
    remaining_seconds = t_time % 3600

    # calculate the number of minutes
    minutes = remaining_seconds // 60

    # store the travel time
    data_model.travel_time.append(f"{int(hours)} hours and {int(minutes)} minutes")
    
    # end spark context
    spark.stop()
    return jsonify({'success': True})

# route to get data from the fourth form
@data.route('/get_fourth_form_data', methods=['GET'])
def get_fourth_form_data():
    return({"0":data_model.available_flights, "1":data_model.travel_time})