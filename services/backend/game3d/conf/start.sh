#!/bin/bash

redis-server --daemonize yes

sh /tmp/init_db.sh
service postgresql start

sleep 5
python3 manage.py makemigrations

sleep 5
python3 manage.py migrate

python3 manage.py createsuperuser --noinput # create superuser for admin

sleep 5
python3 manage.py runserver 0.0.0.0:8080
