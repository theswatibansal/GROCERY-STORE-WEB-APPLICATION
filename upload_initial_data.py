from main import app
from application.sec import datastore
from application.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="Admin of grocery store")
    datastore.find_or_create_role(name="manager", description="Manager of grocery store")
    datastore.find_or_create_role(name="user", description="User of grocery store")
    db.session.commit()
    if not datastore.find_user(username="swatiadmin"):
        datastore.create_user(name="swati", username="swatiadmin", email="swatiadmin@gmail.com", password=generate_password_hash("admin"), city="newdelhi", state="delhi", country="india", pincode="121212k", address="20k", mobileNo=123456, roles=["admin"])
    if not datastore.find_user(username="manager1"):
        datastore.create_user(name="abc", username="manager1", email="abcmanager1@gmail.com", password=generate_password_hash("manager"), city="newdelhi", state="delhi", country="india", pincode="121212m", address="20m", mobileNo=123450, roles=["manager"], active=False)   
    """if not datastore.find_user(email="stud1@email.com"):
        datastore.create_user(email="stud1@email.com", password=generate_password_hash("stud1"), roles=["stud"])"""
    db.session.commit()