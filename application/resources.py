from flask import current_app as app, jsonify, request, render_template
from flask_restful import Resource, Api, reqparse, marshal_with, marshal, fields
from flask_security import auth_required, roles_required, current_user, roles_accepted
from werkzeug.security import generate_password_hash, check_password_hash
from .models import *
from .sec import datastore
from sqlalchemy import or_
from datetime import datetime
from .instances import cache


api = Api(prefix='/api')

# ---------------- Output fields in JSON format  --------------

class Creator(fields.Raw):
    def format(self, user):
        return user.username

category_fields = {
    "cid": fields.Integer(attribute="cid"),
    "categoryName": fields.String(attribute="categoryName"),
    'is_approved': fields.Boolean,
    'creator': Creator
}

product_fields = {
    "pid": fields.Integer(attribute="pid"),
    "productName": fields.String(attribute="productName"),
    "quantity": fields.Integer(attribute="quantity"),
    "unit": fields.String(attribute="unit"),
    "price": fields.Integer(attribute="price"),
    "manufacture_date": fields.String(attribute="manufacture_date"),
    "expiry_date": fields.String(attribute="expiry_date"),
    "category_id": fields.String(attribute="category")
}

activate_fields = {
    "uid": fields.Integer(attribute="uid")
}




category_args = reqparse.RequestParser()
category_args.add_argument("categoryName", required=True)

product_args = reqparse.RequestParser()
product_args.add_argument("productName", required=True)
product_args.add_argument("quantity", type=int)
product_args.add_argument("unit", type=str)
product_args.add_argument("price", type=int)
product_args.add_argument("manufacture_date", type=str)
product_args.add_argument("expiry_date", type=str)
product_args.add_argument("category_id", type=int)

activate_args = reqparse.RequestParser()
activate_args.add_argument("uid", required=True)




# -------------------------------- API classes --------------------------------


class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        city = data.get('city')
        state = data.get('state')
        country = data.get('country')
        pincode = data.get('pincode')
        address = data.get('address')
        mobileNo = data.get('mobileNo')
        role = data.get('role', 'user')  # Default to 'user' if role is not provided

        username_ = User.query.filter_by(username = username).first()
        if(username_) :
            return 'Username Already exists try with a different username'
            # Create a new user
         
        else:
            
            user = datastore.create_user(name = name, username = username, email = email, password = generate_password_hash(str(password)), city = city, state = state, country = country, pincode = pincode, address = address, mobileNo = mobileNo, active = False, roles=[Role.query.filter_by(name=role).first()])
        
            db.session.commit()

            return {'message': 'User created successfully'}, 201
            #except:
            #return {'message': 'Invalid input'}, 400



class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        
        if not username:
            return jsonify({"message": "username not provided"}), 400
        
        user = datastore.find_user(username=username)
        print(user.uid)
        #user.last_login = datetime.datetime.now()

        if not user:
            return jsonify({"message": "User Not Found"}), 404

        if check_password_hash(user.password, data.get("password")):
            user.lastLogin = datetime.now()
            db.session.commit()
            return jsonify({"token": user.get_auth_token(), "username": user.username, "role": user.roles[0].name, "user_id": user.uid})
        else:
            return jsonify({"message": "Wrong Password"}), 400
        
        
        
        

