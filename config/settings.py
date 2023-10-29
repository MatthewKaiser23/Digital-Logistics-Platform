# config/settings.py
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv('venv/.env')

# settings class with HDFS variables
class Settings:
    HDFS_NAMENODE = os.getenv('HDFS_NAMENODE') # stores the HDFS namenode environment variable
    HDFS_USER = os.getenv('HDFS_USER') # stores the HDFS user environment variable
    HDFS_PATH = os.getenv('HDFS_PATH') # stores the HDFS path environment variable
