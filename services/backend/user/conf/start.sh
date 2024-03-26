#!/bin/bash

sh /tmp/init_db.sh
service postgresql start

sleep 2

python3 manage.py makemigrations friends
python3 manage.py makemigrations profiles


python3 manage.py migrate

python3 manage.py runserver 0.0.0.0:8080