class CategoryApi(Resource):
    @auth_required("token")
    def get(self):
        if "admin" in current_user.roles:
            categories = Category.query.all()
        else:
            categories = Category.query.filter(
                or_(Category.is_approved == True, Category.edit_approval == True, Category.delete_approval == True, Category.creator == current_user)).all()
        if len(categories) > 0:
            return marshal(categories, category_fields)
        else:
            return {"message": "No Resourse Found"}, 404

    
    # CRUD operations
    #@marshal_with(category_fields)
    #@auth_required("token")
    #def get(self):
        #categories = Category.query.all()
        #return categories
        
    @auth_required("token")
    @roles_required("admin")
    #@roles_required("manager")
    #@roles_accepted("admin","manager")
    def post(self):
        print(current_user.uid)
        args = category_args.parse_args()
        #aid=get_jwt_identity()
        c = Category(categoryName=args.get("categoryName"), creator_id=current_user.uid, is_approved= True, edit_approval= True, delete_approval= True)
        db.session.add(c)
        db.session.commit()
        return {"message": "Category added "}

    """@auth_required("token")
    #@roles_required("admin")
    #@roles_required("manager")
    @roles_accepted("admin","manager")
    def post(self):
        print(current_user.uid)
        args = category_args.parse_args()
        #args = Role_args.parse_args()
        roles= Role.query.get(rid)
        if roles.name == admin:
            
        #aid=get_jwt_identity()
            c = Category(categoryName=args.get("categoryName"), creator_id=current_user.uid, is_approved= True)
        else:
            c = Category(categoryName=args.get("categoryName"), creator_id=current_user.uid, is_approved= False)
        db.session.add(c)
        db.session.commit()
        return {"message": "Category added "}"""

    @auth_required("token")
    @roles_required("admin")
    #@roles_accepted("admin","manager")
    def put(self, cid):
        info = category_args.parse_args()
        print(info)
        c = Category.query.get(cid)
        c.categoryName = info["categoryName"]
        db.session.commit()
        return {"categoryName": info['categoryName'], "status": "updated"}, 201

    @auth_required("token")
    @roles_required("admin")
    #@roles_accepted("admin","manager")
    def delete(self, cid):
        c = Category.query.filter_by(cid=cid).first()
        if not c:
            abort(404, message="Category dosen't exists!")
        else:
            db.session.delete(c)
            db.session.commit()
            return {"status":"deleted"}, 201
        
class ApproveCategory(Resource):
    @auth_required("token")
    def get(self):
        if "admin" in current_user.roles:
            categories = Category.query.all()
        else:
            categories = Category.query.filter(
                or_(Category.is_approved == True, Category.edit_approval == True, Category.delete_approval == True, Category.creator == current_user)).all()
        if len(categories) > 0:
            return marshal(categories, category_fields)
        else:
            return {"message": "No Resourse Found"}, 404

    
    # CRUD operations
    #@marshal_with(category_fields)
    #@auth_required("token")
    #def get(self):
        #categories = Category.query.all()
        #return categories
        
    @auth_required("token")
    @roles_required("manager")
    def post(self):
        print(current_user.uid)
        args = category_args.parse_args()
        #aid=get_jwt_identity()
        c = Category(categoryName=args.get("categoryName"), creator_id=current_user.uid, is_approved= False, edit_approval= False, delete_approval= False)
        db.session.add(c)
        db.session.commit()
        return {"message": "Category added "}

    

    @auth_required("token")
    @roles_required("manager")
    def put(self, cid):
        info = category_args.parse_args()
        print(info)
        c = Category.query.get(cid)
        c.categoryName = info["categoryName"]
        db.session.commit()
        return {"categoryName": info['categoryName'], "status": "updated"}, 201

    @auth_required("token")
    @roles_required("manager")
    def delete(self, cid):
        c = Category.query.filter_by(cid=cid).first()
        if not c:
            abort(404, message="Category dosen't exists!")
        else:
            db.session.delete(c)
            db.session.commit()
            return {"status":"deleted"}, 201
        

        
