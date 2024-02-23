from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import datetime
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    ru_id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.uid'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.rid'))
    
class User(db.Model, UserMixin):
    uid = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email= db.Column(db.String(100))
    password = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(3000),nullable=False)
    state = db.Column(db.String(5000),nullable=False)
    country = db.Column(db.String(5000),nullable=False)
    pincode = db.Column(db.String(1000),nullable=False)
    address = db.Column(db.String(1000),nullable=False)
    mobileNo = db.Column(db.Integer,nullable=False)
    active = db.Column(db.Boolean()) #new manager signup request to approve by admin
    lastLogin = db.Column(db.DateTime)
    fs_uniquifier = db.Column(db.String(255), unique=True)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    orders = db.relationship('Order', backref='user')
    
    cart = db.relationship('Cart', backref='user')#one to many relationship b/w user and order
    category_creator = db.relationship('Category', backref='creator')
    
class Role(db.Model, RoleMixin):
    rid = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Category(db.Model):
    cid = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True)
    categoryName = db.Column(db.String(1000),nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)
    edit_approval = db.Column(db.Boolean(), default=False)
    delete_approval = db.Column(db.Boolean(), default=False)
    products = db.relationship('Product', backref='category') #one to many relationship b/w category and product
    creator_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
   
    
class Product(db.Model):
    pid = db.Column(db.Integer,nullable=False,primary_key=True, autoincrement=True)
    productName = db.Column(db.String(100),nullable=False)
    quantity = db.Column(db.Integer,nullable=False)
    unit = db.Column(db.String(100),nullable=False)
    price = db.Column(db.Integer,nullable=False)
    manufacture_date = db.Column(db.String(3000),nullable=False)
    expiry_date = db.Column(db.String(3000),nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.cid'), nullable=False)
    order_item = db.relationship('OrderItem', backref='product')
    cart_item = db.relationship('CartItem', backref='product')#foreign key relation of category with product
   
    
class Order(db.Model):
    oid = db.Column(db.Integer,primary_key=True, nullable=False, autoincrement=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    date = db.Column(db.String(3000),nullable=False)
    total = db.Column(db.Integer,nullable=False)
    orderItem = db.relationship('OrderItem', backref='order') #one to many relationship b/w order and orderitem
    
class OrderItem(db.Model):  
    oi_id = db.Column(db.Integer,primary_key=True, nullable=False, autoincrement=True) 
    order_id = db.Column(db.Integer, db.ForeignKey('order.oid'), nullable=False)
    product_Id = db.Column(db.Integer, db.ForeignKey('product.pid'), nullable=False)
    productQuantity = db.Column(db.Integer,nullable=False)
    productPrice = db.Column(db.Integer,nullable=False)
    
class Cart(db.Model):   
    cart_id = db.Column(db.Integer,primary_key=True, nullable=False, autoincrement=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('user.uid'), nullable=False)
    cartItem = db.relationship('CartItem', backref='cart', cascade="all,delete-orphan")
    
class CartItem(db.Model):   
    ci_id = db.Column(db.Integer,primary_key=True, nullable=False, autoincrement=True) 
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.cart_id'), nullable=False)
    product_Id = db.Column(db.Integer, db.ForeignKey('product.pid'), nullable=False)
    productQuantity = db.Column(db.Integer,nullable=False)
    productPrice = db.Column(db.Integer,nullable=False)
    
    

    
    
    
    
    
    