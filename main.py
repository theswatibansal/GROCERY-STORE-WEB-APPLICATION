from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from application.instances import cache
from celery.schedules import crontab
from application.tasks import daily_reminder
from application.tasks import monthly_reminder


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views

    return app

app = create_app()
celery_app = celery_init_app(app)

    
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=22,minute=33),daily_reminder.s('yash@email.com', 'Daily Reminder'), name="Daily Reminder Task")
    sender.add_periodic_task(crontab(hour=22,minute=33),monthly_reminder.s('yash@email.com', 'Monthly Report'), name="Monthly Reminder ")
    #sender.add_periodic_task(crontab(day_of_month=1, hour=15, minute=0),monthly_reminder.s('yash@email.com', 'Monthly Report'), name="Monthly Reminder ")

    
    
if __name__ == '__main__':
    app.run(debug=True)