class ProductApi(Resource):
    # CRUD operations
    @marshal_with(product_fields)
    @auth_required("token")
    #@cache.cached(timeout=50)
    # get all product
    def get(self):
        products = Product.query.all()
        return products
    


    # create a new product
    #@marshal_with(product_fields)
    @auth_required("token")
    @roles_required("manager")
    def post(self):
        args = product_args.parse_args()
        #print()
        #p = Product(productName=args.get["productName"], quantity=args.get["quantity"], unit=args.get["unit"], price=args.get["price"], manufacture_date=args.get["manufacture_date"], expiry_date=args.get["expiry_date"], category_id=args.get["category_id"])
        p = Product(productName=args["productName"], quantity=args["quantity"], unit=args["unit"], price=args["price"], manufacture_date=args["manufacture_date"], expiry_date=args["expiry_date"], category_id=args["category_id"])
        db.session.add(p)
        db.session.commit()
        return {"message": "Product added "}

    # update a product
    @auth_required("token")
    @roles_required("manager")
    def put(self, pid):
        info = product_args.parse_args()
        print(info)
        p = Product.query.get(pid)
        p.productName = info["productName"]
        p.quantity = info["quantity"]
        p.unit = info["unit"]
        p.price = info["price"]
        p.manufacture_date = info["manufacture_date"]
        p.expiry_date = info["expiry_date"]
        p.category_id = info["category_id"]
        
        db.session.commit()
        return {"productName": info['productName'], "quantity": info["quantity"], "unit": info["unit"], "price": info["price"], "manufacture_date": info["manufacture_date"], "expiry_date": info["expiry_date"], "category_id": info["category_id"], "status": "updated"}, 201

    # delete a product
    @auth_required("token")
    @roles_required("manager")
    def delete(self, pid):
        p = Product.query.filter_by(pid=pid).first()
        if not p:
            abort(404, message="Product dosen't exists!")
        else:
            db.session.delete(p)
            db.session.commit()
            return {"status":"deleted"}, 201



user_fields = {
    "uid": fields.Integer,
    "username": fields.String,
    "active": fields.Boolean
}


