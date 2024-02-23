from celery import shared_task
from .models import Product, User, Role, Order, OrderItem
import flask_excel as excel
from .mail_service import send_message
import time
import calendar
from jinja2 import Environment, FileSystemLoader
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Template
import datetime
from celery.result import AsyncResult
from email.mime.application import MIMEApplication
from celery import Celery

@shared_task(ignore_result=False)
def product_csv():
    prod = Product.query.with_entities(
        Product.productName, Product.quantity, Product.unit, Product.price, Product.manufacture_date, Product.expiry_date, Product.category_id).all()

    csv_output = excel.make_response_from_query_sets(
        prod, ["productName", "quantity", "unit", "price", "manufacture_date", "expiry_date", "category_id"], "csv")
    filename = "test.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename





@shared_task(ignore_result=True)
def monthly_reminder(to, subject):
    orders = Order.query.all()
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    
    for user in users:
        orders = Order.query.filter_by(user_id=user.uid).all()
        for order in orders:
                with open('user_order_report.html') as f:
                        text_msg = Template(f.read())
                        send_message(user.email, subject, text_msg.render(user=user.name, orderid=order.oid, orderdate=order.date, total=order.total))
    return "OK"

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    time_now=datetime.datetime.now()
    start_day=datetime.datetime(time_now.year,time_now.month,time_now.day)
    for user in users:
        if(user.lastLogin):
            if(not(start_day<=user.lastLogin and user.lastLogin<=time_now)):
                send_message(user.email, subject, "Hi, You haven't visited/buy or grocery app. Please visit our app grap to exciting deals.")
        else:
            send_message(user.email, subject, "You haven't visited/buy or grocery app. Please visit our app grap to exciting deals.")      
    return "Check your inbox"    

    






   

    
