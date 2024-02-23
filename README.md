## Description
This is grocery store app where there is admin, manager, user. Admin can do CRUD operation on category, approve new manager signup and approve request of manager to do CRUD on category. Manger can do CRUD operation on product . User can search based on price, category name and can add multiple products in cart and buy them.


## Execution

1. Start all the servers in wsl/ubuntu Machine
2. Goto Root directory of the Project and start virtual environment source .env/bin/activate
3. run python app.py
4. Start redis server, redis-server
5. Start the celery worker, celery -A main.celery_app worker --loglevel INFO
6. Start the celery beat server, celery -A main.celery_app beat --loglevel INFO
7. Install and start the MailHog server, ~/go/bin/MailHog to receive  Mails 


Admin Credentials:
username: swatiadmin
password: admin