class AllUsers(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        users = User.query.all()
        if len(users) == 0:
            return jsonify({"message": "No User Found"}), 404
        return marshal(users, user_fields)




class ActivateManager(Resource): 
    @auth_required("token")
    @roles_required("admin")   
    @marshal_with(activate_fields)
    def get(self, uid):
        print(uid)
        print(request.args) 
        print(type(request.args))  
        manager = User.query.get(uid)
        print(manager.name)
        print("hello world")
        if not manager:
            return jsonify({"message": "Manager not found"}), 404
        manager.active = True
        db.session.commit()
        return jsonify({"message": "User Activated"}), 200
    
class CategoryApproval(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self, cid):
        categories = Category.query.get(cid)
        if not categories:
            return jsonify({"message": "Category Not found"}), 404
        categories.is_approved = True
        db.session.commit()
        return jsonify({"message": "Aproved"})
    
class CategoryEditApproval(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self, cid):
        categories = Category.query.get(cid)
        if not categories:
            return jsonify({"message": "Category Not found"}), 404
        categories.edit_approval = True
        db.session.commit()
        return jsonify({"message": "Aproved"})
    
class CategoryDeleteApproval(Resource):
    @auth_required("token")
    @roles_required("admin")
    def get(self, cid):
        categories = Category.query.get(cid)
        if not categories:
            return jsonify({"message": "Category Not found"}), 404
        categories.delete_approval = True
        db.session.commit()
        return jsonify({"message": "Aproved"})
    

    
    
class UserHome(Resource):
    # CRUD operations
    @marshal_with(product_fields)
    @auth_required("token")
    # get all product
    def get(self):
        
        products = Product.query.all()
        #print(product.pid)
        return products



class SearchResource(Resource):
    #@cache.cached(timeout=50)
    def get(self):
        try:
            
            category_name = request.args.get('categoryName')
            min_price = request.args.get('min_price', type=int)
            max_price = request.args.get('max_price', type=int)

            if category_name and (min_price is None or max_price is None):
                

            
                query = Product.query.join(Category).filter(Category.categoryName == category_name)

            if min_price is not None and max_price is not None:
                query = Product.query.filter(Product.price.between(min_price, max_price))

            results = query.all()

            serialized_results = []
            for product in results:
                serialized_results.append({
                    'productName': product.productName,
                    'quantity': product.quantity,
                    'unit': product.unit,
                    'price': product.price,
                    'manufacture_date': product.manufacture_date,
                    'expiry_date': product.expiry_date,
                    'categoryName': product.category.categoryName
                })

            return jsonify({'products': serialized_results})

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return jsonify({'error': 'An unexpected error occurred'}), 500
        

        
class CartResource(Resource):
    @auth_required("token")
    def get(self, user_id):
        # Get items in the user's cart
        cart_items = Cart.query.filter_by(user_id=user_id).all()

        if not cart_items:
            return {'message': 'Cart is empty'}, 404

        cart_item_list = []
        for cart in cart_items:
            cart_item_data = {
                'cart_id': cart.cart_id,
                'cart_items': [{'product_id': item.product_Id, 'quantity': item.productQuantity, 'price': item.productPrice} for item in cart.cartItem]
            }
            cart_item_list.append(cart_item_data)

        return {'cart_items': cart_item_list}, 200

    @auth_required("token")
    def post(self):
        data = request.json
        user_id = data.get('user_id')
        product_id = data.get('product_id')

        productQuantity = int(data.get('productQuantity'))
        
        
        if not all([product_id, productQuantity, user_id]):
            return {'message': 'Product ID , user, quantity are required'}, 400
        user = User.query.get(user_id)

        product = Product.query.get(product_id)
        if user and product:
            if product.quantity >= productQuantity:
                user_cart=Cart.query.filter_by(user_id=user_id).first()
                if not user_cart:
            # Create a new order
                    cart = Cart(
                        user_id=user_id,
                        
                    )
                    # Add the order to the database
                    db.session.add(cart)
                    db.session.commit()

                # Create a new order item
                    #print(user_cart.cart_id)
                cart_item = CartItem(
                    
                    cart_id=user_cart.cart_id,
                    product_Id=product_id,
                    productQuantity=productQuantity,
                    productPrice=product.price
                )
                # Add the order item to the database
                db.session.add(cart_item)
                db.session.commit()
                
                product.quantity -= productQuantity
                db.session.commit()

                return {'message': 'Product added to cart successfully'}, 201
            else:
                    # Product is out of stock
                    return {'error': 'Product is out of stock'}, 400
        else:
            return {'error': 'User or product not found'}, 404

class OrderResource(Resource):
    @auth_required("token")
    def get(self, user_id):
        # Get orders for a specific user
        order_items = Order.query.filter_by(user_id=user_id).all()

        if not order_items:
            return {'message': 'No orders found for the user'}, 404

        order_list = []
        for order in order_items:
            order_data = {
                'oid': order.oid,
                'date': order.date,
                'total': order.total,
                'order_items': [{'product_id': item.product_Id, 'quantity': item.productQuantity, 'price': item.productPrice} for item in order.orderItem]
            }
            order_list.append(order_data)

        return {'order_items': order_list}, 200

    @auth_required("token")
    def post(self, user_id):
     
       
        user = User.query.get(user_id)
        user_cart=Cart.query.filter_by(user_id=user_id).first()
        total = 0
        order_items=[]
        for cart_item in user_cart.cartItem:
            product=Product.query.get(cart_item.product_Id)
            if product.quantity < cart_item.productQuantity:
                return {'error': 'Product quantity should be less than stock'}, 400
            total += product.price*cart_item.productQuantity
            
            order_item=OrderItem(product_Id=product.pid, productQuantity=cart_item.productQuantity, productPrice= product.price)
            order_items.append(order_item)
            
        new_order=Order(user_id=user_id,date=datetime.now(),total=total)
        
        new_order.orderItem=order_items
        db.session.add(new_order)
        db.session.delete(user_cart)
        db.session.commit()
        
        return {'message': 'Order successfully'}, 201
        
        
            
            
                 
        


           
                
        



api.add_resource(OrderResource, '/order', '/order/<int:user_id>')
api.add_resource(CartResource, '/cart', '/cart/<int:user_id>')      
api.add_resource(SearchResource, '/search')
api.add_resource(AllUsers, '/users')
api.add_resource(ActivateManager, '/activate/manager/<int:uid>')
api.add_resource(LoginResource, '/user-login')
api.add_resource(SignupResource, '/signup')
api.add_resource(CategoryApi, "/category", "/category/<int:cid>")
api.add_resource(ApproveCategory, "/approve_category", "/approve_category/<int:cid>")
api.add_resource(ProductApi, "/product", "/product/<int:pid>")
api.add_resource(CategoryApproval, '/categories/<int:cid>/approve')
api.add_resource(CategoryEditApproval, '/edit_category/<int:cid>/approve')
api.add_resource(CategoryDeleteApproval, '/delete_category/<int:cid>/approve')
api.add_resource(UserHome, '/userhome')





