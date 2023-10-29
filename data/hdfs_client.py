# data/hdfs_client.py
from config.settings import Settings
from flask import Flask
from hdfs import InsecureClient

# get the Flask web application instance
app = Flask(__name__)

# configure the application
app.config.from_object(Settings)

# create an HDFS client
hdfs_client = InsecureClient(app.config['HDFS_NAMENODE'], user=app.config['HDFS_USER'])
