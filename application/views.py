from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
from .models import User, db
from .sec import datastore
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import product_csv

@app.get('/')
def home():
    return render_template("index.html")




@app.get('/download-csv')
def download_csv():
    task = product_csv.delay()
    return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Task Pending"}), 404




