import datetime
import pytz

# Specify the time zone
#tz = pytz.timezone('Asia/Kolkata')

# Get the current time in the specified time zone
#current_time = datetime.datetime.now(tz)
broker_url = "redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"
#timezone = "Asia/kolkata"
timezone = pytz.timezone('Asia/Kolkata')
broker_connection_retry_on_startup=True


